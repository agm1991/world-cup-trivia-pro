import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

const shareButtonClass =
  'flex-1 rounded-xl border-primary/40 bg-background text-foreground hover:bg-primary/10 hover:border-primary/60 hover:text-primary font-semibold disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-foreground';

interface ShareMyScoreSectionProps {
  score: number;
}

export function ShareMyScoreSection({ score }: ShareMyScoreSectionProps) {
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(window.location.origin);
    setCanNativeShare(typeof navigator.share === 'function');
  }, []);

  const shareText = `I just scored ${score} on the World Cup Quiz! Can you beat me?`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: 'World Cup Quiz',
        text: shareText,
        url: shareUrl,
      });
    } catch {
      // User dismissed the share sheet.
    }
  };

  return (
    <div className="mb-6 text-left">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3 text-center">
        Share My Score
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button variant="outline" className={shareButtonClass} asChild>
          <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
            X / Twitter
          </a>
        </Button>
        <Button variant="outline" className={shareButtonClass} asChild>
          <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
        </Button>
        <Button
          variant="outline"
          className={shareButtonClass}
          onClick={handleNativeShare}
          disabled={!canNativeShare}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}
