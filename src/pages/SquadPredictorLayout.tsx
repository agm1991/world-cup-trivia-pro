/**
 * Shell for the four Squad & Predictor hub routes; shared chrome and outlet for each page.
 */
import { Component, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { ArrowLeft, LayoutGrid, Shield, Sparkles, Users } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { PREDICTOR_PATHS, type PredictorSection } from '@/lib/squadPredictorHubRoutes';
import {
  PUBLISH_SQUAD_SOURCE_CURRENT,
  SquadPredictorHubProvider,
  useSquadPredictorHub,
} from '@/contexts/SquadPredictorHubContext';
import fieldBackground from '@/assets/field-background.jpg';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';

class PredictorOutletErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(err: Error): { error: Error } {
    return { error: err };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="rounded-xl border border-destructive/60 bg-destructive/10 p-6 text-left">
          <p className="text-sm font-bold text-destructive">This predictor page hit an error</p>
          <p className="mt-2 font-mono text-xs text-foreground break-all">{this.state.error.message}</p>
          <button
            type="button"
            className="mt-4 rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold hover:bg-muted"
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const PREDICTOR_TAB_ITEMS: { id: PredictorSection; label: string; icon: typeof Users }[] = [
  { id: 'squad', label: 'Squad', icon: Users },
  { id: 'tournament', label: 'Tournament', icon: LayoutGrid },
  { id: 'awards', label: 'Awards', icon: Shield },
  { id: 'community', label: 'Community', icon: Sparkles },
];

function SquadPredictorLayoutInner() {
  const {
    hubTab,
    navigate,
    saveProfileOpen,
    setSaveProfileOpen,
    publishOpen,
    setPublishOpen,
    profileSquadTitle,
    setProfileSquadTitle,
    confirmProfileSave,
    confirmPublish,
    publishSquadSource,
    setPublishSquadSource,
    publishableSavedSquads,
  } = useSquadPredictorHub();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="relative py-10 px-4 sm:px-6 sm:py-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `linear-gradient(180deg, hsl(var(--background)) 0%, transparent 40%), url(${fieldBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto">
          <button
            type="button"
            onClick={() => navigate('/categories')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 p-1"
            aria-label="Back to categories"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <header className="mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[0.14em] text-foreground">
              WORLD CUP PREDICTOR
            </h1>
          </header>

          <div className="space-y-6 sm:space-y-8">
            <div className="sticky top-0 z-30 -mx-1 px-1 pb-2 pt-1 bg-background/90 backdrop-blur-md border-b border-border/60 sm:rounded-none">
              <nav
                className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1.5 rounded-xl bg-muted/50 p-1.5 shadow-inner ring-1 ring-border/40"
                aria-label="Predictor sections"
                role="tablist"
              >
                {PREDICTOR_TAB_ITEMS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={hubTab === id}
                    aria-current={hubTab === id ? 'page' : undefined}
                    onClick={() => navigate(PREDICTOR_PATHS[id])}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm px-3 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      hubTab === id
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            <PredictorOutletErrorBoundary>
              <Outlet />
            </PredictorOutletErrorBoundary>
          </div>

          <Dialog open={saveProfileOpen} onOpenChange={setSaveProfileOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save to player profile</DialogTitle>
                <DialogDescription>
                  Stores your full predictor state (squad, tournament picks, awards) on this device. Appears under
                  Community → Your squads and Player profile → 2026 squads.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-2">
                <Label htmlFor="profile-squad-title">Name this save</Label>
                <Input
                  id="profile-squad-title"
                  value={profileSquadTitle}
                  onChange={(e) => setProfileSquadTitle(e.target.value)}
                  placeholder="e.g. Brazil starting XI"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSaveProfileOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={confirmProfileSave}>
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
            <DialogContent className="max-h-[min(90vh,640px)] gap-0 overflow-hidden flex flex-col sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Publish to community</DialogTitle>
                <DialogDescription>
                  Choose which squad to share (your editor or any quick-saved nation / World XI). Entries appear on this
                  device under Community — World XI is highlighted at the top of the feed.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-3 min-h-0 flex-1 flex flex-col">
                <div className="space-y-2 shrink-0">
                  <Label htmlFor="publish-title">Title</Label>
                  <Input
                    id="publish-title"
                    value={profileSquadTitle}
                    onChange={(e) => setProfileSquadTitle(e.target.value)}
                    placeholder="Give your squad a name"
                  />
                </div>
                <div className="space-y-2 min-h-0 flex flex-col">
                  <Label>Squad to publish</Label>
                  <ScrollArea className="h-[min(240px,32vh)] rounded-md border border-border/80 pr-3">
                    <RadioGroup
                      value={publishSquadSource}
                      onValueChange={setPublishSquadSource}
                      className="gap-3 py-2 pl-1"
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem
                          value={PUBLISH_SQUAD_SOURCE_CURRENT}
                          id="publish-src-current"
                          className="mt-0.5"
                        />
                        <Label htmlFor="publish-src-current" className="font-normal leading-snug cursor-pointer">
                          <span className="font-semibold text-foreground">Current screen</span>
                          <span className="block text-xs text-muted-foreground">
                            Whatever you are editing now (needs a selected nation, or World XI if not locked).
                          </span>
                        </Label>
                      </div>
                      {publishableSavedSquads.map(({ key, label }) => (
                        <div key={key} className="flex items-start gap-3">
                          <RadioGroupItem value={key} id={`publish-src-${key}`} className="mt-0.5" />
                          <Label htmlFor={`publish-src-${key}`} className="font-normal leading-snug cursor-pointer">
                            <span className="font-semibold text-foreground">{label}</span>
                            <span className="block text-xs text-muted-foreground">From Quick save</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </ScrollArea>
                  {publishableSavedSquads.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No quick saves yet — use Quick save on the Squad tab to store more countries, or publish the current
                      screen.
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/60">
                <Button type="button" variant="outline" onClick={() => setPublishOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={confirmPublish}>
                  Publish
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export function SquadPredictorLayout() {
  return (
    <SquadPredictorHubProvider>
      <SquadPredictorLayoutInner />
    </SquadPredictorHubProvider>
  );
}

export default SquadPredictorLayout;
