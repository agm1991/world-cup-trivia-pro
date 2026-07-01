import { useCallback, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import {
  generateDeviceLinkCode,
  getSharedProfileId,
  normalizeLinkCode,
  redeemDeviceLinkCode,
} from '@/lib/deviceLinkSync';
import { Check, Copy, Link2, Loader2, Smartphone, Timer } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type LinkMode = 'choose' | 'generate' | 'enter';

interface LinkDeviceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatCountdown(msRemaining: number): string {
  const totalSec = Math.max(0, Math.ceil(msRemaining / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export function LinkDeviceModal({ open, onOpenChange }: LinkDeviceModalProps) {
  const { profile, gameStats, recentCompletions, hydrateFromLocalStorage } = useLocalProfile();
  const [mode, setMode] = useState<LinkMode>('choose');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [countdownMs, setCountdownMs] = useState(0);
  const [enterCode, setEnterCode] = useState('');
  const [enterError, setEnterError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [copied, setCopied] = useState(false);

  const resetState = useCallback(() => {
    setMode('choose');
    setGeneratedCode(null);
    setExpiresAt(null);
    setCountdownMs(0);
    setEnterCode('');
    setEnterError(null);
    setIsGenerating(false);
    setIsRedeeming(false);
    setCopied(false);
  }, []);

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open, resetState]);

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const remaining = expiresAt.getTime() - Date.now();
      setCountdownMs(remaining);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [expiresAt]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setEnterError(null);
    try {
      const result = await generateDeviceLinkCode(profile, gameStats, recentCompletions);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setGeneratedCode(result.code);
      setExpiresAt(result.expiresAt);
      setMode('generate');
      toast.success('Link code ready — share it with your other device.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = async () => {
    if (!generatedCode) return;
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      toast.message('Code copied to clipboard.');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy — select the code manually.');
    }
  };

  const handleRedeem = async () => {
    const normalized = normalizeLinkCode(enterCode);
    if (normalized.length !== 6) {
      setEnterError('Enter the full 6-character code.');
      return;
    }

    setIsRedeeming(true);
    setEnterError(null);
    try {
      const result = await redeemDeviceLinkCode(normalized);
      if (!result.ok) {
        setEnterError(result.message);
        return;
      }
      hydrateFromLocalStorage();
      toast.success('Devices linked — your stats will stay in sync.');
      onOpenChange(false);
    } finally {
      setIsRedeeming(false);
    }
  };

  const codeExpired = expiresAt != null && countdownMs <= 0;
  const linkedProfileId = getSharedProfileId();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-amber-500/20 bg-background/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Link2 className="h-5 w-5 text-amber-400" aria-hidden />
            Link Device
          </DialogTitle>
          <DialogDescription>
            Sync your profile, scores, and coins across devices — no email or login required.
          </DialogDescription>
        </DialogHeader>

        {linkedProfileId && mode === 'choose' && (
          <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100/90">
            This device is linked and will sync silently in the background.
          </div>
        )}

        {mode === 'choose' && (
          <div className="grid gap-3 pt-1">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className={cn(
                'group rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent p-4 text-left transition-all',
                'hover:border-amber-400/50 hover:bg-amber-500/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50',
                isGenerating && 'opacity-70 pointer-events-none',
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-400/30 bg-amber-500/15">
                  {isGenerating ? (
                    <Loader2 className="h-5 w-5 animate-spin text-amber-300" />
                  ) : (
                    <Smartphone className="h-5 w-5 text-amber-300" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground">Generate Link Code</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Use on the device that already has your stats. Creates a code valid for 15 minutes.
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('enter');
                setEnterError(null);
              }}
              className={cn(
                'group rounded-xl border border-border/80 bg-muted/20 p-4 text-left transition-all',
                'hover:border-amber-400/35 hover:bg-muted/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50',
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60">
                  <Link2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Enter Link Code</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Use on a new or empty device. Downloads the profile tied to that code.
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}

        {mode === 'generate' && generatedCode && (
          <div className="space-y-4 pt-1">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/90 mb-3">
                Your link code
              </p>
              <p
                className={cn(
                  'font-mono text-4xl font-black tracking-[0.35em] text-amber-100',
                  codeExpired && 'text-muted-foreground line-through',
                )}
                aria-live="polite"
              >
                {generatedCode}
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Timer className="h-4 w-4 shrink-0" aria-hidden />
                {codeExpired ? (
                  <span className="text-destructive">Code expired — generate a new one</span>
                ) : (
                  <span>Expires in {formatCountdown(countdownMs)}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="flex-1 gap-2"
                onClick={handleCopyCode}
                disabled={codeExpired}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy code'}
              </Button>
              <Button
                type="button"
                className="flex-1 bg-gradient-gold hover:bg-gradient-gold border border-primary-glow"
                onClick={() => {
                  resetState();
                  void handleGenerate();
                }}
                disabled={isGenerating}
              >
                {codeExpired ? 'Generate new code' : 'Refresh code'}
              </Button>
            </div>

            <Button type="button" variant="ghost" className="w-full" onClick={() => setMode('choose')}>
              Back
            </Button>
          </div>
        )}

        {mode === 'enter' && (
          <div className="space-y-4 pt-1">
            <div>
              <label htmlFor="link-code-input" className="text-sm font-medium text-foreground">
                6-character code
              </label>
              <Input
                id="link-code-input"
                value={enterCode}
                onChange={(e) => {
                  setEnterCode(normalizeLinkCode(e.target.value));
                  setEnterError(null);
                }}
                placeholder="ABC123"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                maxLength={6}
                className="mt-2 h-12 text-center font-mono text-xl tracking-[0.3em] uppercase"
                aria-invalid={Boolean(enterError)}
                aria-describedby={enterError ? 'link-code-error' : undefined}
              />
              {enterError && (
                <p id="link-code-error" className="mt-2 text-sm text-destructive" role="alert">
                  {enterError}
                </p>
              )}
            </div>

            <Button
              type="button"
              className="w-full bg-gradient-gold hover:bg-gradient-gold border border-primary-glow"
              onClick={() => void handleRedeem()}
              disabled={isRedeeming || enterCode.length !== 6}
            >
              {isRedeeming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Linking…
                </>
              ) : (
                'Link this device'
              )}
            </Button>

            <Button type="button" variant="ghost" className="w-full" onClick={() => setMode('choose')}>
              Back
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
