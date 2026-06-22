import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Star } from 'lucide-react';
import { defaultCountries } from '@/data/selectLegendCountries';
import type { Country, Player } from '@/data/selectLegendCountries';
import {
  allPlayers,
  getPlayerFullLevelCount,
  getPlayerWorldCupYearsForLevelsSorted,
  isThinLegendPlayer,
} from '@/data/playerQuestions';

export type { Country, Player };
export { defaultCountries };

/** URL slug for `/levels/player/:country` */
export function getCountrySlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getCountryBySlug(slug: string | undefined, list: Country[]): Country | undefined {
  if (!slug) return undefined;
  return list.find((c) => getCountrySlug(c.name) === slug);
}

function normalizeSearchToken(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

function extractWorldCupYearsFromQuery(q: string): number[] {
  const out: number[] = [];
  const re = /\b(19\d{2}|20\d{2})\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(q)) !== null) {
    const y = parseInt(m[1], 10);
    if (y >= 1930 && y <= 2038) out.push(y);
  }
  return out;
}

function stripNoiseWords(q: string): string {
  return q
    .replace(/\bworld\s*cup\b/gi, ' ')
    .replace(/\bfifa\b/gi, ' ')
    .replace(/\bwc\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokensMatchHaystack(haystack: string, needle: string): boolean {
  const h = normalizeSearchToken(haystack);
  const n = normalizeSearchToken(needle);
  if (!n) return false;
  if (h.includes(n)) return true;
  const tokens = n.split(/\s+/).filter((t) => t.length >= 2);
  if (tokens.length === 0) return false;
  return tokens.every((t) => h.includes(t));
}

function playerMatchesSearchText(countryName: string, playerName: string, textPart: string): boolean {
  if (!textPart) return false;
  return (
    tokensMatchHaystack(playerName, textPart) ||
    tokensMatchHaystack(`${countryName} ${playerName}`, textPart)
  );
}

type LegendSearchHit =
  | { kind: 'country'; country: Country; slug: string }
  | { kind: 'player'; player: Player; country: Country; slug: string; focusYear?: number };

function buildLegendSearchHits(rawQuery: string): LegendSearchHit[] {
  const trimmed = rawQuery.trim();
  const yearsInQuery = extractWorldCupYearsFromQuery(trimmed);
  if (trimmed.length < 2 && yearsInQuery.length === 0) return [];

  let remainder = trimmed;
  for (const y of yearsInQuery) {
    remainder = remainder.replace(new RegExp(`\\b${y}\\b`, 'g'), ' ');
  }
  const textPart = normalizeSearchToken(stripNoiseWords(remainder));
  const yearOnly = yearsInQuery.length > 0 && textPart.length === 0;

  const hits: LegendSearchHit[] = [];
  const seen = new Set<string>();

  const pushPlayer = (country: Country, player: Player, focusYear?: number) => {
    const key = `p:${player.id}`;
    if (seen.has(key)) return;
    seen.add(key);
    hits.push({
      kind: 'player',
      player,
      country,
      slug: getCountrySlug(country.name),
      focusYear,
    });
  };

  if (yearOnly) {
    for (const country of defaultCountries) {
      for (const player of country.players) {
        const meta = allPlayers.find((p) => p.id === player.id);
        const wy = meta?.worldCupYears ?? [];
        const firstHitYear = yearsInQuery.find((y) => wy.includes(y));
        if (firstHitYear == null) continue;
        pushPlayer(country, player, firstHitYear);
      }
    }
    hits.sort((a, b) =>
      a.kind === 'player' && b.kind === 'player'
        ? a.player.name.localeCompare(b.player.name, 'en', { sensitivity: 'base' })
        : 0,
    );
    return hits.slice(0, 36);
  }

  for (const country of defaultCountries) {
    const slug = getCountrySlug(country.name);

    if (textPart.length >= 2 && yearsInQuery.length === 0 && tokensMatchHaystack(country.name, textPart)) {
      const key = `c:${slug}`;
      if (!seen.has(key)) {
        seen.add(key);
        hits.push({ kind: 'country', country, slug });
      }
    }

    for (const player of country.players) {
      const meta = allPlayers.find((p) => p.id === player.id);
      const wy = meta?.worldCupYears ?? [];

      if (yearsInQuery.length > 0 && !yearsInQuery.some((y) => wy.includes(y))) continue;

      if (textPart.length < 2) {
        if (yearsInQuery.length > 0) {
          const fy = yearsInQuery.find((y) => wy.includes(y));
          if (fy != null) pushPlayer(country, player, fy);
        }
        continue;
      }

      if (!playerMatchesSearchText(country.name, player.name, textPart)) continue;

      const fy = yearsInQuery.find((y) => wy.includes(y));
      pushPlayer(country, player, fy);
    }
  }

  hits.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'country' ? -1 : 1;
    if (a.kind === 'country' && b.kind === 'country') {
      return a.country.name.localeCompare(b.country.name, 'en', { sensitivity: 'base' });
    }
    if (a.kind === 'player' && b.kind === 'player') {
      return a.player.name.localeCompare(b.player.name, 'en', { sensitivity: 'base' });
    }
    return 0;
  });

  return hits.slice(0, 42);
}

/** Gradient headline + nickname for country hub pages (optional per nation) */
export const countryStylesConfig: Record<string, { gradient: string; accentColor: string; nickname: string }> = {
  brazil: {
    nickname: 'A Seleção',
    accentColor: 'hsl(142 71% 45%)',
    gradient: 'linear-gradient(135deg, #009c3b 0%, #ffdf00 50%, #002776 100%)',
  },
  argentina: {
    nickname: 'La Albiceleste',
    accentColor: 'hsl(207 65% 60%)',
    gradient: 'linear-gradient(135deg, #75aadb 0%, #ffffff 45%, #20338a 100%)',
  },
  portugal: {
    nickname: 'A Seleção das Quinas',
    accentColor: 'hsl(145 63% 42%)',
    gradient: 'linear-gradient(135deg, #006847 0%, #da020e 50%, #ffdf00 100%)',
  },
  france: {
    nickname: 'Les Bleus',
    accentColor: 'hsl(220 58% 55%)',
    gradient: 'linear-gradient(135deg, #002395 0%, #ffffff 48%, #ed2939 100%)',
  },
  germany: {
    nickname: 'Die Mannschaft',
    accentColor: 'hsl(0 0% 90%)',
    gradient: 'linear-gradient(135deg, #000000 0%, #dd0000 50%, #ffce00 100%)',
  },
  spain: {
    nickname: 'La Furia Roja',
    accentColor: 'hsl(355 84% 52%)',
    gradient: 'linear-gradient(135deg, #c60b1e 0%, #ffc400 50%, #aa151b 100%)',
  },
  netherlands: {
    nickname: 'Oranje',
    accentColor: 'hsl(24 100% 52%)',
    gradient: 'linear-gradient(135deg, #ff6600 0%, #ffffff 48%, #ae1c28 100%)',
  },
};

const PlayerLevels = () => {
  const navigate = useNavigate();
  const [legendSearchQuery, setLegendSearchQuery] = useState('');

  const legendSearchHits = useMemo(() => buildLegendSearchHits(legendSearchQuery), [legendSearchQuery]);

  const navigateToLegendFromSearch = (playerId: string, focusYear?: number) => {
    const years = getPlayerWorldCupYearsForLevelsSorted(playerId);
    const thin = isThinLegendPlayer(playerId);
    const fullLevels = getPlayerFullLevelCount(playerId);

    if (focusYear == null || !years.includes(focusYear)) {
      navigate(`/player-levels/${playerId}`);
      return;
    }

    const idx = years.indexOf(focusYear);
    const level = idx + 1;

    if (thin) {
      const multi = years.length > 1;
      const navLevel = multi ? level : 1;
      navigate(`/player-game/${playerId}/${navLevel}`);
      return;
    }

    if (fullLevels >= 1) {
      navigate(`/player-kickoff/${playerId}/${level}`);
      return;
    }

    navigate(`/player-levels/${playerId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/categories')}
              className="border-border hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center">
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.12em] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                Select a Legend
              </h1>
              <p className="text-muted-foreground mt-2">Choose a country to see their legendary players</p>
            </div>
          </div>

          <div className="relative mx-auto mb-8 max-w-xl">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              value={legendSearchQuery}
              onChange={(e) => setLegendSearchQuery(e.target.value)}
              placeholder="Search country, player, or e.g. David Beckham 2002 World Cup"
              className="border-border bg-card/80 pl-10 pr-4 backdrop-blur-sm"
              aria-label="Search legends and countries"
              autoComplete="off"
            />
            {legendSearchHits.length > 0 && (
              <Card className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 max-h-[min(70vh,380px)] overflow-y-auto border-border py-1 shadow-lg">
                <ul className="divide-y divide-border/60" role="listbox">
                  {legendSearchHits.map((hit) =>
                    hit.kind === 'country' ? (
                      <li key={`c-${hit.slug}`} role="option">
                        <button
                          type="button"
                          className="flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-muted/80"
                          onClick={() => {
                            navigate(`/levels/player/${hit.slug}`);
                            setLegendSearchQuery('');
                          }}
                        >
                          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                            Country
                          </span>
                          <span className="text-base font-bold text-foreground">
                            {hit.country.flag} {hit.country.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Open legend roster ({hit.country.players.length}{' '}
                            {hit.country.players.length === 1 ? 'legend' : 'legends'})
                          </span>
                        </button>
                      </li>
                    ) : (
                      <li key={`p-${hit.player.id}-${hit.focusYear ?? 'all'}`} role="option">
                        <button
                          type="button"
                          className="flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-muted/80"
                          onClick={() => {
                            navigateToLegendFromSearch(hit.player.id, hit.focusYear);
                            setLegendSearchQuery('');
                          }}
                        >
                          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                            Legend
                          </span>
                          <span className="text-base font-bold text-foreground">{hit.player.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {hit.country.name}
                            {hit.focusYear != null ? ` · Jump to ${hit.focusYear}` : ' · Player hub'}
                          </span>
                        </button>
                      </li>
                    ),
                  )}
                </ul>
              </Card>
            )}
            {legendSearchQuery.trim().length >= 2 &&
              legendSearchHits.length === 0 &&
              extractWorldCupYearsFromQuery(legendSearchQuery).length === 0 && (
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  No matches — try another spelling or include a World Cup year (e.g. 2002).
                </p>
              )}
            {legendSearchQuery.trim().length >= 2 &&
              legendSearchHits.length === 0 &&
              extractWorldCupYearsFromQuery(legendSearchQuery).length > 0 && (
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  No players found for that year in this roster.
                </p>
              )}
          </div>

          {/* Country grid — full roster from selectLegendCountries (A–Z) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
            {defaultCountries.map((country) => (
              <Card
                key={country.name}
                className="p-4 cursor-pointer transition-all border border-border hover:border-primary/50"
                onClick={() => navigate(`/levels/player/${getCountrySlug(country.name)}`)}
              >
                <div className="text-center flex flex-col items-center gap-1.5">
                  <span className="text-5xl leading-none">{country.flag}</span>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-foreground leading-tight min-h-[2.25rem] flex items-center justify-center line-clamp-2 px-0.5">
                    {country.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <Star className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-primary font-semibold">
                      {country.players.length} {country.players.length === 1 ? 'Legend' : 'Legends'}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <p className="text-muted-foreground text-sm text-center max-w-xl mx-auto">
            Choose a nation to open its legend roster, or use the country links from your bookmarks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlayerLevels;
