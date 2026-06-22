import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { Trophy, ArrowLeft } from 'lucide-react';

const PACKS = [
  {
    id: 'starter',
    name: 'Trialist Pack',
    price: 0.99,
    bonus: '100 Coins',
    subtext: 'Good for 3 hints per level',
    level: 'Starter',
    badge: null,
    isUltimate: false,
  },
  {
    id: 'popular',
    name: 'First Team Kit',
    price: 4.99,
    bonus: '600 Coins',
    subtext: 'Best value for casuals',
    level: 'Popular',
    badge: null,
    isUltimate: false,
  },
  {
    id: 'pro',
    name: "Captain's Vault",
    price: 9.99,
    bonus: '1,500 Coins + Remove All Ads',
    subtext: null,
    level: 'Pro',
    badge: 'MOST POPULAR',
    isUltimate: false,
  },
  {
    id: 'elite',
    name: 'Legendary Bundle',
    price: 24.99,
    bonus: "5,000 Coins + 50 'VAR' Streak Saves",
    subtext: null,
    level: 'Elite',
    badge: null,
    isUltimate: false,
  },
  {
    id: 'ultimate',
    name: 'The GOAT Pass',
    price: 49.99,
    bonus: 'Unlimited Coins + All Categories Unlocked',
    subtext: null,
    level: 'Ultimate',
    badge: null,
    isUltimate: true,
  },
] as const;

const Shop = () => {
  const navigate = useNavigate();

  const handleBuyNow = (productId: string) => {
    console.log('Selected product ID:', productId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Full-width dark section */}
      <main className="flex-1 w-full bg-gradient-to-b from-card to-background">
        {/* Back button - top left */}
        <div className="max-w-7xl mx-auto px-4 pt-6 pb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/categories')}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 -ml-2 p-2"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40 mb-4">
              <Trophy className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-wide">
              The Club Shop
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mt-2">
              Equip yourself for the Showdown
            </p>
          </div>
        </div>

        {/* Pricing grid - full width within container */}
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PACKS.map((pack) => (
              <Card
                key={pack.id}
                className={`
                  relative flex flex-col overflow-hidden transition-all duration-300
                  border-2 border-primary/50
                  ${pack.isUltimate ? 'club-shop-ultimate' : 'dark-card hover:border-primary/60'}
                  ${pack.badge ? 'ring-2 ring-primary/50' : ''}
                `}
              >
                {pack.badge && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 font-bold tracking-wide shadow-lg">
                      {pack.badge}
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-2 pt-6">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {pack.level}
                  </p>
                  <h3 className="text-lg font-bold text-foreground">{pack.name}</h3>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 space-y-2 pb-4">
                  <p className="text-2xl font-bold text-primary">£{pack.price.toFixed(2)}</p>
                  <p className="text-sm text-foreground font-medium text-center">
                    {pack.bonus}
                  </p>
                  {pack.subtext && (
                    <p className="text-xs text-muted-foreground text-center">{pack.subtext}</p>
                  )}
                </CardContent>
                <CardFooter className="pt-0 mt-auto">
                  <Button
                    onClick={() => handleBuyNow(pack.id)}
                    className="w-full premium-button py-5 font-bold"
                  >
                    Buy Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Shop;
