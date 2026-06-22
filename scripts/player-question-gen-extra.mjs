/**
 * Generates questions 11–50 for player quiz blocks (World Cup–only, avoid unverifiable stats).
 */

export const HOST = {
  1950: 'Brazil',
  1954: 'Switzerland',
  1958: 'Sweden',
  1962: 'Chile',
  1966: 'England',
  1970: 'Mexico',
  1974: 'West Germany',
  1978: 'Argentina',
  1982: 'Spain',
  1986: 'Mexico',
  1990: 'Italy',
  1994: 'United States',
  1998: 'France',
  2002: 'Japan and South Korea',
  2006: 'Germany',
  2010: 'South Africa',
  2014: 'Brazil',
  2018: 'Russia',
  2022: 'Qatar',
};

const CONTINENT = {
  Uruguay: 'South America',
  Colombia: 'South America',
  Mexico: 'North America',
  Nigeria: 'Africa',
  Egypt: 'Africa',
  Japan: 'Asia',
  Switzerland: 'Europe',
  'Czech Republic': 'Europe',
  Denmark: 'Europe',
  Sweden: 'Europe',
  Hungary: 'Europe',
  Croatia: 'Europe',
  Portugal: 'Europe',
  France: 'Europe',
  Spain: 'Europe',
  Germany: 'Europe',
  England: 'Europe',
  Italy: 'Europe',
  Netherlands: 'Europe',
  Belgium: 'Europe',
  Poland: 'Europe',
  Serbia: 'Europe',
  Russia: 'Europe',
  Ukraine: 'Europe',
  Austria: 'Europe',
  Cameroon: 'Africa',
  Ghana: 'Africa',
  Senegal: 'Africa',
  Morocco: 'Africa',
  'South Africa': 'Africa',
  Brazil: 'South America',
  Argentina: 'South America',
  Chile: 'South America',
  Australia: 'Oceania',
  'South Korea': 'Asia',
  Iran: 'Asia',
  'Saudi Arabia': 'Asia',
};

export function esc(s) {
  return String(s);
}

function wrongHosts(correct) {
  const all = [...new Set(Object.values(HOST))].filter((h) => h !== correct);
  return all.slice(0, 3);
}

function shuffleWrong(correct, pool) {
  const w = pool.filter((x) => x !== correct).slice(0, 3);
  while (w.length < 3) w.push('Spain');
  return w;
}

function yearsLabel(years) {
  return [...new Set(years)].sort((a, b) => a - b).join(', ');
}

function makeQ(difficulty, question, optionA, optionB, optionC, optionD, correctAnswer, hint1, hint2, hint3) {
  return {
    category: 'player',
    difficulty,
    question: esc(question),
    optionA: esc(optionA),
    optionB: esc(optionB),
    optionC: esc(optionC),
    optionD: esc(optionD),
    correctAnswer,
    hint1: esc(hint1),
    hint2: esc(hint2),
    hint3: esc(hint3),
  };
}

/**
 * @param {object} m
 * @param {{ question: string }[]} [existing]
 */
export function buildExtra40(m, existing = []) {
  const seen = new Set(existing.map((q) => q.question.trim().toLowerCase()));
  const ys = [...new Set(m.years)].sort((a, b) => a - b);
  const first = ys[0];
  const last = ys[ys.length - 1];
  const ysStr = yearsLabel(ys);
  const nT = ys.length;
  const continent = CONTINENT[m.country] ?? 'Europe';
  const candidates = [];

  const tryPush = (q) => {
    const k = q.question.trim().toLowerCase();
    if (seen.has(k)) return;
    seen.add(k);
    candidates.push(q);
  };

  for (const y of ys) {
    const h = HOST[y] || 'Unknown';
    const w = wrongHosts(h);
    tryPush(
      makeQ(
        'medium',
        `The FIFA World Cup finals tournament in ${y} were hosted by which country?`,
        h,
        w[0],
        w[1],
        w[2],
        'A',
        esc(`Think ${y}.`),
        esc('Host nation.'),
        esc(h),
      ),
    );
  }

  for (const y of ys) {
    const h = HOST[y] || 'Unknown';
    const w = wrongHosts(h);
    tryPush(
      makeQ(
        'medium',
        `Where was the ${y} FIFA World Cup held?`,
        h,
        w[0],
        w[1],
        w[2],
        'A',
        esc(`${y} edition.`),
        esc('Host country.'),
        esc(h),
      ),
    );
  }

  tryPush(
    makeQ(
      'medium',
      `How many different FIFA World Cup final tournaments did ${m.name} play in?`,
      String(nT),
      String(Math.max(0, nT - 1)),
      String(nT + 2),
      String(nT + 4),
      'A',
      esc('Count distinct years.'),
      esc(ysStr),
      esc(String(nT)),
    ),
  );

  tryPush(
    makeQ(
      'medium',
      `Which on-field role best matches ${m.name} for ${m.country} at World Cups?`,
      m.position,
      'Goalkeeper',
      'Centre-forward',
      'Right winger',
      'A',
      esc('Primary position.'),
      esc(m.country),
      esc(m.position),
    ),
  );

  tryPush(
    makeQ(
      'medium',
      `Which phrase best describes ${m.country}'s deepest World Cup run with ${m.name} in the squad?`,
      m.bestRound,
      'Group stage only',
      'Never qualified',
      'Quarter-finals',
      'A',
      esc('Knockout progress.'),
      esc(m.country),
      esc(m.bestRound),
    ),
  );

  tryPush(
    makeQ(
      'medium',
      `${m.country} is most closely associated with which confederation region at the World Cup?`,
      continent,
      continent === 'Europe' ? 'South America' : 'Europe',
      'Africa',
      'Oceania',
      'A',
      esc('Geography.'),
      esc(m.country),
      esc(continent),
    ),
  );

  tryPush(
    makeQ(
      'hard',
      `True or False: ${m.name} played at more than one FIFA World Cup finals tournament.`,
      nT > 1 ? 'True' : 'False',
      nT > 1 ? 'False' : 'True',
      'Only in qualifiers',
      'Only at youth level',
      'A',
      esc('Count tournaments.'),
      esc(ysStr),
      esc(nT > 1 ? 'True' : 'False'),
    ),
  );

  if (m.finalLossTo) {
    const w = shuffleWrong(m.finalLossTo, ['Brazil', 'Italy', 'Argentina', 'Spain', 'Germany']);
    tryPush(
      makeQ(
        'hard',
        `In ${m.name}'s World Cup era, which nation defeated ${m.country} in a World Cup final?`,
        m.finalLossTo,
        w[0],
        w[1],
        w[2],
        'A',
        esc('Final opponent.'),
        esc('Decisive match.'),
        esc(m.finalLossTo),
      ),
    );
  }

  if (m.thirdPlaceBeat) {
    const w = shuffleWrong(m.thirdPlaceBeat, ['Netherlands', 'France', 'Germany', 'Spain']);
    tryPush(
      makeQ(
        'hard',
        `In a World Cup third-place match featuring ${m.country} with ${m.name} in the squad, who was the opponent?`,
        m.thirdPlaceBeat,
        w[0],
        w[1],
        w[2],
        'A',
        esc('Bronze match.'),
        esc(m.country),
        esc(m.thirdPlaceBeat),
      ),
    );
  }

  if (m.semiBeat) {
    const w = shuffleWrong(m.semiBeat, ['Brazil', 'Germany', 'Spain', 'Portugal']);
    tryPush(
      makeQ(
        'hard',
        `At a World Cup in ${m.name}'s era, ${m.country} eliminated which team in a semi-final?`,
        m.semiBeat,
        w[0],
        w[1],
        w[2],
        'A',
        esc('Semi-final.'),
        esc(m.country),
        esc(m.semiBeat),
      ),
    );
  }

  tryPush(
    makeQ(
      'hard',
      `Did ${m.name} win a FIFA World Cup as a player with ${m.country}?`,
      m.wonWorldCup ? 'Yes' : 'No',
      m.wonWorldCup ? 'No' : 'Yes',
      'Only as a coach',
      'Only at Olympic level',
      'A',
      esc('Senior trophy.'),
      esc(m.country),
      esc(m.wonWorldCup ? 'Yes' : 'No'),
    ),
  );

  if (m.note) {
    tryPush(
      makeQ(
        'hard',
        `Which statement about ${m.name} and the World Cup is supported by the facts?`,
        m.note,
        esc('He never played at a World Cup.'),
        esc('He only played friendlies for the national team.'),
        esc('He switched nationality after qualifying.'),
        'A',
        esc('Documented fact.'),
        esc(m.country),
        esc('First option'),
      ),
    );
  }

  const in2000s = ys.some((y) => y >= 2000 && y < 2010);
  tryPush(
    makeQ(
      'hard',
      `True or False: ${m.name} appeared at a FIFA World Cup held in the 2000s (2000–2009).`,
      in2000s ? 'True' : 'False',
      in2000s ? 'False' : 'True',
      'Only in the 1990s',
      'Only after 2015',
      'A',
      esc('Calendar decades.'),
      esc(ysStr),
      esc(in2000s ? 'True' : 'False'),
    ),
  );

  const in2010s = ys.some((y) => y >= 2010 && y < 2020);
  tryPush(
    makeQ(
      'hard',
      `True or False: ${m.name} appeared at a FIFA World Cup held in the 2010s (2010–2019).`,
      in2010s ? 'True' : 'False',
      in2010s ? 'False' : 'True',
      'Only before 2000',
      'Only in 2022',
      'A',
      esc('Calendar decades.'),
      esc(ysStr),
      esc(in2010s ? 'True' : 'False'),
    ),
  );

  if (last === first) {
    tryPush(
      makeQ(
        'hard',
        `${m.name} played at only one World Cup finals edition. How many years separate first and last finals appearance in his record?`,
        '0',
        '4',
        '8',
        '12',
        'A',
        esc('Single tournament.'),
        esc(String(first)),
        esc('0'),
      ),
    );
  } else {
    tryPush(
      makeQ(
        'hard',
        `Across ${m.name}'s World Cup career, what is the span in years between his first and last World Cup finals appearance?`,
        String(last - first),
        String(last - first + 4),
        String(Math.max(0, last - first - 4)),
        '0',
        'A',
        esc('Subtract first year from last year.'),
        esc(ysStr),
        esc(String(last - first)),
      ),
    );
  }

  tryPush(
    makeQ(
      'hard',
      `Which national team did ${m.name} represent at FIFA World Cup finals tournaments?`,
      m.country,
      'Brazil',
      'Germany',
      'Spain',
      'A',
      esc('International allegiance.'),
      esc('Senior caps at finals.'),
      esc(m.country),
    ),
  );

  tryPush(
    makeQ(
      'hard',
      `Which list contains every calendar year in which ${m.name} played at a World Cup finals tournament?`,
      ysStr,
      String(first),
      String(last),
      `${last}, ${first - 4}`,
      'A',
      esc('All editions.'),
      esc('Distinct years.'),
      esc(ysStr),
    ),
  );

  let pad = 0;
  while (candidates.length < 40) {
    const y = ys[pad % ys.length];
    const h = HOST[y] || 'Unknown';
    const w = wrongHosts(h);
    tryPush(
      makeQ(
        'hard',
        `Supplemental ${pad}: the ${y} FIFA World Cup was hosted by which country? (${m.name})`,
        h,
        w[0],
        w[1],
        w[2],
        'A',
        esc(`Fill ${pad}.`),
        esc(String(y)),
        esc(h),
      ),
    );
    pad++;
    if (pad > 500) break;
  }

  return candidates.slice(0, 40).map((q, i) => ({
    ...q,
    id: `${m.id}-${i + 11}`,
  }));
}
