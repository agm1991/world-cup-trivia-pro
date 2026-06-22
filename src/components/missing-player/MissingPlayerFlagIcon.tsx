import { isMissingPlayerImageFlag } from '@/lib/countryFlags';

type Props = {
  flag: string;
  emojiClassName?: string;
  imageClassName?: string;
};

/** Renders emoji or Ulster Banner PNG for Missing Player pitch / match headers. */
export function MissingPlayerFlagIcon({
  flag,
  emojiClassName = 'text-xl leading-none',
  imageClassName = 'h-4 w-6 object-cover rounded-sm',
}: Props) {
  if (isMissingPlayerImageFlag(flag)) {
    return <img src={flag} alt="" className={imageClassName} aria-hidden />;
  }
  return <span className={emojiClassName}>{flag}</span>;
}
