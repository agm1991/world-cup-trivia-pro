import { useEffect, useId, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { sendRestoreMagicLink } from '@/lib/restorePurchase';
import { toast } from 'sonner';

type RestorePurchaseModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** `sync` — account sync wording; `restore` (default) — purchase restore wording. */
  variant?: 'restore' | 'sync';
};

export function RestorePurchaseModal({
  open,
  onOpenChange,
  variant = 'restore',
}: RestorePurchaseModalProps) {
  const isSync = variant === 'sync';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const statusId = useId();

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      emailInputRef.current?.focus({ preventScroll: true });
    }, 100);
    return () => window.clearTimeout(timer);
  }, [open, sent]);

  const resetForm = () => {
    setSent(false);
    setEmail('');
    setStatusMessage(null);
    setLoading(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next && loading) return;
    if (!next) {
      resetForm();
    }
    onOpenChange(next);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setStatusMessage(null);
    const toastId = toast.loading('Sending link…');

    try {
      const result = await sendRestoreMagicLink(trimmed);

      if (!result.ok) {
        setStatusMessage(result.error);
        toast.error(result.error, { id: toastId, duration: 6000 });
        return;
      }

      setSent(true);
      setStatusMessage('Link sent — check your inbox and open it on this device.');
      toast.success('Magic link sent! Check your inbox and tap the link on this device.', {
        id: toastId,
        duration: 8000,
      });
    } catch {
      const message = 'Could not send the login link. Check your connection and try again.';
      setStatusMessage(message);
      toast.error(message, { id: toastId, duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="border-amber-400/30 bg-background sm:max-w-md left-0 right-0 top-auto bottom-0 w-full max-w-none translate-x-0 translate-y-0 rounded-t-2xl rounded-b-none border-b-0 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom sm:bottom-auto sm:left-[50%] sm:top-[50%] sm:w-full sm:max-w-md sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-lg sm:border-b sm:pb-6 sm:data-[state=open]:slide-in-from-left-1/2 sm:data-[state=open]:slide-in-from-top-[48%] sm:data-[state=closed]:slide-out-to-left-1/2 sm:data-[state=closed]:slide-out-to-top-[48%]"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          emailInputRef.current?.focus({ preventScroll: true });
        }}
        onInteractOutside={(event) => {
          if (loading) event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          if (loading) event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-amber-100">
            {isSync ? 'Sync account' : 'Log in / Restore purchase'}
          </DialogTitle>
          <DialogDescription>
            {isSync
              ? 'Sign in with your email to sync your profile, scores, coins, and progress across all your devices.'
              : 'Already paid on another device? If you previously paid £1 on your phone, laptop, or tablet, enter your email below. We will send you a magic link to instantly restore your access for free.'}
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
              We sent a link to <span className="font-medium text-foreground">{email.trim()}</span>.
              {isSync
                ? ' Open that email on this device and tap the link to sign in and sync your progress.'
                : ' Open that email on this phone or computer and tap the link to finish restoring access.'}
            </p>
            <Button type="button" variant="outline" className="w-full" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="restore-email" className="text-sm font-medium text-foreground">
                Email address
              </label>
              <Input
                ref={emailInputRef}
                id="restore-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="send"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-12 text-base touch-manipulation"
                aria-describedby={statusMessage ? statusId : undefined}
                aria-invalid={Boolean(statusMessage)}
              />
            </div>

            {statusMessage ? (
              <p id={statusId} className="text-sm text-destructive" role="alert">
                {statusMessage}
              </p>
            ) : null}

            <Button
              type="submit"
              className="h-12 w-full touch-manipulation bg-gradient-gold text-base font-bold"
              disabled={loading || !email.trim()}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                  Sending link…
                </>
              ) : (
                'Send login link'
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
