import type { FootballRoleCode } from '@/data/squadPredictorPlayerRoleHints';

/**
 * England — FIFA-confirmed 26-man squad (Thomas Tuchel, June 2026).
 * Order: goalkeepers → defenders → midfielders → forwards.
 */
export const ENGLAND_2026_SQUAD_NAME_LIST = [
  'Jordan Pickford',
  'Dean Henderson',
  'James Trafford',
  'Reece James',
  'Dan Burn',
  'Marc Guéhi',
  'Ezri Konsa',
  'Tino Livramento',
  "Nico O'Reilly",
  'Jarell Quansah',
  'John Stones',
  'Djed Spence',
  'Elliot Anderson',
  'Jude Bellingham',
  'Jordan Henderson',
  'Declan Rice',
  'Kobbie Mainoo',
  'Eberechi Eze',
  'Anthony Gordon',
  'Noni Madueke',
  'Morgan Rogers',
  'Bukayo Saka',
  'Marcus Rashford',
  'Harry Kane',
  'Ivan Toney',
  'Ollie Watkins',
] as const;

export type England2026SquadEntry = {
  id: string;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  /** Primary NT/club role for strict pitch-slot filtering. */
  role: FootballRoleCode;
};

export const ENGLAND_2026_ROSTER_ENTRIES: readonly England2026SquadEntry[] = [
  { id: 'england-r26-0', name: 'Jordan Pickford', position: 'GK', role: 'GK' },
  { id: 'england-r26-1', name: 'Dean Henderson', position: 'GK', role: 'GK' },
  { id: 'england-r26-2', name: 'James Trafford', position: 'GK', role: 'GK' },
  { id: 'england-r26-3', name: 'Reece James', position: 'DEF', role: 'RB' },
  { id: 'england-r26-4', name: 'Dan Burn', position: 'DEF', role: 'CB' },
  { id: 'england-r26-5', name: 'Marc Guéhi', position: 'DEF', role: 'CB' },
  { id: 'england-r26-6', name: 'Ezri Konsa', position: 'DEF', role: 'CB' },
  { id: 'england-r26-7', name: 'Tino Livramento', position: 'DEF', role: 'RB' },
  { id: 'england-r26-8', name: "Nico O'Reilly", position: 'DEF', role: 'LB' },
  { id: 'england-r26-9', name: 'Jarell Quansah', position: 'DEF', role: 'CB' },
  { id: 'england-r26-10', name: 'John Stones', position: 'DEF', role: 'CB' },
  { id: 'england-r26-11', name: 'Djed Spence', position: 'DEF', role: 'LB' },
  { id: 'england-r26-12', name: 'Elliot Anderson', position: 'MID', role: 'CM' },
  { id: 'england-r26-13', name: 'Jude Bellingham', position: 'MID', role: 'CM' },
  { id: 'england-r26-14', name: 'Jordan Henderson', position: 'MID', role: 'CM' },
  { id: 'england-r26-15', name: 'Declan Rice', position: 'MID', role: 'DM' },
  { id: 'england-r26-16', name: 'Kobbie Mainoo', position: 'MID', role: 'CM' },
  { id: 'england-r26-17', name: 'Eberechi Eze', position: 'MID', role: 'AMC' },
  { id: 'england-r26-18', name: 'Anthony Gordon', position: 'FWD', role: 'LW' },
  { id: 'england-r26-19', name: 'Noni Madueke', position: 'FWD', role: 'RW' },
  { id: 'england-r26-20', name: 'Morgan Rogers', position: 'FWD', role: 'RW' },
  { id: 'england-r26-21', name: 'Bukayo Saka', position: 'FWD', role: 'RW' },
  { id: 'england-r26-22', name: 'Marcus Rashford', position: 'FWD', role: 'LW' },
  { id: 'england-r26-23', name: 'Harry Kane', position: 'FWD', role: 'ST' },
  { id: 'england-r26-24', name: 'Ivan Toney', position: 'FWD', role: 'ST' },
  { id: 'england-r26-25', name: 'Ollie Watkins', position: 'FWD', role: 'ST' },
];
