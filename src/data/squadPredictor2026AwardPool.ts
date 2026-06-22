import { SQUAD_PREDICTOR_ALL_NATIONS } from '@/data/squadPredictor2026Groups';
import { squadPredictorTeamFlag } from '@/data/squadPredictorTeamFlags';
import { ENGLAND_2026_SQUAD_NAME_LIST } from '@/data/squadPredictorEnglandRoster2026';
import {
  PLAYERS_ALGERIA_35,
  PLAYERS_ARGENTINA_35,
  PLAYERS_AUSTRALIA_35,
  PLAYERS_AUSTRIA_35,
  PLAYERS_BELGIUM_35,
  PLAYERS_BOSNIA_35,
  PLAYERS_BRAZIL_35,
  PLAYERS_CANADA_35,
  PLAYERS_CAPE_VERDE_35,
  PLAYERS_COLOMBIA_35,
  PLAYERS_COTE_DIVOIRE_35,
  PLAYERS_CROATIA_35,
  PLAYERS_CURACAO_35,
  PLAYERS_CZECHIA_35,
  PLAYERS_DR_CONGO_35,
  PLAYERS_ECUADOR_35,
  PLAYERS_EGYPT_35,
  PLAYERS_FRANCE_35,
  PLAYERS_GERMANY_35,
  PLAYERS_GHANA_35,
  PLAYERS_HAITI_35,
  PLAYERS_IRAN_35,
  PLAYERS_IRAQ_35,
  PLAYERS_JAPAN_35,
  PLAYERS_JORDAN_35,
  PLAYERS_MEXICO_35,
  PLAYERS_MOROCCO_35,
  PLAYERS_NETHERLANDS_35,
  PLAYERS_NEW_ZEALAND_35,
  PLAYERS_NORWAY_35,
  PLAYERS_PANAMA_35,
  PLAYERS_PARAGUAY_35,
  PLAYERS_PORTUGAL_35,
  PLAYERS_QATAR_35,
  PLAYERS_SAUDI_ARABIA_35,
  PLAYERS_SCOTLAND_35,
  PLAYERS_SENEGAL_35,
  PLAYERS_SOUTH_AFRICA_35,
  PLAYERS_SOUTH_KOREA_35,
  PLAYERS_SPAIN_35,
  PLAYERS_SWEDEN_35,
  PLAYERS_SWITZERLAND_35,
  PLAYERS_TURKEY_35,
  PLAYERS_TUNISIA_35,
  PLAYERS_USA_35,
  PLAYERS_URUGUAY_35,
  PLAYERS_UZBEKISTAN_35,
} from '@/data/squadPredictorExpandedPlayerLists';

/**
 * Notable players expected in 2026 World Cup squads (one pool per qualified nation label).
 * Used for award picks; squad builder still uses mock rosters elsewhere.
 */
export const SQUAD_PREDICTOR_2026_NATION_PLAYERS: Record<string, readonly string[]> = {
  Mexico: [...PLAYERS_MEXICO_35],
  'South Africa': [...PLAYERS_SOUTH_AFRICA_35],
  'South Korea': [...PLAYERS_SOUTH_KOREA_35],
  Czechia: [...PLAYERS_CZECHIA_35],
  Canada: [...PLAYERS_CANADA_35],
  Bosnia: [...PLAYERS_BOSNIA_35],
  Qatar: [...PLAYERS_QATAR_35],
  Switzerland: [...PLAYERS_SWITZERLAND_35],
  Brazil: [...PLAYERS_BRAZIL_35],
  Morocco: [...PLAYERS_MOROCCO_35],
  Haiti: [...PLAYERS_HAITI_35],
  Scotland: [...PLAYERS_SCOTLAND_35],
  USA: [...PLAYERS_USA_35],
  Australia: [...PLAYERS_AUSTRALIA_35],
  Paraguay: [...PLAYERS_PARAGUAY_35],
  Turkey: [...PLAYERS_TURKEY_35],
  Germany: [...PLAYERS_GERMANY_35],
  Curaçao: [...PLAYERS_CURACAO_35],
  'Côte d\'Ivoire': [...PLAYERS_COTE_DIVOIRE_35],
  Ecuador: [...PLAYERS_ECUADOR_35],
  Netherlands: [...PLAYERS_NETHERLANDS_35],
  Japan: [...PLAYERS_JAPAN_35],
  Sweden: [...PLAYERS_SWEDEN_35],
  Tunisia: [...PLAYERS_TUNISIA_35],
  Belgium: [...PLAYERS_BELGIUM_35],
  Egypt: [...PLAYERS_EGYPT_35],
  Iran: [...PLAYERS_IRAN_35],
  'New Zealand': [...PLAYERS_NEW_ZEALAND_35],
  Spain: [...PLAYERS_SPAIN_35],
  'Cape Verde': [...PLAYERS_CAPE_VERDE_35],
  'Saudi Arabia': [...PLAYERS_SAUDI_ARABIA_35],
  Uruguay: [...PLAYERS_URUGUAY_35],
  France: [...PLAYERS_FRANCE_35],
  Norway: [...PLAYERS_NORWAY_35],
  Senegal: [...PLAYERS_SENEGAL_35],
  Iraq: [...PLAYERS_IRAQ_35],
  Argentina: [...PLAYERS_ARGENTINA_35],
  Algeria: [...PLAYERS_ALGERIA_35],
  Austria: [...PLAYERS_AUSTRIA_35],
  Jordan: [...PLAYERS_JORDAN_35],
  Portugal: [...PLAYERS_PORTUGAL_35],
  'DR Congo': [...PLAYERS_DR_CONGO_35],
  Uzbekistan: [...PLAYERS_UZBEKISTAN_35],
  Colombia: [...PLAYERS_COLOMBIA_35],
  England: [...ENGLAND_2026_SQUAD_NAME_LIST],
  Croatia: [...PLAYERS_CROATIA_35],
  Ghana: [...PLAYERS_GHANA_35],
  Panama: [...PLAYERS_PANAMA_35],
};

/** National-team managers aligned to the same nation labels (expected 2026 cycle). */
export const SQUAD_PREDICTOR_2026_MANAGERS: Record<string, string> = {
  Mexico: 'Javier Aguirre',
  'South Africa': 'Hugo Broos',
  'South Korea': 'Hong Myung-bo',
  Czechia: 'Ivan Hašek',
  Canada: 'Jesse Marsch',
  Bosnia: 'Sergej Barbarez',
  Qatar: 'Marquez López',
  Switzerland: 'Murat Yakin',
  Brazil: 'Dorival Júnior',
  Morocco: 'Walid Regragui',
  Haiti: 'Jean-Jacques Pierre',
  Scotland: 'Steve Clarke',
  USA: 'Gregg Berhalter',
  Australia: 'Graham Arnold',
  Paraguay: 'Gustavo Morínigo',
  Turkey: 'Vincenzo Montella',
  Germany: 'Julian Nagelsmann',
  Curaçao: 'Remko Bicentini',
  'Côte d\'Ivoire': 'Emerse Faé',
  Ecuador: 'Félix Sánchez Bas',
  Netherlands: 'Ronald Koeman',
  Japan: 'Hajime Moriyasu',
  Sweden: 'Jon Dahl Tomasson',
  Tunisia: 'Jalel Kadri',
  Belgium: 'Domenico Tedesco',
  Egypt: 'Hossam Hassan',
  Iran: 'Amir Ghalenoei',
  'New Zealand': 'Darren Bazeley',
  Spain: 'Luis de la Fuente',
  'Cape Verde': 'Pedro Brito',
  'Saudi Arabia': 'Roberto Mancini',
  Uruguay: 'Marcelo Bielsa',
  France: 'Didier Deschamps',
  Norway: 'Ståle Solbakken',
  Senegal: 'Aliou Cissé',
  Iraq: 'Jesús Casas',
  Argentina: 'Lionel Scaloni',
  Algeria: 'Vladimir Petković',
  Austria: 'Ralf Rangnick',
  Jordan: 'Hussein Ammouta',
  Portugal: 'Roberto Martínez',
  'DR Congo': 'Sébastien Desabre',
  Uzbekistan: 'Srećko Katanec',
  Colombia: 'Néstor Lorenzo',
  England: 'Thomas Tuchel',
  Croatia: 'Zlatko Dalić',
  Ghana: 'Otto Addo',
  Panama: 'Thomas Christiansen',
};

export type AwardPoolEntry = {
  id: string;
  label: string;
  nation: string;
  /** Optional richer label (e.g. flag + text); `label` stays the stored value. */
  display?: string;
};

function assertPoolComplete() {
  for (const n of SQUAD_PREDICTOR_ALL_NATIONS) {
    if (!SQUAD_PREDICTOR_2026_NATION_PLAYERS[n]?.length) {
      throw new Error(`Missing award pool players for nation: ${n}`);
    }
    if (!SQUAD_PREDICTOR_2026_MANAGERS[n]) {
      throw new Error(`Missing manager for nation: ${n}`);
    }
  }
}
assertPoolComplete();

let _playerFlat: AwardPoolEntry[] | null = null;

/** All pickable players for Golden Boot / Playmaker style awards (sorted by label). */
export function getAwardPoolPlayersFlat(): AwardPoolEntry[] {
  if (_playerFlat) return _playerFlat;
  const out: AwardPoolEntry[] = [];
  for (const nation of SQUAD_PREDICTOR_ALL_NATIONS) {
    const names = SQUAD_PREDICTOR_2026_NATION_PLAYERS[nation] ?? [];
    for (const name of names) {
      out.push({
        id: `${nation}::${name}`,
        label: `${name} (${nation})`,
        nation,
        display: `${squadPredictorTeamFlag(nation)} ${name} (${nation})`,
      });
    }
  }
  out.sort((a, b) => a.label.localeCompare(b.label));
  _playerFlat = out;
  return out;
}

let _managerFlat: AwardPoolEntry[] | null = null;

export function getAwardPoolManagersFlat(): AwardPoolEntry[] {
  if (_managerFlat) return _managerFlat;
  const out: AwardPoolEntry[] = [];
  for (const nation of SQUAD_PREDICTOR_ALL_NATIONS) {
    const name = SQUAD_PREDICTOR_2026_MANAGERS[nation]!;
    out.push({
      id: `mgr::${nation}`,
      label: `${name} (${nation})`,
      nation,
      display: `${squadPredictorTeamFlag(nation)} ${name} (${nation})`,
    });
  }
  out.sort((a, b) => a.label.localeCompare(b.label));
  _managerFlat = out;
  return out;
}
