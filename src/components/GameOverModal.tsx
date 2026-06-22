import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, XCircle, RotateCcw } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  onRestart: () => void;
  questionNumber: number;
  totalQuestions: number;
  /** Leave the level (same as in-game back). Shown whenever set so users are not trapped behind the overlay. */
  onBack?: () => void;
}

export const GameOverModal = ({
  isOpen,
  onRestart,
  questionNumber,
  totalQuestions,
  onBack,
}: GameOverModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md text-center" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="flex flex-col items-center">
          <XCircle className="w-20 h-20 text-destructive mb-4" />
          <DialogTitle className="text-2xl font-bold text-foreground">Game Over: Level Failed</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            You answered incorrectly on question {questionNumber} of {totalQuestions}.
            <br />
            The level will restart from Question 1.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button onClick={onRestart} className="w-full gap-2" size="lg">
            <RotateCcw className="w-4 h-4" />
            Restart Level
          </Button>
          {onBack && (
            <Button type="button" variant="outline" onClick={onBack} className="w-full gap-2 border-border" size="lg">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
