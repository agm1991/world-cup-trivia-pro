import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { AwardPoolEntry } from '@/data/squadPredictor2026AwardPool';

type Props = {
  id: string;
  value: string;
  onChange: (next: string) => void;
  items: AwardPoolEntry[];
  placeholder: string;
  searchPlaceholder?: string;
  emptyText?: string;
  /** Shown as the first line inside the open list (below search), e.g. nation lists A–Z. */
  listGroupHeading?: string;
};

export function AwardPickCombobox({
  id,
  value,
  onChange,
  items,
  placeholder,
  searchPlaceholder = 'Search…',
  emptyText = 'No match.',
  listGroupHeading,
}: Props) {
  const [open, setOpen] = useState(false);

  const v = value.trim();
  const selectedItem = v ? items.find((i) => i.label === v) : undefined;
  /** Empty, or value not in list (stale save): show placeholder so the box looks blank until user picks. */
  const showPlaceholder = !selectedItem;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-10 w-full justify-between font-normal"
        >
          <span className={cn('truncate', showPlaceholder && 'text-muted-foreground')}>
            {showPlaceholder
              ? placeholder
              : (selectedItem?.display ?? selectedItem?.label ?? placeholder)}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup
              className={cn(
                'max-h-[280px] overflow-y-auto',
                listGroupHeading &&
                  '[&_[cmdk-group-heading]]:sticky [&_[cmdk-group-heading]]:top-0 [&_[cmdk-group-heading]]:z-[1] [&_[cmdk-group-heading]]:bg-popover [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[0.7rem] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-primary',
              )}
              {...(listGroupHeading ? { heading: listGroupHeading } : {})}
            >
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  keywords={[item.label, item.nation, item.display].filter(Boolean) as string[]}
                  onSelect={() => {
                    onChange(v === item.label ? '' : item.label);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn('mr-2 h-4 w-4', v === item.label ? 'opacity-100' : 'opacity-0')}
                  />
                  <span className="truncate">{item.display ?? item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
