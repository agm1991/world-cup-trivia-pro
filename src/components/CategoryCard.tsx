import { Card } from '@/components/ui/card';
import { Category } from '@/types/game';

interface CategoryCardProps {
  category: Category;
  title: string;
  description: string;
  totalLevels: number;
  backgroundImage: string;
  /** Optional override for hero image URL (same as World Cup card styling). */
  image?: string;
  /** Flag imagery: dark letterbox + contain so white fields read clearly */
  imageVariant?: 'default' | 'flag';
  progress?: number;
  onClick: () => void;
}

export const CategoryCard = ({ 
  title, 
  description, 
  totalLevels, 
  backgroundImage,
  image,
  imageVariant = 'default',
  progress = 0,
  onClick 
}: CategoryCardProps) => {
  const isFlag = imageVariant === 'flag';
  const imgSrc = image ?? backgroundImage;

  return (
    <Card
      className="category-card golden-glow cursor-pointer overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 group rounded-2xl"
      onClick={onClick}
    >
      <div
        className={`relative h-48 overflow-hidden ${isFlag ? 'bg-[hsl(222_47%_7%)] ring-1 ring-inset ring-white/10' : ''}`}
      >
        <img 
          src={imgSrc} 
          alt={title}
          className={
            isFlag
              ? 'w-full h-full object-contain p-4 sm:p-5 transition-transform duration-300 group-hover:scale-[1.03]'
              : 'w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105'
          }
        />
        {isFlag ? (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[hsl(222_47%_7%)]/85 via-transparent to-transparent" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/35 to-transparent" />
        )}
      </div>
      <div className="p-6 bg-card">
        <h3 className="text-2xl font-bold mb-2 text-card-foreground">{title}</h3>
        <p className="text-muted-foreground mb-3 text-sm">{description}</p>
        <div className="flex items-center justify-between">
          <span className="play-button">
            PLAY
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{progress}% Complete</span>
        </div>
      </div>
    </Card>
  );
};
