import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { ProfileModal } from '@/components/ProfileModal';
import { RestorePurchaseModal } from '@/components/RestorePurchaseModal';
import { isProfileComplete, useLocalProfile } from '@/contexts/LocalProfileContext';
import { useGameAccess } from '@/contexts/GameAccessContext';
import { confirmPaidCheckout, hasGameAccess } from '@/lib/gameAccess';
import { syncGameAccessFromSupabase } from '@/lib/restorePurchase';
import { REQUIRE_PROFILE_TO_PLAY } from '@/constants/profileGate';
import { startKickOffCheckout } from '@/lib/stripeCheckout';
import { Goal, User } from 'lucide-react';
import { toast } from 'sonner';
import fieldBackground from '@/assets/field-background.jpg';
import worldCupTrophy from '@/assets/world_cup.webp';
import { WorldCountryFlag } from '@/components/WorldCountrySelect';

const Home = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { profile, showProfileModal, setShowProfileModal } = useLocalProfile();
  const profileComplete = isProfileComplete(profile);
  const hasSavedProfile = Boolean(profile?.name?.trim() && profile?.country);
  const { hasAccess, refreshAccess } = useGameAccess();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [restoringAccess, setRestoringAccess] = useState(false);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const paid = hasAccess || hasGameAccess();

  useEffect(() => {
    const checkout = searchParams.get('checkout');
    const sessionId = searchParams.get('session_id');
    const restore = searchParams.get('restore');

    if (restore === 'success') {
      let cancelled = false;
      setRestoringAccess(true);

      syncGameAccessFromSupabase()
        .then(async (verified) => {
          if (cancelled) return;
          if (verified) {
            await refreshAccess();
            toast.success('Purchase restored — welcome back!');
          } else {
            toast.error('No purchase found for this email. Use the same email from Stripe checkout.');
          }
        })
        .catch(() => {
          if (!cancelled) {
            toast.error('Could not restore access. Please try again.');
          }
        })
        .finally(() => {
          if (!cancelled) {
            setRestoringAccess(false);
            setSearchParams({}, { replace: true });
          }
        });

      return () => {
        cancelled = true;
      };
    }

    if (checkout !== 'success') {
      if (checkout === 'cancelled') {
        setSearchParams({}, { replace: true });
        toast.message('Payment cancelled — tap KICK OFF when you are ready.');
      }
      return;
    }

    if (!sessionId) {
      setSearchParams({}, { replace: true });
      toast.error('Payment could not be verified. Please try again.');
      return;
    }

    let cancelled = false;
    setVerifyingPayment(true);

    confirmPaidCheckout(sessionId)
      .then(async (verified) => {
        if (cancelled) return;
        if (verified) {
          await refreshAccess();
          toast.success('Payment successful — create your profile to play.');
        } else {
          toast.error('Payment was not completed. Please try again.');
        }
      })
      .catch(() => {
        if (!cancelled) {
          toast.error('Could not verify payment. Please try again.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setVerifyingPayment(false);
          setSearchParams({}, { replace: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams, setSearchParams, refreshAccess]);

  const startCheckout = () => {
    setCheckoutLoading(true);
    startKickOffCheckout().catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'Could not start checkout.';
      toast.error(message);
      setCheckoutLoading(false);
    });
  };

  const handleKickOff = () => {
    if (!hasGameAccess()) {
      startCheckout();
      return;
    }

    if (REQUIRE_PROFILE_TO_PLAY && !hasSavedProfile) {
      toast.message('Create your profile before you play.');
      navigate('/create-profile');
      return;
    }

    navigate('/categories');
  };

  const handleMyStats = () => {
    if (!hasGameAccess()) {
      toast.message('Pay £1 to unlock stats and leaderboards.');
      startCheckout();
      return;
    }
    navigate('/profile');
  };

  const confettiColors = ['hsl(45 93% 47%)', 'hsl(0 0% 100%)', 'hsl(45 100% 60%)', 'hsl(190 95% 45%)'];
  const confettiParticles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${6 + Math.random() * 4}s`,
    color: confettiColors[i % confettiColors.length],
    size: `${4 + Math.random() * 6}px`,
  }));

  const kickOffLabel = verifyingPayment
    ? 'Verifying payment…'
    : restoringAccess
      ? 'Restoring access…'
      : checkoutLoading
        ? 'Opening checkout…'
        : paid
          ? 'PLAY'
          : 'KICK OFF (£1)';

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(180deg, hsl(222 47% 3% / 0.6) 0%, hsl(222 47% 6% / 0.85) 50%, hsl(222 47% 8%) 100%), url(${fieldBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
        }}
      />

      <div className="tunnel-vignette" />
      <div className="stadium-lights" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="light-flare"
          style={{
            top: '5%',
            left: '15%',
            width: '200px',
            height: '200px',
            background: 'hsl(45 100% 60% / 0.15)',
            animationDelay: '0s',
          }}
        />
        <div
          className="light-flare"
          style={{
            top: '10%',
            right: '20%',
            width: '150px',
            height: '150px',
            background: 'hsl(45 100% 60% / 0.1)',
            animationDelay: '2s',
          }}
        />
        <div
          className="light-flare"
          style={{
            top: '0%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '300px',
            height: '150px',
            background: 'hsl(45 100% 60% / 0.08)',
            animationDelay: '1s',
          }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confettiParticles.map((particle) => (
          <div
            key={particle.id}
            className="confetti-particle"
            style={{
              left: particle.left,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
          />
        ))}
      </div>

      <Navigation transparent />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
          {profileComplete && profile && (
            <div className="mb-6 w-full max-w-lg rounded-xl border border-amber-400/35 bg-black/30 px-4 py-3 text-left backdrop-blur-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/90">
                Your profile
              </p>
              <div className="flex items-center gap-3">
                <WorldCountryFlag name={profile.country} className="h-9 w-12 shrink-0" />
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-lg font-bold text-amber-50">{profile.name}</p>
                  <p className="text-sm text-white/80">
                    {profile.gender} · {profile.age} · {profile.country}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="relative mb-8 md:mb-10">
            <div
              className="absolute inset-0 rounded-2xl blur-2xl opacity-70 scale-110"
              style={{ background: 'radial-gradient(ellipse at center, hsl(45 93% 55% / 0.45) 0%, transparent 65%)' }}
            />
            <div className="relative rounded-2xl overflow-hidden ring-2 ring-amber-400/60 shadow-[0_0_40px_hsl(45_93%_47%/0.45),0_12px_40px_rgba(0,0,0,0.45)] bg-black/20 max-w-[min(100%,280px)] md:max-w-[320px] mx-auto">
              <img
                src={worldCupTrophy}
                alt="FIFA World Cup trophy"
                className="w-full h-auto object-cover object-center block"
              />
            </div>
          </div>

          <h1 className="font-black mb-4 tracking-tight leading-[1.05] px-2">
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-amber-100 drop-shadow-[0_0_28px_hsl(45_93%_47%/0.65)]">
              WORLD CUP
            </span>
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mt-1 drop-shadow-lg">
              SHOWDOWN
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-3 font-medium">Only true fans survive.</p>
          <div
            className="h-px w-28 md:w-36 mx-auto mb-10 md:mb-12 rounded-full bg-gradient-to-r from-transparent via-amber-400/45 to-transparent"
            aria-hidden
          />

          <div className="flex w-full max-w-lg flex-col items-center gap-6">
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center sm:items-center">
              <Button
                size="lg"
                className="golden-glow w-full sm:w-auto text-xl md:text-2xl px-12 py-8 bg-gradient-gold hover:bg-gradient-gold border-2 border-primary-glow shadow-gold font-bold transition-transform duration-300 hover:scale-105 hover:animate-pulse gap-3"
                onClick={handleKickOff}
                disabled={checkoutLoading || verifyingPayment || restoringAccess}
              >
                <Goal className="w-7 h-7" />
                {kickOffLabel}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-xl md:text-2xl px-12 py-8 border-2 border-amber-400/70 text-amber-300 hover:bg-amber-500/10 hover:border-amber-300 font-bold backdrop-blur-sm bg-background/20"
                onClick={handleMyStats}
                disabled={checkoutLoading || verifyingPayment || restoringAccess}
              >
                MY STATS
              </Button>
            </div>

            {!paid && (
              <button
                type="button"
                onClick={() => setRestoreModalOpen(true)}
                disabled={checkoutLoading || verifyingPayment || restoringAccess}
                className="text-sm font-semibold text-amber-300/90 underline-offset-4 transition-colors hover:text-amber-200 hover:underline disabled:opacity-50"
              >
                Log In / Restore
              </button>
            )}

            {paid && REQUIRE_PROFILE_TO_PLAY && !hasSavedProfile && (
              <button
                type="button"
                onClick={() => navigate('/create-profile')}
                className="w-full rounded-xl border border-amber-400/25 bg-black/25 px-6 py-5 text-center backdrop-blur-sm transition-colors hover:border-amber-400/45 hover:bg-black/35"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/30 bg-amber-500/10">
                    <User className="h-5 w-5 text-amber-300" />
                  </div>
                  <span className="text-lg font-bold uppercase tracking-wide text-amber-100">Create profile</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      <ProfileModal open={showProfileModal} onOpenChange={setShowProfileModal} />
      <RestorePurchaseModal open={restoreModalOpen} onOpenChange={setRestoreModalOpen} />
    </div>
  );
};

export default Home;
