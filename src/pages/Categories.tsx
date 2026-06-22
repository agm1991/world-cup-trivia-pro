import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryCard } from '@/components/CategoryCard';
import { Navigation } from '@/components/Navigation';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { hasGameAccess } from '@/lib/gameAccess';
import { REQUIRE_PROFILE_TO_PLAY } from '@/constants/profileGate';
import { CATEGORIES_PAGE_DISPLAY_ITEMS, navigateCategoryItem } from '@/lib/categoryNavigation';

const Categories = () => {
  const navigate = useNavigate();
  const { profile } = useLocalProfile();
  const cards = CATEGORIES_PAGE_DISPLAY_ITEMS;

  useEffect(() => {
    if (!hasGameAccess()) {
      navigate('/', { replace: true });
      return;
    }
    if (REQUIRE_PROFILE_TO_PLAY && (!profile?.name?.trim() || !profile?.country)) {
      navigate('/create-profile', { replace: true });
    }
  }, [navigate, profile]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header — golden neon flicker (same wrapper pattern as home hero / nav logo) */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-wide md:tracking-wider uppercase px-2 [word-spacing:0.2em] text-amber-100 drop-shadow-md">
              PLAY NOW
            </h1>
            <p className="text-muted-foreground text-lg mt-2 tracking-widest uppercase">Select Your Game Mode</p>
          </div>

          {/* Full catalog grid — responsive columns; includes 2026 Squad & Predictor */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat.category}
                title={cat.title}
                description={cat.description}
                totalLevels={cat.totalLevels}
                backgroundImage={cat.backgroundImage}
                image={cat.image}
                imageVariant={cat.imageVariant}
                progress={0}
                onClick={() => navigateCategoryItem(navigate, cat)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
