import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  getWorldProfileCountryFlagEmojiFallback,
  getWorldProfileCountryFlagSources,
  resolveWorldProfileCountry,
  worldProfileCountries,
} from '@/data/worldProfileCountries';

export function WorldCountryFlag({ name, className }: { name: string; className?: string }) {
  const entry = resolveWorldProfileCountry(name);
  const sources = entry ? getWorldProfileCountryFlagSources(entry.code) : [];
  const [sourceIndex, setSourceIndex] = useState(0);

  useEffect(() => {
    setSourceIndex(0);
  }, [name]);

  const flagClassName = cn('inline-flex h-4 w-6 shrink-0 items-center justify-center rounded-sm bg-muted/40', className);

  if (!entry) {
    return (
      <span className={cn(flagClassName, 'text-xs leading-none')} aria-hidden>
        🌍
      </span>
    );
  }

  if (sourceIndex >= sources.length) {
    return (
      <span className={cn(flagClassName, 'text-base leading-none')} aria-hidden>
        {getWorldProfileCountryFlagEmojiFallback(entry.code)}
      </span>
    );
  }

  return (
    <img
      src={sources[sourceIndex]}
      alt=""
      className={cn(flagClassName, 'object-cover')}
      loading="eager"
      decoding="async"
      onError={() => setSourceIndex((index) => index + 1)}
    />
  );
}

type WorldCountrySelectProps = {
  value: string;
  onChange: (value: string) => void;
  emptyLabel?: string;
  placeholder?: string;
  className?: string;
  id?: string;
  /** Panel layout with always-visible search + list (profile forms). */
  variant?: 'dropdown' | 'panel';
};

export function WorldCountrySelect({
  value,
  onChange,
  emptyLabel = 'All countries',
  placeholder = 'Search countries...',
  className,
  id,
  variant = 'dropdown',
}: WorldCountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return worldProfileCountries;
    return worldProfileCountries.filter((c) => c.name.toLowerCase().includes(q));
  }, [search]);

  const pick = (name: string) => {
    onChange(name);
    setSearch('');
    setOpen(false);
  };

  const list = (
    <>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>
      <ScrollArea className={variant === 'panel' ? 'h-44' : 'h-64'}>
        <div className="space-y-0.5 p-1">
          <button
            type="button"
            onClick={() => pick('')}
            className={cn(
              'flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-muted',
              !value && 'bg-primary/10 text-primary',
            )}
          >
            <span className="flex h-4 w-6 shrink-0 items-center justify-center text-xs">🌍</span>
            <span className="font-medium">{emptyLabel}</span>
            {!value && <Check className="ml-auto h-4 w-4 shrink-0" />}
          </button>
          {filtered.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => pick(c.name)}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-muted',
                value === c.name && 'bg-primary/10 text-primary',
              )}
            >
              <WorldCountryFlag name={c.name} />
              <span className="font-medium">{c.name}</span>
              {value === c.name && <Check className="ml-auto h-4 w-4 shrink-0" />}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">No countries found</p>
          )}
        </div>
      </ScrollArea>
    </>
  );

  if (variant === 'panel') {
    return (
      <div id={id} className={cn('space-y-2', className)}>
        {list}
        {value && (
          <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
            <WorldCountryFlag name={value} className="h-5 w-7" />
            <span className="font-medium text-foreground">{value}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'h-auto min-h-[48px] w-full justify-between rounded-xl border-border bg-background px-3 py-3 text-left font-normal hover:bg-background',
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            {value ? (
              <>
                <WorldCountryFlag name={value} />
                <span className="truncate">{value}</span>
              </>
            ) : (
              <>
                <span className="text-base leading-none">🌍</span>
                <span className="truncate text-muted-foreground">{emptyLabel}</span>
              </>
            )}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(100vw-2rem,320px)] p-2" align="start">
        {list}
      </PopoverContent>
    </Popover>
  );
}
