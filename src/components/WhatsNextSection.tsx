import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Goal, User, ChevronRight } from 'lucide-react';

interface WhatsNextSectionProps {
  className?: string;
  /** Tighter spacing when used on Home under the fold */
  compact?: boolean;
}

/**
 * Shared “What’s next” quick links — play and profile.
 */
export const WhatsNextSection = ({ className = '', compact }: WhatsNextSectionProps) => {
  const navigate = useNavigate();
  const pad = compact ? 'p-4' : 'p-5';
  const iconBox = compact ? 'w-10 h-10' : 'w-12 h-12';

  return (
    <section className={className}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">What&apos;s Next</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your score and fastest times update as you complete levels. Explore more.
          </p>
        </div>
      </div>
      <div className={`grid sm:grid-cols-2 gap-3 ${compact ? 'md:gap-4' : 'gap-4'}`}>
        <Card
          className={`${pad} cursor-pointer hover:border-primary hover:shadow-lg transition-all group border-border bg-card/50`}
          onClick={() => navigate('/categories')}
        >
          <div className="flex items-start gap-3 md:gap-4">
            <div
              className={`${iconBox} rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors shrink-0`}
            >
              <Goal className={`${compact ? 'w-5 h-5' : 'w-6 h-6'} text-primary`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">Play to Climb</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Complete levels to earn coins and climb the ranks
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5" />
          </div>
        </Card>
        <Card
          className={`${pad} cursor-pointer hover:border-primary hover:shadow-lg transition-all group border-border bg-card/50`}
          onClick={() => navigate('/profile')}
        >
          <div className="flex items-start gap-3 md:gap-4">
            <div
              className={`${iconBox} rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors shrink-0`}
            >
              <User className={`${compact ? 'w-5 h-5' : 'w-6 h-6'} text-primary`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">Your Profile</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                View stats, achievements, and category breakdown
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5" />
          </div>
        </Card>
      </div>
    </section>
  );
};
