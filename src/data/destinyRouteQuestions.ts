// Destiny Route - Guess the order of opponents in a team's World Cup campaign
// Includes World Cup winners and other nations with campaigns (≤10 per country)
//
// `correctOrder` is chronological: first fixture → last (including the same opponent twice
// if met in group and again in knockouts). Group games follow the team's actual schedule order.

export interface DestinyRouteLevel {
  id: string;
  title: string;
  description: string;
  correctOrder: string[];
  year: number;
  team: string;
  isWinner?: boolean;
}

/** Map legacy / display names to canonical Destiny campaign keys. */
const DESTINY_ROUTE_TEAM_ALIASES: Record<string, string> = {
  'Republic of Ireland': 'Ireland',
};

/** Resolve picker / URL display names → canonical Destiny route team keys (`ALL_ROUTES` / `CAMPAIGN_ROUTES`). */
export function resolveDestinyTeamName(team: string): string {
  return DESTINY_ROUTE_TEAM_ALIASES[team] ?? team;
}

// World Cup winners: country -> year -> full path (group + knockout, include repeats when a team was played twice)
const WINNER_ROUTES: Record<string, Record<number, string[]>> = {
  Brazil: {
    1958: ['Austria', 'England', 'Soviet Union', 'Wales', 'France', 'Sweden'],
    1962: ['Mexico', 'Czechoslovakia', 'Spain', 'England', 'Chile', 'Czechoslovakia'],
    1970: ['Czechoslovakia', 'England', 'Romania', 'Peru', 'Uruguay', 'Italy'],
    1994: ['Russia', 'Cameroon', 'Sweden', 'United States', 'Netherlands', 'Sweden', 'Italy'],
    2002: ['Turkey', 'China', 'Costa Rica', 'Belgium', 'England', 'Turkey', 'Germany'],
  },
  Italy: {
    1934: ['United States', 'Spain', 'Austria', 'Czechoslovakia'],
    1938: ['Norway', 'France', 'Brazil', 'Hungary'],
    1982: ['Poland', 'Peru', 'Cameroon', 'Argentina', 'Brazil', 'Poland', 'Germany'],
    2006: ['Ghana', 'United States', 'Czech Republic', 'Australia', 'Ukraine', 'Germany', 'France'],
  },
  Germany: {
    1954: ['Turkey', 'Hungary', 'Yugoslavia', 'Austria', 'Hungary'],
    1974: ['Chile', 'Australia', 'East Germany', 'Poland', 'Yugoslavia', 'Netherlands'],
    1990: ['Yugoslavia', 'UAE', 'Colombia', 'Netherlands', 'Czechoslovakia', 'England', 'Argentina'],
    2014: ['Portugal', 'Ghana', 'United States', 'Algeria', 'France', 'Brazil', 'Argentina'],
  },
  Argentina: {
    1978: ['Hungary', 'France', 'Italy', 'Poland', 'Brazil', 'Peru', 'Netherlands'],
    1986: ['South Korea', 'Italy', 'Bulgaria', 'Uruguay', 'England', 'Belgium', 'Germany'],
    2022: ['Saudi Arabia', 'Mexico', 'Poland', 'Australia', 'Netherlands', 'Croatia', 'France'],
  },
  France: {
    1998: ['South Africa', 'Saudi Arabia', 'Denmark', 'Paraguay', 'Italy', 'Croatia', 'Brazil'],
    2018: ['Australia', 'Peru', 'Denmark', 'Argentina', 'Uruguay', 'Belgium', 'Croatia'],
  },
  Uruguay: {
    1930: ['Peru', 'Romania', 'Yugoslavia', 'Argentina'],
    1950: ['Bolivia', 'Spain', 'Sweden', 'Brazil'],
  },
  England: {
    1966: ['Uruguay', 'Mexico', 'France', 'Argentina', 'Portugal', 'Germany'],
  },
  Spain: {
    2010: ['Switzerland', 'Honduras', 'Chile', 'Portugal', 'Paraguay', 'Germany', 'Netherlands'],
  },
};

// Campaign routes for non-winners (≤10 campaigns per country): country -> year -> path
const CAMPAIGN_ROUTES: Record<string, Record<number, string[]>> = {
  // Africa (5)
  Brazil: {
    1930: ['Yugoslavia', 'Bolivia'],
    1934: ['Spain'],
    1938: ['Poland', 'Czechoslovakia', 'Czechoslovakia', 'Italy', 'Sweden'],
    1950: ['Mexico', 'Switzerland', 'Yugoslavia', 'Sweden', 'Spain', 'Uruguay'],
    1954: ['Mexico', 'Yugoslavia', 'Hungary'],
    1966: ['Bulgaria', 'Hungary', 'Portugal'],
    1974: ['Yugoslavia', 'Scotland', 'Zaire', 'East Germany', 'Argentina', 'Netherlands', 'Poland'],
    1978: ['Sweden', 'Spain', 'Austria', 'Peru', 'Argentina', 'Poland', 'Italy'],
    1982: ['Soviet Union', 'Scotland', 'New Zealand', 'Argentina', 'Italy'],
    1986: ['Spain', 'Algeria', 'Northern Ireland', 'Poland', 'France'],
    1990: ['Sweden', 'Costa Rica', 'Scotland', 'Argentina'],
    1998: ['Scotland', 'Morocco', 'Norway', 'Chile', 'Denmark', 'Netherlands', 'France'],
    2006: ['Croatia', 'Australia', 'Japan', 'Ghana', 'France'],
    2010: ['North Korea', 'Ivory Coast', 'Portugal', 'Chile', 'Netherlands'],
    2014: ['Croatia', 'Mexico', 'Cameroon', 'Chile', 'Colombia', 'Germany', 'Netherlands'],
    2018: ['Switzerland', 'Costa Rica', 'Serbia', 'Mexico', 'Belgium'],
    2022: ['Serbia', 'Switzerland', 'Cameroon', 'South Korea', 'Croatia'],
  },
  Germany: {
    1934: ['Belgium', 'Sweden', 'Czechoslovakia', 'Austria'],
    1938: ['Switzerland', 'Switzerland'],
    1958: ['Czechoslovakia', 'Argentina', 'Northern Ireland', 'Northern Ireland', 'Yugoslavia', 'Sweden'],
    1962: ['Switzerland', 'Chile', 'Italy'],
    1966: ['Switzerland', 'Argentina', 'Spain', 'Uruguay', 'Soviet Union', 'England'],
    1970: ['Morocco', 'Bulgaria', 'Peru', 'England', 'Italy', 'Uruguay'],
    1978: ['Poland', 'Tunisia', 'Mexico', 'Netherlands', 'Italy', 'Austria'],
    1982: ['Algeria', 'Chile', 'Austria', 'England', 'Spain', 'France', 'Italy'],
    1986: ['Uruguay', 'Scotland', 'Denmark', 'Morocco', 'Mexico', 'Argentina', 'France'],
    1994: ['Bolivia', 'Spain', 'South Korea', 'Belgium', 'Bulgaria', 'Italy'],
    1998: ['Iran', 'FR Yugoslavia', 'United States', 'Mexico', 'Croatia'],
    2002: ['Saudi Arabia', 'Republic of Ireland', 'Cameroon', 'Paraguay', 'United States', 'South Korea', 'Brazil'],
    2006: ['Costa Rica', 'Poland', 'Ecuador', 'Sweden', 'Argentina', 'Italy'],
    2010: ['Australia', 'Serbia', 'Ghana', 'England', 'Argentina', 'Spain'],
    2018: ['Mexico', 'Sweden', 'South Korea'],
    2022: ['Japan', 'Spain', 'Costa Rica'],
  },
  Uruguay: {
    1954: ['Czechoslovakia', 'Scotland', 'England', 'Hungary', 'Austria'],
    1962: ['Colombia', 'Yugoslavia', 'Soviet Union'],
    1966: ['England', 'France', 'Mexico', 'West Germany'],
    1970: ['Israel', 'Italy', 'Sweden', 'Soviet Union', 'Brazil', 'West Germany'],
    1974: ['Netherlands', 'Bulgaria', 'Sweden'],
    1986: ['West Germany', 'Denmark', 'Scotland', 'Argentina'],
    1990: ['Spain', 'Belgium', 'South Korea', 'Italy'],
    2002: ['Denmark', 'France', 'Senegal'],
    2010: ['France', 'South Africa', 'Mexico', 'South Korea', 'Ghana', 'Netherlands', 'Germany'],
    2014: ['Costa Rica', 'England', 'Italy', 'Colombia'],
    2018: ['Egypt', 'Saudi Arabia', 'Russia', 'Portugal', 'France'],
    2022: ['South Korea', 'Portugal', 'Ghana'],
  },
  Argentina: {
    1930: ['France', 'Mexico', 'Chile', 'United States', 'Uruguay'],
    1934: ['Sweden'],
    1958: ['West Germany', 'Northern Ireland', 'Czechoslovakia'],
    1962: ['Bulgaria', 'England', 'Hungary'],
    1966: ['Spain', 'West Germany', 'Switzerland', 'England'],
    1974: ['Poland', 'Italy', 'Haiti', 'Netherlands', 'Brazil', 'East Germany'],
    1982: ['Belgium', 'Hungary', 'El Salvador', 'Italy', 'Brazil'],
    1990: ['Cameroon', 'Soviet Union', 'Romania', 'Brazil', 'Yugoslavia', 'Italy', 'West Germany'],
    1994: ['Greece', 'Nigeria', 'Bulgaria', 'Romania'],
    1998: ['Japan', 'Jamaica', 'Croatia', 'England', 'Netherlands'],
    2002: ['Nigeria', 'England', 'Sweden'],
    2006: ['Ivory Coast', 'Serbia and Montenegro', 'Netherlands', 'Mexico', 'Germany'],
    2010: ['Nigeria', 'South Korea', 'Greece', 'Mexico', 'Germany'],
    2014: ['Bosnia and Herzegovina', 'Iran', 'Nigeria', 'Switzerland', 'Belgium', 'Netherlands', 'Germany'],
    2018: ['Iceland', 'Croatia', 'Nigeria', 'France'],
  },
  Morocco: {
    1970: ['West Germany', 'Peru', 'Bulgaria'],
    1986: ['Poland', 'England', 'Portugal'],
    1994: ['Belgium', 'Saudi Arabia', 'Netherlands'],
    1998: ['Norway', 'Brazil', 'Scotland'],
    2018: ['Iran', 'Portugal', 'Spain'],
    2022: ['Croatia', 'Belgium', 'Canada', 'Spain', 'Portugal', 'France', 'Croatia'],
  },
  Senegal: {
    2002: ['France', 'Denmark', 'Uruguay', 'Sweden', 'Turkey'],
    2018: ['Poland', 'Japan', 'Colombia'],
    // Group A: Netherlands, Qatar, Ecuador — then R16 vs England
    2022: ['Netherlands', 'Qatar', 'Ecuador', 'England'],
  },
  Tunisia: {
    1978: ['Mexico', 'Poland', 'West Germany'],
    1998: ['England', 'Colombia', 'Romania'],
    2002: ['Russia', 'Belgium', 'Japan'],
    2006: ['Saudi Arabia', 'Spain', 'Ukraine'],
    2018: ['England', 'Belgium', 'Panama'],
    2022: ['Denmark', 'Australia', 'France'],
  },
  Ghana: {
    2006: ['Italy', 'Czech Republic', 'United States', 'Brazil'],
    2010: ['Serbia', 'Australia', 'Germany', 'Uruguay'],
    2014: ['United States', 'Germany', 'Portugal'],
    2022: ['Portugal', 'South Korea', 'Uruguay'],
  },
  Cameroon: {
    1982: ['Peru', 'Poland', 'Italy'],
    1990: ['Argentina', 'Romania', 'Soviet Union', 'Colombia', 'England'],
    1994: ['Sweden', 'Brazil', 'Saudi Arabia', 'Russia'],
    1998: ['Austria', 'Chile', 'Italy', 'Denmark'],
    2002: ['Republic of Ireland', 'Saudi Arabia', 'Germany'],
    2010: ['Japan', 'Denmark', 'Netherlands'],
    2014: ['Mexico', 'Croatia', 'Brazil'],
    2022: ['Switzerland', 'Serbia', 'Brazil'],
  },
  // Asia (5)
  Japan: {
    1998: ['Argentina', 'Croatia', 'Jamaica'],
    2002: ['Belgium', 'Russia', 'Tunisia', 'Turkey'],
    2006: ['Australia', 'Croatia', 'Brazil'],
    2010: ['Cameroon', 'Netherlands', 'Denmark', 'Paraguay'],
    2014: ['Ivory Coast', 'Greece', 'Colombia'],
    2018: ['Colombia', 'Senegal', 'Poland', 'Belgium'],
    2022: ['Germany', 'Costa Rica', 'Spain', 'Croatia'],
  },
  'South Korea': {
    1998: ['Mexico', 'Netherlands', 'Belgium'],
    1954: ['Hungary', 'Turkey'],
    1986: ['Argentina', 'Bulgaria', 'Italy'],
    1990: ['Belgium', 'Spain', 'Uruguay'],
    1994: ['Spain', 'Bolivia', 'Germany', 'Italy'],
    2002: ['Poland', 'United States', 'Portugal', 'Italy', 'Spain', 'Germany'],
    2006: ['Togo', 'France', 'Switzerland'],
    2010: ['Greece', 'Argentina', 'Nigeria', 'Uruguay'],
    2014: ['Russia', 'Algeria', 'Belgium'],
    2018: ['Sweden', 'Mexico', 'Germany'],
    2022: ['Uruguay', 'Ghana', 'Portugal', 'Brazil'],
  },
  Iran: {
    1978: ['Netherlands', 'Scotland', 'Peru'],
    // Group F: FR Yugoslavia (14 Jun), Germany (21 Jun), United States (25 Jun)
    1998: ['FR Yugoslavia', 'Germany', 'United States'],
    2006: ['Mexico', 'Portugal', 'Angola'],
    2014: ['Nigeria', 'Argentina', 'Bosnia and Herzegovina'],
    2018: ['Morocco', 'Spain', 'Portugal'],
    2022: ['England', 'Wales', 'United States'],
  },
  'Saudi Arabia': {
    1994: ['Netherlands', 'Morocco', 'Belgium', 'Sweden'],
    1998: ['Denmark', 'France', 'South Africa', 'Belgium'],
    2002: ['Germany', 'Cameroon', 'Republic of Ireland'],
    2006: ['Tunisia', 'Ukraine', 'Spain'],
    2018: ['Russia', 'Uruguay', 'Egypt'],
    2022: ['Argentina', 'Poland', 'Mexico'],
  },
  Australia: {
    1974: ['East Germany', 'West Germany', 'Chile'],
    2006: ['Japan', 'Brazil', 'Croatia', 'Italy'],
    2010: ['Germany', 'Ghana', 'Serbia'],
    2014: ['Chile', 'Netherlands', 'Spain'],
    2018: ['France', 'Denmark', 'Peru'],
    2022: ['France', 'Tunisia', 'Denmark', 'Argentina'],
  },
  // Europe (5)
  Croatia: {
    1998: ['Jamaica', 'Japan', 'Argentina', 'Romania', 'Germany', 'France'],
    2002: ['Mexico', 'Ecuador', 'Italy'],
    2006: ['Brazil', 'Japan', 'Australia'],
    2014: ['Brazil', 'Cameroon', 'Mexico', 'Belgium'],
    2018: ['Nigeria', 'Argentina', 'Iceland', 'Denmark', 'Russia', 'England', 'France'],
    2022: ['Morocco', 'Canada', 'Belgium', 'Japan', 'Brazil', 'Argentina'],
  },
  Netherlands: {
    1934: ['Switzerland'],
    1938: ['Czechoslovakia'],
    1974: ['Uruguay', 'Sweden', 'Bulgaria', 'Argentina', 'East Germany', 'Brazil', 'West Germany'],
    1978: ['Iran', 'Peru', 'Scotland', 'Austria', 'West Germany', 'Italy', 'Argentina'],
    1990: ['Egypt', 'England', 'Republic of Ireland', 'West Germany'],
    1994: ['Saudi Arabia', 'Belgium', 'Morocco', 'Republic of Ireland', 'Brazil'],
    1998: ['Belgium', 'South Korea', 'Mexico', 'FR Yugoslavia', 'Argentina', 'Brazil'],
    2006: ['Serbia and Montenegro', 'Ivory Coast', 'Argentina', 'Portugal', 'England'],
    2010: ['Denmark', 'Japan', 'Cameroon', 'Slovakia', 'Brazil', 'Uruguay', 'Spain'],
    2014: ['Spain', 'Australia', 'Chile', 'Mexico', 'Costa Rica', 'Argentina', 'Brazil'],
    2022: ['Senegal', 'Ecuador', 'Qatar', 'United States', 'Argentina'],
  },
  Portugal: {
    1966: ['Hungary', 'Bulgaria', 'Brazil', 'North Korea', 'England', 'Soviet Union'],
    1986: ['England', 'Poland', 'Morocco', 'Germany'],
    2002: ['United States', 'Poland', 'South Korea'],
    2006: ['Angola', 'Iran', 'Mexico', 'Netherlands', 'England', 'France'],
    2010: ['Ivory Coast', 'North Korea', 'Brazil', 'Spain'],
    2014: ['Germany', 'United States', 'Ghana'],
    2018: ['Spain', 'Morocco', 'Iran', 'Uruguay'],
    2022: ['Ghana', 'Uruguay', 'South Korea', 'Switzerland', 'Morocco'],
  },
  England: {
    1950: ['Chile', 'United States', 'Spain'],
    1954: ['Belgium', 'Switzerland', 'Uruguay'],
    1958: ['Soviet Union', 'Brazil', 'Austria', 'Soviet Union'],
    1962: ['Argentina', 'Bulgaria', 'Hungary', 'Brazil'],
    1970: ['Romania', 'Brazil', 'Czechoslovakia', 'West Germany'],
    1982: ['France', 'Czechoslovakia', 'Kuwait', 'West Germany', 'Spain'],
    1986: ['Portugal', 'Morocco', 'Poland', 'Paraguay', 'Argentina'],
    1990: ['Republic of Ireland', 'Netherlands', 'Egypt', 'Belgium', 'Cameroon', 'West Germany', 'Italy'],
    1998: ['Tunisia', 'Romania', 'Colombia', 'Argentina'],
    2002: ['Sweden', 'Argentina', 'Nigeria', 'Denmark', 'Brazil'],
    2006: ['Paraguay', 'Trinidad and Tobago', 'Sweden', 'Ecuador', 'Portugal'],
    2010: ['United States', 'Algeria', 'Slovenia', 'Germany'],
    2014: ['Italy', 'Uruguay', 'Costa Rica'],
    2018: ['Tunisia', 'Panama', 'Belgium', 'Colombia', 'Sweden', 'Croatia', 'Belgium'],
    2022: ['Iran', 'United States', 'Wales', 'Senegal', 'France'],
  },
  Denmark: {
    2018: ['Peru', 'Australia', 'France', 'Croatia'],
    1986: ['Scotland', 'Uruguay', 'West Germany', 'Spain'],
    1998: ['Saudi Arabia', 'Nigeria', 'France', 'Brazil'],
    2002: ['Senegal', 'Uruguay', 'France', 'England'],
    2010: ['Netherlands', 'Cameroon', 'Japan'],
    2022: ['Tunisia', 'France', 'Australia'],
  },
  France: {
    1930: ['Mexico', 'Argentina', 'Chile'],
    1934: ['Austria'],
    1938: ['Belgium', 'Italy'],
    1954: ['Yugoslavia', 'Mexico'],
    1958: ['Paraguay', 'Yugoslavia', 'Scotland', 'Northern Ireland', 'Brazil', 'West Germany'],
    1966: ['Mexico', 'Uruguay', 'England'],
    1978: ['Italy', 'Argentina', 'Hungary'],
    1982: ['England', 'Kuwait', 'Czechoslovakia', 'Austria', 'Northern Ireland', 'West Germany', 'Poland'],
    1986: ['Canada', 'Soviet Union', 'Hungary', 'Italy', 'Brazil', 'West Germany', 'Belgium'],
    2002: ['Senegal', 'Uruguay', 'Denmark'],
    2006: ['Switzerland', 'South Korea', 'Togo', 'Spain'],
    2010: ['Uruguay', 'Mexico', 'South Africa'],
    2014: ['Honduras', 'Switzerland', 'Ecuador', 'Nigeria', 'Germany'],
    2022: ['Australia', 'Denmark', 'Tunisia', 'Poland', 'England', 'Morocco', 'Argentina'],
  },
  Italy: {
    1950: ['Sweden', 'Paraguay'],
    1954: ['Switzerland', 'Belgium', 'England', 'Switzerland'],
    1962: ['West Germany', 'Switzerland', 'Chile'],
    1966: ['Chile', 'Soviet Union', 'North Korea'],
    1970: ['Uruguay', 'Sweden', 'Israel', 'Mexico', 'Brazil'],
    1974: ['Argentina', 'Poland', 'Haiti'],
    1978: ['France', 'Hungary', 'Argentina', 'Austria', 'Netherlands', 'West Germany'],
    1986: ['Bulgaria', 'Argentina', 'South Korea', 'France'],
    1990: ['Austria', 'United States', 'Czechoslovakia', 'Uruguay', 'Republic of Ireland', 'Argentina', 'England', 'West Germany'],
    1994: ['Republic of Ireland', 'Norway', 'Mexico', 'Nigeria', 'Spain'],
    1998: ['Chile', 'Cameroon', 'Austria', 'Norway', 'France'],
    2002: ['Ecuador', 'Croatia', 'Mexico', 'South Korea'],
    2010: ['Paraguay', 'New Zealand', 'Slovakia'],
    2014: ['England', 'Costa Rica', 'Uruguay'],
  },
  Spain: {
    1998: ['Nigeria', 'Paraguay', 'Bulgaria'],
    1934: ['Brazil', 'Italy', 'Italy'],
    1950: ['United States', 'Chile', 'England', 'Uruguay', 'Brazil', 'Sweden'],
    1962: ['Czechoslovakia', 'Mexico', 'Brazil'],
    1966: ['Argentina', 'Switzerland', 'West Germany'],
    1978: ['Austria', 'Brazil', 'Sweden'],
    1982: ['Honduras', 'Yugoslavia', 'Northern Ireland', 'West Germany', 'England'],
    1986: ['Brazil', 'Northern Ireland', 'Algeria', 'Denmark', 'Belgium'],
    1990: ['Uruguay', 'South Korea', 'Belgium', 'Yugoslavia'],
    1994: ['South Korea', 'Germany', 'Bolivia', 'Switzerland', 'Italy'],
    2002: ['Slovenia', 'Paraguay', 'South Africa', 'Republic of Ireland', 'South Korea'],
    2006: ['Ukraine', 'Tunisia', 'Saudi Arabia', 'France'],
    2014: ['Netherlands', 'Chile', 'Australia'],
    2018: ['Portugal', 'Iran', 'Morocco', 'Russia'],
    2022: ['Costa Rica', 'Germany', 'Japan', 'Morocco'],
  },
  Switzerland: {
    1934: ['Netherlands', 'Germany', 'Germany', 'Czechoslovakia', 'Germany'],
    1938: ['Germany', 'Germany'],
    1950: ['Yugoslavia', 'Brazil', 'Mexico'],
    1954: ['Italy', 'England', 'Belgium', 'Austria'],
    1962: ['Chile', 'West Germany', 'Italy'],
    1966: ['West Germany', 'Spain', 'Argentina'],
    1994: ['United States', 'Colombia', 'Romania'],
    2006: ['France', 'Togo', 'South Korea', 'Ukraine'],
    2010: ['Spain', 'Chile', 'Honduras', 'Portugal'],
    2014: ['Ecuador', 'France', 'Honduras', 'Argentina'],
    2018: ['Brazil', 'Costa Rica', 'Serbia', 'Sweden'],
    2022: ['Cameroon', 'Brazil', 'Serbia', 'Portugal'],
  },
  // North America (5)
  'United States': {
    1930: ['Belgium', 'Paraguay', 'Argentina'],
    1934: ['Italy'],
    1950: ['Spain', 'England', 'Chile'],
    1990: ['Czechoslovakia', 'Italy', 'Austria'],
    1994: ['Switzerland', 'Colombia', 'Romania', 'Brazil'],
    1998: ['Germany', 'Iran', 'FR Yugoslavia'],
    2002: ['Portugal', 'South Korea', 'Poland', 'Mexico', 'Germany'],
    2006: ['Czech Republic', 'Italy', 'Ghana'],
    2010: ['England', 'Slovenia', 'Algeria', 'Ghana'],
    2014: ['Ghana', 'Portugal', 'Germany', 'Belgium'],
    2022: ['Wales', 'England', 'Iran', 'Netherlands'],
  },
  Mexico: {
    2002: ['Croatia', 'Ecuador', 'Italy', 'United States'],
    1930: ['France', 'Chile', 'Argentina'],
    1950: ['Brazil', 'Yugoslavia', 'Switzerland'],
    1954: ['Brazil', 'France'],
    1958: ['Sweden', 'Wales', 'Hungary'],
    1962: ['Brazil', 'Spain', 'Czechoslovakia'],
    1966: ['France', 'England', 'Uruguay'],
    1970: ['Soviet Union', 'El Salvador', 'Belgium', 'Italy'],
    1978: ['Tunisia', 'West Germany', 'Poland'],
    1986: ['Belgium', 'Paraguay', 'Iraq', 'Bulgaria', 'West Germany'],
    1994: ['Norway', 'Republic of Ireland', 'Italy', 'Bulgaria'],
    1998: ['South Korea', 'Belgium', 'Netherlands', 'Germany'],
    2006: ['Iran', 'Angola', 'Portugal', 'Argentina'],
    2010: ['South Africa', 'France', 'Uruguay', 'Argentina'],
    2014: ['Cameroon', 'Brazil', 'Croatia', 'Netherlands'],
    2018: ['Germany', 'South Korea', 'Sweden', 'Brazil'],
    2022: ['Poland', 'Argentina', 'Saudi Arabia'],
  },
  'Costa Rica': {
    1990: ['Scotland', 'Brazil', 'Sweden', 'Czechoslovakia'],
    2002: ['China', 'Turkey', 'Brazil'],
    2006: ['Germany', 'Ecuador', 'Poland'],
    2014: ['Uruguay', 'Italy', 'England', 'Greece', 'Netherlands'],
    2018: ['Serbia', 'Brazil', 'Switzerland'],
    2022: ['Spain', 'Japan', 'Germany'],
  },
  Canada: {
    1986: ['France', 'Hungary', 'Soviet Union'],
    2022: ['Belgium', 'Croatia', 'Morocco'],
  },
  Panama: {
    2018: ['Belgium', 'England', 'Tunisia'],
  },
  // South America (5)
  Colombia: {
    1962: ['Uruguay', 'Soviet Union', 'Yugoslavia'],
    1990: ['UAE', 'Yugoslavia', 'West Germany', 'Cameroon'],
    1994: ['Romania', 'United States', 'Switzerland'],
    1998: ['Romania', 'Tunisia', 'England'],
    2014: ['Greece', 'Ivory Coast', 'Japan', 'Uruguay', 'Brazil'],
    2018: ['Japan', 'Poland', 'Senegal', 'England'],
  },
  Chile: {
    1930: ['Mexico', 'France', 'Argentina'],
    1950: ['England', 'Spain', 'United States'],
    1962: ['Switzerland', 'Italy', 'West Germany', 'Soviet Union', 'Brazil', 'Yugoslavia'],
    1966: ['Italy', 'North Korea', 'Soviet Union'],
    1974: ['West Germany', 'East Germany', 'Australia'],
    1982: ['Austria', 'West Germany', 'Algeria'],
    1998: ['Italy', 'Austria', 'Cameroon', 'Brazil'],
    2010: ['Honduras', 'Switzerland', 'Spain', 'Brazil'],
    2014: ['Australia', 'Spain', 'Netherlands', 'Brazil'],
  },
  Peru: {
    1930: ['Romania', 'Uruguay'],
    1970: ['Bulgaria', 'Morocco', 'West Germany', 'Brazil'],
    1978: ['Scotland', 'Iran', 'Netherlands', 'Brazil', 'Poland', 'Argentina'],
    1982: ['Poland', 'Italy', 'Cameroon'],
    2018: ['Denmark', 'France', 'Australia'],
  },
  Ecuador: {
    2002: ['Italy', 'Mexico', 'Croatia'],
    2006: ['Poland', 'Costa Rica', 'Germany'],
    2014: ['Switzerland', 'Honduras', 'France'],
    2022: ['Qatar', 'Netherlands', 'Senegal'],
  },
  Paraguay: {
    1930: ['United States', 'Belgium'],
    1950: ['Sweden', 'Italy'],
    1958: ['France', 'Scotland', 'Yugoslavia'],
    1986: ['Iraq', 'Mexico', 'Belgium', 'England'],
    1998: ['Bulgaria', 'Spain', 'Nigeria', 'France'],
    2002: ['South Africa', 'Spain', 'Slovenia', 'Germany'],
    2006: ['England', 'Sweden', 'Trinidad and Tobago', 'Germany'],
    2010: ['Italy', 'Slovakia', 'New Zealand', 'Japan', 'Spain'],
  },
  // Oceania (2 - only Australia and New Zealand have qualified)
  'New Zealand': {
    1982: ['Scotland', 'Soviet Union', 'Brazil'],
    2010: ['Slovakia', 'Italy', 'Paraguay'],
  },
  // Additional countries (from Country History - all World Cup participants)
  Algeria: {
    1982: ['West Germany', 'Austria', 'Chile'],
    1986: ['Northern Ireland', 'Brazil', 'Spain'],
    2010: ['Slovenia', 'England', 'United States'],
    // Group H then R16 vs Germany (eliminated)
    2014: ['Belgium', 'South Korea', 'Russia', 'Germany'],
  },
  Belgium: {
    1930: ['United States', 'Paraguay'],
    1934: ['Germany'],
    1938: ['France'],
    1954: ['England', 'Italy'],
    1970: ['El Salvador', 'Soviet Union', 'Mexico'],
    1982: ['Argentina', 'Hungary', 'El Salvador', 'Poland', 'Soviet Union'],
    1986: ['Mexico', 'Iraq', 'Paraguay', 'Soviet Union', 'Spain', 'Argentina', 'France'],
    1990: ['South Korea', 'Uruguay', 'Spain', 'England'],
    1994: ['Morocco', 'Netherlands', 'Saudi Arabia', 'Germany'],
    1998: ['Netherlands', 'Mexico', 'South Korea', 'Brazil'],
    2002: ['Japan', 'Tunisia', 'Russia', 'Brazil'],
    // Group H then R16 vs USA, QF vs Argentina (eliminated)
    2014: ['Algeria', 'Russia', 'South Korea', 'United States', 'Argentina'],
    2018: ['Panama', 'Tunisia', 'England', 'Japan', 'Brazil', 'France', 'England'],
    2022: ['Canada', 'Morocco', 'Croatia', 'Japan'],
  },
  Bulgaria: {
    1962: ['Argentina', 'Hungary', 'England'],
    1966: ['Portugal', 'Hungary', 'Brazil'],
    1970: ['Peru', 'Morocco', 'West Germany'],
    1974: ['Sweden', 'Uruguay', 'Netherlands'],
    1986: ['Italy', 'South Korea', 'Argentina'],
    1994: ['Nigeria', 'Greece', 'Argentina', 'Mexico', 'Germany', 'Italy', 'Sweden'],
    1998: ['Nigeria', 'Spain', 'Paraguay'],
  },
  Sweden: {
    1934: ['Argentina', 'Germany', 'Argentina', 'Germany'],
    1938: ['Hungary'],
    1950: ['Italy', 'Paraguay', 'Brazil'],
    1958: ['Mexico', 'Hungary', 'Wales', 'Soviet Union', 'West Germany', 'Brazil'],
    1970: ['Italy', 'Israel', 'Uruguay'],
    1974: ['Bulgaria', 'East Germany', 'Argentina', 'Poland', 'West Germany', 'Yugoslavia'],
    1978: ['Brazil', 'Austria', 'Spain', 'Netherlands', 'Poland', 'West Germany'],
    1990: ['Brazil', 'Scotland', 'Costa Rica', 'West Germany'],
    1994: ['Cameroon', 'Russia', 'Brazil', 'Saudi Arabia', 'Romania', 'Brazil', 'Bulgaria'],
    2002: ['England', 'Nigeria', 'Argentina', 'Senegal'],
    2006: ['Trinidad and Tobago', 'Paraguay', 'England', 'Germany'],
    2018: ['South Korea', 'Germany', 'Mexico', 'Switzerland', 'England'],
  },
  Iceland: {
    2018: ['Argentina', 'Nigeria', 'Croatia'],
  },
  Nigeria: {
    1994: ['Bulgaria', 'Argentina', 'Greece', 'Italy'],
    1998: ['Spain', 'Bulgaria', 'Paraguay', 'Denmark'],
    2002: ['Argentina', 'Sweden', 'England'],
    2010: ['Argentina', 'Greece', 'South Korea', 'Ghana'],
    2014: ['Iran', 'Bosnia and Herzegovina', 'Argentina', 'France'],
    2018: ['Croatia', 'Iceland', 'Argentina'],
  },
  Poland: {
    1938: ['Brazil'],
    1974: ['Argentina', 'Italy', 'Haiti', 'Sweden', 'Yugoslavia', 'West Germany'],
    1978: ['Tunisia', 'West Germany', 'Mexico', 'Argentina', 'Peru', 'Brazil'],
    1986: ['Portugal', 'England', 'Italy'],
    1982: ['Italy', 'Peru', 'Cameroon', 'Soviet Union', 'Belgium', 'Italy', 'France'],
    2002: ['South Korea', 'Portugal', 'United States', 'Mexico', 'Germany'],
    2006: ['Ecuador', 'Germany', 'Costa Rica', 'Sweden'],
    2018: ['Senegal', 'Colombia', 'Japan'],
    2022: ['Mexico', 'Saudi Arabia', 'Argentina', 'France'],
  },
  Romania: {
    1930: ['Peru', 'Uruguay'],
    1934: ['Switzerland'],
    1938: ['Cuba', 'Cuba', 'Italy'],
    1970: ['Czechoslovakia', 'England', 'Brazil'],
    1990: ['Soviet Union', 'Cameroon', 'Argentina', 'Republic of Ireland'],
    1994: ['Colombia', 'Switzerland', 'United States', 'Argentina', 'Sweden'],
    1998: ['Colombia', 'England', 'Tunisia', 'Croatia'],
  },
  Russia: {
    1994: ['Brazil', 'Cameroon', 'Sweden', 'Greece'],
    2002: ['Tunisia', 'Japan', 'Belgium'],
    2014: ['South Korea', 'Belgium', 'Algeria', 'Germany'],
    2018: ['Saudi Arabia', 'Egypt', 'Uruguay', 'Spain', 'Croatia'],
  },
  Turkey: {
    1954: ['South Korea', 'Hungary', 'West Germany'],
    2002: ['Brazil', 'Costa Rica', 'China', 'Japan', 'Senegal', 'Brazil', 'South Korea'],
  },
  Ukraine: {
    2006: ['Spain', 'Saudi Arabia', 'Tunisia', 'Switzerland', 'Italy'],
  },
  Wales: {
    1958: ['Hungary', 'Mexico', 'Sweden', 'Hungary', 'Brazil'],
    2022: ['United States', 'Iran', 'England'],
  },
  'North Korea': {
    1966: ['Soviet Union', 'Chile', 'Italy', 'Portugal'],
    2010: ['Brazil', 'Portugal', 'Ivory Coast'],
  },
  'Northern Ireland': {
    1958: ['Czechoslovakia', 'Argentina', 'West Germany', 'France'],
    1982: ['Honduras', 'Yugoslavia', 'Spain', 'France', 'Austria', 'Czechoslovakia'],
    1986: ['Algeria', 'Spain', 'Brazil'],
  },
  Greece: {
    1994: ['Argentina', 'Bulgaria', 'Nigeria', 'Mexico'],
    2010: ['South Korea', 'Nigeria', 'Argentina', 'Uruguay'],
    2014: ['Colombia', 'Ivory Coast', 'Japan', 'Costa Rica'],
  },
  Egypt: {
    1934: ['Hungary'],
    1990: ['Netherlands', 'Republic of Ireland', 'England'],
    2018: ['Uruguay', 'Russia', 'Saudi Arabia'],
  },
  Scotland: {
    1954: ['Austria', 'Uruguay', 'Hungary'],
    1958: ['France', 'Paraguay', 'Yugoslavia'],
    1974: ['Zaire', 'Yugoslavia', 'Brazil'],
    1978: ['Peru', 'Iran', 'Netherlands'],
    1982: ['New Zealand', 'Brazil', 'Soviet Union'],
    1986: ['Denmark', 'West Germany', 'Uruguay'],
    1990: ['Costa Rica', 'Brazil', 'Sweden'],
    1998: ['Brazil', 'Norway', 'Morocco'],
  },
  'Bosnia and Herzegovina': {
    2014: ['Argentina', 'Nigeria', 'Iran'],
  },
  Qatar: {
    2022: ['Ecuador', 'Senegal', 'Netherlands'],
  },
  Serbia: {
    2010: ['Ghana', 'Germany', 'Australia'],
    2018: ['Costa Rica', 'Switzerland', 'Brazil', 'Sweden'],
    2022: ['Brazil', 'Cameroon', 'Switzerland'],
  },
  Slovenia: {
    2002: ['Spain', 'South Africa', 'Paraguay'],
    2010: ['Algeria', 'United States', 'England'],
  },
  Slovakia: {
    2010: ['New Zealand', 'Paraguay', 'Italy', 'Netherlands'],
  },
  'South Africa': {
    1998: ['France', 'Denmark', 'Saudi Arabia'],
    2002: ['Paraguay', 'Spain', 'Slovenia'],
    2010: ['Mexico', 'Uruguay', 'France'],
  },
  Honduras: {
    1982: ['Spain', 'Northern Ireland', 'Yugoslavia'],
    2010: ['Chile', 'Spain', 'Switzerland'],
    2014: ['France', 'Ecuador', 'Switzerland'],
  },
  Hungary: {
    1934: ['Egypt', 'Austria'],
    1938: ['Indonesia', 'Switzerland'],
    1958: ['Wales', 'Sweden', 'Mexico', 'Wales'],
    1962: ['England', 'Argentina', 'Bulgaria'],
    1966: ['Portugal', 'Brazil', 'Bulgaria'],
    2022: ['France', 'Germany', 'Portugal'],
    1954: ['South Korea', 'West Germany', 'Brazil', 'Uruguay', 'West Germany'],
    1978: ['Argentina', 'Italy', 'France'],
    1982: ['El Salvador', 'Belgium', 'Argentina'],
    1986: ['Canada', 'Soviet Union', 'France'],
  },
  'Ivory Coast': {
    2006: ['Argentina', 'Netherlands', 'Serbia and Montenegro'],
    2010: ['Portugal', 'Brazil', 'North Korea'],
    2014: ['Japan', 'Colombia', 'Greece'],
  },
  China: {
    2002: ['Costa Rica', 'Brazil', 'Turkey'],
  },
  Angola: {
    2006: ['Portugal', 'Mexico', 'Iran'],
  },
  Togo: {
    2006: ['South Korea', 'Switzerland', 'France'],
  },
  'Trinidad and Tobago': {
    2006: ['Sweden', 'England', 'Paraguay'],
  },
  Jamaica: {
    1998: ['Croatia', 'Argentina', 'Japan'],
  },
  // Additional countries (~20 more from Country History)
  Austria: {
    1934: ['France'],
    1954: ['Scotland', 'Czechoslovakia', 'West Germany', 'Switzerland'],
    1958: ['Brazil', 'Soviet Union', 'England', 'Northern Ireland'],
    1978: ['Spain', 'Sweden', 'France', 'Netherlands', 'Italy'],
    1982: ['Chile', 'Algeria', 'West Germany', 'France', 'Northern Ireland'],
    1990: ['Italy', 'Czechoslovakia', 'United States'],
    1998: ['Cameroon', 'Chile', 'Italy'],
  },
  Norway: {
    1938: ['Italy'],
    1994: ['Mexico', 'Italy', 'Republic of Ireland'],
    1998: ['Morocco', 'Scotland', 'Brazil', 'Italy'],
  },
  'Soviet Union': {
    1958: ['England', 'Austria', 'Brazil', 'England', 'Sweden'],
    1962: ['Yugoslavia', 'Uruguay', 'Colombia', 'Chile', 'Yugoslavia'],
    1966: ['North Korea', 'Italy', 'Chile', 'Hungary', 'West Germany'],
    1970: ['Mexico', 'Belgium', 'El Salvador', 'Uruguay'],
    1982: ['Brazil', 'New Zealand', 'Scotland', 'Belgium', 'Poland'],
    1986: ['Hungary', 'France', 'Canada', 'Belgium'],
    1990: ['Romania', 'Argentina', 'Cameroon', 'Argentina'],
  },
  Czechoslovakia: {
    1934: ['Romania', 'Switzerland', 'Germany', 'Italy'],
    1938: ['Netherlands'],
    1954: ['Scotland', 'Austria', 'Uruguay', 'West Germany'],
    1958: ['Northern Ireland', 'West Germany', 'Argentina', 'Northern Ireland'],
    1962: ['Spain', 'Brazil', 'Mexico', 'Hungary', 'Yugoslavia'],
    1970: ['Brazil', 'Romania', 'England', 'Brazil'],
    1982: ['Kuwait', 'England', 'France', 'Austria', 'Italy'],
    1990: ['United States', 'Austria', 'Italy', 'Costa Rica', 'West Germany'],
  },
  Yugoslavia: {
    1930: ['Brazil', 'Bolivia', 'United States', 'Uruguay'],
    1950: ['Switzerland', 'Brazil', 'Mexico'],
    1954: ['Brazil', 'France', 'Mexico'],
    1958: ['France', 'Paraguay', 'Scotland'],
    1962: ['Soviet Union', 'Colombia', 'Uruguay', 'West Germany', 'Czechoslovakia'],
    1974: ['Brazil', 'Zaire', 'Scotland', 'West Germany', 'Poland', 'Netherlands'],
    1982: ['Northern Ireland', 'Spain', 'Honduras', 'England', 'Soviet Union'],
    1990: ['West Germany', 'Colombia', 'UAE', 'Spain', 'Argentina'],
  },
  Bolivia: {
    1930: ['Yugoslavia', 'Brazil'],
    1950: ['Uruguay', 'Spain', 'Brazil'],
    1994: ['Germany', 'South Korea', 'Spain'],
  },
  'East Germany': {
    1974: ['Australia', 'Chile', 'West Germany', 'Netherlands'],
  },
  Iraq: {
    1986: ['Paraguay', 'Belgium', 'Mexico'],
  },
  Israel: {
    1970: ['Uruguay', 'Sweden', 'Italy'],
  },
  Kuwait: {
    1982: ['Czechoslovakia', 'France', 'England'],
  },
  'El Salvador': {
    1970: ['Belgium', 'Mexico', 'Soviet Union'],
    1982: ['Hungary', 'Belgium', 'Argentina'],
  },
  Haiti: {
    1974: ['Italy', 'Poland', 'Argentina'],
  },
  'United Arab Emirates': {
    1990: ['Colombia', 'West Germany', 'Yugoslavia'],
  },
  'Serbia and Montenegro': {
    2006: ['Netherlands', 'Ivory Coast', 'Argentina', 'Germany'],
  },
  'FR Yugoslavia': {
    // Group F: Iran, Germany, USA — R16 vs Netherlands only (no rematch vs Netherlands)
    1998: ['Iran', 'Germany', 'United States', 'Netherlands'],
  },
  Zaire: {
    1974: ['Scotland', 'Yugoslavia', 'Brazil'],
  },
  Cuba: {
    1938: ['Romania', 'Sweden'],
  },
  Indonesia: {
    1938: ['Hungary'],
  },
  Ireland: {
    1990: ['England', 'Egypt', 'Netherlands', 'Romania', 'Italy'],
    1994: ['Italy', 'Mexico', 'Norway', 'Netherlands'],
    2002: ['Cameroon', 'Germany', 'Saudi Arabia', 'Spain'],
  },
  'Czech Republic': {
    2006: ['United States', 'Ghana', 'Italy'],
  },
};

// Merge all routes for lookup (merge years when country appears in both)
const ALL_ROUTES: Record<string, Record<number, string[]>> = (() => {
  const allCountries = new Set([...Object.keys(WINNER_ROUTES), ...Object.keys(CAMPAIGN_ROUTES)]);
  const merged: Record<string, Record<number, string[]>> = {};
  for (const country of allCountries) {
    merged[country] = {
      ...(WINNER_ROUTES[country] || {}),
      ...(CAMPAIGN_ROUTES[country] || {}),
    };
  }
  return merged;
})();

export const DESTINY_ROUTE_COUNTRIES: { country: string; years: number[]; isWinner?: boolean; winningYears: number[] }[] = (() => {
  const byCountry = new Map<string, { years: number[]; isWinner: boolean; winningYears: number[] }>();
  for (const [country, yearsMap] of Object.entries(WINNER_ROUTES)) {
    const winningYears = Object.keys(yearsMap).map(Number).sort((a, b) => a - b);
    byCountry.set(country, { years: winningYears, isWinner: true, winningYears });
  }
  for (const [country, yearsMap] of Object.entries(CAMPAIGN_ROUTES)) {
    const campaignYears = Object.keys(yearsMap).map(Number);
    const existing = byCountry.get(country);
    if (existing) {
      const allYears = [...new Set([...existing.years, ...campaignYears])].sort((a, b) => a - b);
      byCountry.set(country, { years: allYears, isWinner: existing.isWinner, winningYears: existing.winningYears });
    } else {
      byCountry.set(country, { years: campaignYears.sort((a, b) => a - b), isWinner: false, winningYears: [] });
    }
  }
  return [...byCountry.entries()]
    .map(([country, { years, isWinner, winningYears }]) => ({ country, years, isWinner, winningYears }))
    .sort((a, b) => a.country.localeCompare(b.country));
})();

// Legacy export for backward compatibility
export const WORLD_CUP_WINNERS: { country: string; years: number[] }[] = Object.entries(WINNER_ROUTES).map(
  ([country, yearsMap]) => ({
    country,
    years: Object.keys(yearsMap)
      .map(Number)
      .sort((a, b) => a - b),
  })
);

export const destinyRouteLevels: DestinyRouteLevel[] = (() => {
  const levels: DestinyRouteLevel[] = [];
  for (const [country, yearsMap] of Object.entries(ALL_ROUTES)) {
    for (const [yearStr, path] of Object.entries(yearsMap)) {
      const year = parseInt(yearStr, 10);
      const isWinner = !!WINNER_ROUTES[country]?.[year];
      levels.push({
        id: `dr-${country}-${year}`,
        title: `${country} ${year}`,
        description: isWinner
          ? `Put ${country}'s opponents in order — from first match to lifting the trophy in ${year}.`
          : `Put ${country}'s opponents in order — from first match to last in their ${year} campaign.`,
        correctOrder: path,
        year,
        team: country,
        isWinner,
      });
    }
  }
  return levels;
})();

/** Stable curriculum order — same level numbers everywhere (team A→Z, then year). */
export const DESTINY_ROUTE_LEVELS_ORDERED: DestinyRouteLevel[] = [...destinyRouteLevels].sort((a, b) => {
  const tc = a.team.localeCompare(b.team);
  if (tc !== 0) return tc;
  return a.year - b.year;
});

export const DESTINY_ROUTE_LEVEL_COUNT = DESTINY_ROUTE_LEVELS_ORDERED.length;

export function getDestinyRouteByLevel(level: number): DestinyRouteLevel | null {
  if (!Number.isFinite(level) || level < 1 || level > DESTINY_ROUTE_LEVELS_ORDERED.length) return null;
  return DESTINY_ROUTE_LEVELS_ORDERED[level - 1];
}

/** Curriculum level index (1-based) for a country/year pair, or null if missing from data. */
export function getDestinyRouteLevelIndexForCountryYear(country: string, year: number): number | null {
  const resolved = resolveDestinyTeamName(country);
  const idx = DESTINY_ROUTE_LEVELS_ORDERED.findIndex((l) => l.team === resolved && l.year === year);
  return idx >= 0 ? idx + 1 : null;
}

// Country to flag emoji (all opponents used in routes)
export const countryToFlag: Record<string, string> = {
  Algeria: '🇩🇿', Angola: '🇦🇴', Argentina: '🇦🇷', Australia: '🇦🇺', Austria: '🇦🇹', Belgium: '🇧🇪',
  Bolivia: '🇧🇴', 'Bosnia and Herzegovina': '🇧🇦', Brazil: '🇧🇷', Bulgaria: '🇧🇬', Cameroon: '🇨🇲',
  Canada: '🇨🇦', Chile: '🇨🇱', China: '🇨🇳', Colombia: '🇨🇴', 'Costa Rica': '🇨🇷', Croatia: '🇭🇷',
  Czechoslovakia: '🇨🇿', 'Czech Republic': '🇨🇿', Denmark: '🇩🇰', 'East Germany': '🇩🇪', Ecuador: '🇪🇨',
  Egypt: '🇪🇬', England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', France: '🇫🇷', Germany: '🇩🇪', Ghana: '🇬🇭', Greece: '🇬🇷',
  Honduras: '🇭🇳', Hungary: '🇭🇺', Iceland: '🇮🇸', Ireland: '🇮🇪', Iran: '🇮🇷', Iraq: '🇮🇶', Italy: '🇮🇹',
  'Ivory Coast': '🇨🇮', Jamaica: '🇯🇲', Japan: '🇯🇵', Mexico: '🇲🇽', Morocco: '🇲🇦', Netherlands: '🇳🇱',
  'New Zealand': '🇳🇿', Nigeria: '🇳🇬', 'North Korea': '🇰🇵', Norway: '🇳🇴', Panama: '🇵🇦',
  Paraguay: '🇵🇾', Peru: '🇵🇪', Poland: '🇵🇱', Portugal: '🇵🇹', Qatar: '🇶🇦',
  'Republic of Ireland': '🇮🇪', Romania: '🇷🇴', Russia: '🇷🇺', 'Saudi Arabia': '🇸🇦',
  Scotland: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', Senegal: '🇸🇳', Serbia: '🇷🇸', Slovakia: '🇸🇰', Slovenia: '🇸🇮',
  'South Africa': '🇿🇦', 'South Korea': '🇰🇷', 'Soviet Union': '🇷🇺', Spain: '🇪🇸', Sweden: '🇸🇪',
  Switzerland: '🇨🇭', Togo: '🇹🇬', 'Trinidad and Tobago': '🇹🇹', Tunisia: '🇹🇳',
  Turkey: '🇹🇷', UAE: '🇦🇪', 'United Arab Emirates': '🇦🇪', Ukraine: '🇺🇦', Uruguay: '🇺🇾',
  'United States': '🇺🇸', Wales: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',   'Northern Ireland': '🏴󠁧󠁢󠁮󠁩󠁲󠁿', Yugoslavia: '🇷🇸',
  'West Germany': '🇩🇪', 'Serbia and Montenegro': '🇷🇸', 'FR Yugoslavia': '🇷🇸', Zaire: '🇨🇩', Cuba: '🇨🇺',
  Indonesia: '🇮🇩', 'El Salvador': '🇸🇻', Haiti: '🇭🇹', Kuwait: '🇰🇼', Israel: '🇮🇱',
};

const WRONG_OPTION_POOL = ['Mexico', 'Japan', 'Chile', 'Nigeria', 'Poland', 'Senegal', 'Switzerland', 'Morocco'];

export const getDestinyRouteByCountryYear = (country: string, year: number): DestinyRouteLevel | null => {
  const resolved = resolveDestinyTeamName(country);
  const path = ALL_ROUTES[resolved]?.[year];
  if (!path) return null;
  const isWinner = !!WINNER_ROUTES[resolved]?.[year];
  return {
    id: `dr-${resolved}-${year}`,
    title: `${resolved} ${year}`,
    description: isWinner
      ? `Put ${country}'s opponents in order — from first match to lifting the trophy in ${year}.`
      : `Put ${country}'s opponents in order — from first match to last in their ${year} campaign.`,
    correctOrder: path,
    year,
    team: resolved,
    isWinner,
  };
};

// Seeded shuffle - stable order for a given (correctCountry, missingIndex)
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = (seed + i * 7) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getMissingCountryOptions(correctCountry: string, path: string[], count: number = 4, missingIndex?: number): string[] {
  const visible = new Set(path);
  const wrongPool = WRONG_OPTION_POOL.filter((c) => c !== correctCountry && !visible.has(c));
  const seed = (correctCountry.length * 7 + (missingIndex ?? 0) * 31) % 1000;
  const shuffled = seededShuffle(wrongPool, seed);
  const wrong = shuffled.slice(0, count - 1);
  const options = seededShuffle([correctCountry, ...wrong], seed + 1);
  return options;
}
