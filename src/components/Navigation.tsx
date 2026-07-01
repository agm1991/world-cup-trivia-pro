import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart3, LineChart, Menu as MenuIcon, Trophy, User } from 'lucide-react';
import { isProfileComplete, hasSavedProfile, useLocalProfile } from '@/contexts/LocalProfileContext';
import { HeaderTopStats } from '@/components/Header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ProfileModal } from '@/components/ProfileModal';
import { WorldCountryFlag } from '@/components/WorldCountrySelect';
import { GUEST_PROFILE_NAME } from '@/constants/profileGate';
import { cn } from '@/lib/utils';

interface NavigationProps {
  transparent?: boolean;
}

export const Navigation = ({ transparent = false }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, showProfileModal, setShowProfileModal } = useLocalProfile();
  const profileLocked = hasSavedProfile(profile);
  const showNamedProfile = isProfileComplete(profile) && location.pathname !== '/';

  const navClasses = transparent
    ? 'relative z-50 bg-background/20 backdrop-blur-xl border-b border-foreground/10'
    : 'relative z-50 bg-card/80 backdrop-blur-md border-b border-border';

  const menuButtonClass = cn(
    'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold shrink-0 transition-colors',
    transparent
      ? 'border-amber-500/40 text-foreground hover:bg-foreground/10 backdrop-blur-sm'
      : 'border-border text-foreground hover:bg-muted',
  );

  return (
    <>
      <nav
        className={cn(
          navClasses,
          'shrink-0 pt-[env(safe-area-inset-top,0px)]',
          '[@media(orientation:landscape)_and_(max-height:500px)]:sticky',
          '[@media(orientation:landscape)_and_(max-height:500px)]:top-0',
        )}
      >
        <div
          className={cn(
            'max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-4 flex items-center justify-between gap-2 sm:gap-3',
            '[@media(orientation:landscape)_and_(max-height:500px)]:py-2',
            '[@media(orientation:landscape)_and_(max-height:500px)]:gap-1.5',
          )}
        >
          <button
            onClick={() => navigate('/')}
            className={cn(
              'group relative z-10 flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0 rounded-xl px-1.5 py-1 sm:px-2 sm:py-1.5 -ml-1 text-left transition-colors',
              transparent
                ? 'hover:bg-white/[0.06] ring-1 ring-white/[0.08]'
                : 'hover:bg-muted/60 ring-1 ring-border/60',
            )}
            type="button"
          >
            <span
              className={cn(
                'flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg border shadow-sm',
                transparent
                  ? 'border-amber-400/35 bg-black/30 backdrop-blur-sm shadow-black/20'
                  : 'border-amber-500/25 bg-muted/50',
              )}
              aria-hidden
            >
              <Trophy className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-amber-400" strokeWidth={2} />
            </span>
            <span className="min-w-0 leading-none hidden min-[380px]:block [@media(orientation:landscape)_and_(max-height:500px)]:hidden">
              <span
                className={cn(
                  'block text-[0.625rem] font-semibold uppercase tracking-[0.2em]',
                  transparent ? 'text-amber-100/75' : 'text-muted-foreground',
                )}
              >
                World Cup
              </span>
              <span
                className={cn(
                  'mt-0.5 block text-base sm:text-lg font-black tracking-tight',
                  transparent
                    ? 'bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent dark:from-amber-400 dark:via-yellow-300 dark:to-amber-400',
                )}
              >
                Quiz
              </span>
            </span>
          </button>

          <div
            className={cn(
              'flex items-center gap-1 sm:gap-1.5 justify-end flex-1 min-w-0',
              '[@media(orientation:landscape)_and_(max-height:500px)]:gap-1',
            )}
          >
            {showNamedProfile ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    'flex items-center gap-2 sm:gap-3 max-w-[2.75rem] sm:max-w-[280px] px-1.5 sm:pl-2 sm:pr-3 py-1.5 rounded-full transition-colors border shrink-0',
                    '[@media(orientation:landscape)_and_(max-height:500px)]:max-w-[2.75rem]',
                    '[@media(orientation:landscape)_and_(max-height:500px)]:px-1.5',
                    transparent
                      ? 'bg-black/20 backdrop-blur-md border-white/12 hover:bg-black/30 hover:border-white/18'
                      : 'bg-muted/40 border-border/80 hover:bg-muted/55',
                  )}
                  aria-label={`Profile menu for ${profile.name}`}
                >
                  <WorldCountryFlag name={profile.country} className="h-6 w-9 sm:h-7 sm:w-10" />
                  <span className="hidden sm:flex min-w-0 flex-col items-start text-left leading-tight [@media(orientation:landscape)_and_(max-height:500px)]:hidden">
                    <span
                      className={cn(
                        'truncate text-sm font-semibold tracking-tight',
                        profile.name === GUEST_PROFILE_NAME ? 'text-amber-50/95' : 'text-foreground',
                      )}
                    >
                      {profile.name}
                    </span>
                  </span>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 bg-card border-border shadow-lg z-[100]">
                  <DropdownMenuItem
                    onClick={() => navigate('/create-profile')}
                    className="gap-2 cursor-pointer py-2.5 px-3"
                  >
                    <User className="w-4 h-4 text-primary shrink-0" />
                    {profileLocked ? 'My profile' : 'Create profile'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/profile')}
                    className="gap-2 cursor-pointer py-2.5 px-3"
                  >
                    <LineChart className="w-4 h-4 text-primary shrink-0" />
                    Stats
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate('/leaderboard')}
                    className="gap-2 cursor-pointer py-2.5 px-3"
                  >
                    <BarChart3 className="w-4 h-4 text-primary shrink-0" />
                    Leaderboard
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}

            <HeaderTopStats
              transparent={transparent}
              className={cn(
                'shrink-0 origin-right',
                '[@media(orientation:landscape)_and_(max-height:500px)]:scale-[0.88]',
              )}
            />

            <button
              type="button"
              onClick={() => navigate('/menu')}
              className={cn(menuButtonClass, 'px-2 sm:px-3', '[@media(orientation:landscape)_and_(max-height:500px)]:px-2')}
            >
              <MenuIcon className="w-4 h-4" />
              <span className="hidden sm:inline [@media(orientation:landscape)_and_(max-height:500px)]:hidden">Menu</span>
            </button>
          </div>
        </div>
      </nav>

      <ProfileModal open={showProfileModal} onOpenChange={setShowProfileModal} />
    </>
  );
};
