import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { IncomingMessage, ServerResponse } from "http";
import Stripe from "stripe";
import { componentTagger } from "lovable-tagger";
import { getSupabaseAdmin } from "./api/lib/supabaseAdmin";
import {
  ensureKickOffPurchaseForEmail,
  isKickOffSessionPaid,
  normalizePurchaseEmail,
  persistKickOffPurchaseFromSession,
} from "./api/lib/kickOffPurchase";

const DEFAULT_STRIPE_SECRET_KEY =
  "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";

function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw) as Record<string, unknown>);
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, status: number, payload: Record<string, unknown>): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function getRequestOrigin(req: IncomingMessage): string {
  const host = req.headers.host;
  if (!host) {
    return "";
  }
  const forwardedProto = req.headers["x-forwarded-proto"];
  const proto = (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto) ?? "http";
  return `${proto}://${host}`;
}

function isSameOriginUrl(url: string, origin: string): boolean {
  if (!origin) return false;
  try {
    return new URL(url).origin === origin;
  } catch {
    return false;
  }
}

function stripeCheckoutApiPlugin(mode: string) {
  return {
    name: "stripe-checkout-api",
    configureServer(server: { middlewares: { use: Function } }) {
      const env = loadEnv(mode, process.cwd(), "");
      const stripeSecretKey = env.STRIPE_SECRET_KEY || DEFAULT_STRIPE_SECRET_KEY;

      server.middlewares.use(
        "/api/create-checkout-session",
        async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (req.method !== "POST") {
            next();
            return;
          }

          try {
            const body = await readJsonBody(req);
            const origin = getRequestOrigin(req);
            const successUrl =
              typeof body.successUrl === "string" && isSameOriginUrl(body.successUrl, origin)
                ? body.successUrl
                : `${origin}/?checkout=success`;
            const cancelUrl =
              typeof body.cancelUrl === "string" && isSameOriginUrl(body.cancelUrl, origin)
                ? body.cancelUrl
                : `${origin}/?checkout=cancelled`;

            const stripe = new Stripe(stripeSecretKey);
            const session = await stripe.checkout.sessions.create({
              mode: "payment",
              customer_creation: "always",
              metadata: { product: "kick-off" },
              line_items: [
                {
                  price_data: {
                    currency: "gbp",
                    unit_amount: 100,
                    product_data: {
                      name: "World Cup Showdown — Kick Off",
                      description: "Full access to World Cup Showdown trivia",
                    },
                  },
                  quantity: 1,
                },
              ],
              success_url: successUrl,
              cancel_url: cancelUrl,
            });

            if (!session.url) {
              sendJson(res, 500, { error: "Stripe session created without a redirect URL." });
              return;
            }

            sendJson(res, 200, { url: session.url });
          } catch (error) {
            const message = error instanceof Error ? error.message : "Stripe checkout failed.";
            sendJson(res, 500, { error: message });
          }
        },
      );

      server.middlewares.use(
        "/api/verify-checkout-session",
        async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (req.method !== "POST") {
            next();
            return;
          }

          try {
            const body = await readJsonBody(req);
            const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";

            if (!sessionId.startsWith("cs_")) {
              sendJson(res, 400, { error: "Invalid checkout session id.", paid: false });
              return;
            }

            const admin = getSupabaseAdmin();
            if (!admin) {
              sendJson(res, 500, { error: "Purchase database is not configured.", paid: false });
              return;
            }

            const stripe = new Stripe(stripeSecretKey);
            const session = await stripe.checkout.sessions.retrieve(sessionId, {
              expand: ["customer", "payment_intent"],
            });

            if (!isKickOffSessionPaid(session)) {
              sendJson(res, 402, { error: "Payment not completed.", paid: false });
              return;
            }

            const { email } = await persistKickOffPurchaseFromSession(stripe, admin, session);

            sendJson(res, 200, { paid: true, email });
          } catch (error) {
            const message = error instanceof Error ? error.message : "Could not verify checkout session.";
            sendJson(res, 500, { error: message, paid: false });
          }
        },
      );

      server.middlewares.use(
        "/api/ensure-kick-off-purchase",
        async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (req.method !== "POST") {
            next();
            return;
          }

          try {
            const admin = getSupabaseAdmin();
            if (!admin) {
              sendJson(res, 500, { error: "Purchase database is not configured.", found: false });
              return;
            }

            const body = await readJsonBody(req);
            const rawEmail = typeof body.email === "string" ? body.email.trim() : "";
            const email = normalizePurchaseEmail(rawEmail);
            if (!email.includes("@") || !email.includes(".")) {
              sendJson(res, 400, { error: "Enter the email you used at Stripe checkout.", found: false });
              return;
            }

            const stripe = new Stripe(stripeSecretKey);
            const found = await ensureKickOffPurchaseForEmail(stripe, admin, email);
            sendJson(res, 200, { found });
          } catch (error) {
            const message = error instanceof Error ? error.message : "Could not look up purchase.";
            sendJson(res, 500, { error: message, found: false });
          }
        },
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
  },
  plugins: [react(), stripeCheckoutApiPlugin(mode), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
