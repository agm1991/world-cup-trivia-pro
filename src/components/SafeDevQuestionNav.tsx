import { Button } from '@/components/ui/button';

export type SafeDevQuestionNavProps = {
  currentIndex: number;
  totalCount: number;
  onPrevious: () => void;
  onNext: () => void;
};

/** Dev-only style row: browse questions without submitting answers. */
export function SafeDevQuestionNav({ currentIndex, totalCount, onPrevious, onNext }: SafeDevQuestionNavProps) {
  if (totalCount <= 0) return null;
  return (
    <div className="flex justify-center gap-3 pt-4 pb-2 mt-4 border-t border-border/50">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={currentIndex === 0}
        onClick={onPrevious}
        className="h-8 text-xs text-muted-foreground border-muted-foreground/30 hover:bg-muted/40"
      >
        ⬅️ Previous
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={currentIndex >= totalCount - 1}
        onClick={onNext}
        className="h-8 text-xs text-muted-foreground border-muted-foreground/30 hover:bg-muted/40"
      >
        Next ➡️
      </Button>
    </div>
  );
}
