import { useEffect, useMemo, useState } from 'react';
import type { Question } from '@/types/game';
import {
  isGuessWhoPhotoQuestion,
  resolveGuessWhoDisplayImage,
} from '@/lib/guessWhoImageResolve';

type Props = {
  question: Question;
  className?: string;
};

function buildFallbackUrls(question: Question, primarySrc?: string): string[] {
  const urls: string[] = [];
  const add = (url?: string) => {
    if (url && !urls.includes(url)) urls.push(url);
  };
  add(question.image);
  add(primarySrc);
  if (question.questionType === 'text') return urls;
  for (const letter of ['A', 'B', 'C', 'D'] as const) {
    add(
      resolveGuessWhoDisplayImage({
        ...question,
        image: undefined,
        correctAnswer: letter,
      }),
    );
  }
  return urls;
}

export function GuessWhoPhotoCard({ question, className }: Props) {
  const primarySrc = useMemo(() => resolveGuessWhoDisplayImage(question), [question]);
  const fallbacks = useMemo(
    () => buildFallbackUrls(question, primarySrc),
    [question, primarySrc],
  );
  const [srcIndex, setSrcIndex] = useState(0);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    setSrcIndex(0);
    setLoadFailed(false);
  }, [question.id, primarySrc]);

  const src = fallbacks[srcIndex];

  if (!src || loadFailed) return null;

  const isHalf = question.questionType === 'half-image';

  return (
    <div className={`mb-6 flex justify-center ${className ?? ''}`}>
      <div
        className={`relative overflow-hidden rounded-xl border-2 border-primary/35 bg-muted/30 shadow-sm ${
          isHalf ? 'w-full max-w-md h-64' : 'w-full max-w-md h-80 md:h-96'
        }`}
      >
        <img
          src={src}
          alt="Guess who I am"
          className={`w-full h-full object-cover object-top ${isHalf ? '' : ''}`}
          style={isHalf ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
          onError={() => {
            if (srcIndex + 1 < fallbacks.length) {
              setSrcIndex((i) => i + 1);
            } else {
              setLoadFailed(true);
            }
          }}
        />
        {isHalf && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/50 to-background pointer-events-none" />
        )}
      </div>
    </div>
  );
}

export { isGuessWhoPhotoQuestion };
