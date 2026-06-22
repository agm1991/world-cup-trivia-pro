#!/usr/bin/env python3
import re

# Read the file
with open('src/data/campaignQuestions.ts', 'r') as f:
    lines = f.readlines()

# Expected campaigns for each country (actual World Cup participations)
expected = {
    'brazil': [1930, 1934, 1938, 1950, 1954, 1958, 1962, 1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022],  # 22
    'germany': [1934, 1938, 1954, 1958, 1962, 1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022],  # 20 (including West Germany)
    'france': [1930, 1934, 1938, 1954, 1958, 1966, 1978, 1982, 1986, 1998, 2002, 2006, 2010, 2014, 2018, 2022],  # 16
    'england': [1950, 1954, 1958, 1962, 1966, 1970, 1982, 1986, 1990, 1998, 2002, 2006, 2010, 2014, 2018, 2022],  # 16
    'italy': [1934, 1938, 1950, 1954, 1962, 1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014],  # 18
    'hungary': [1934, 1938, 1954, 1958, 1962, 1966, 1978, 1982, 1986],  # 9
    'netherlands': [1934, 1938, 1974, 1978, 1990, 1994, 1998, 2006, 2010, 2014, 2022],  # 11
    'sweden': [1934, 1938, 1950, 1958, 1970, 1974, 1978, 1990, 1994, 2002, 2006, 2018],  # 12
    'mexico': [1930, 1950, 1954, 1958, 1962, 1966, 1970, 1978, 1986, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022],  # 17
    'switzerland': [1934, 1938, 1950, 1954, 1962, 1966, 1994, 2006, 2010, 2014, 2018, 2022],  # 12
    'chile': [1930, 1950, 1962, 1966, 1974, 1982, 1998, 2010, 2014],  # 9
    'cameroon': [1982, 1990, 1994, 1998, 2002, 2010, 2014, 2022],  # 8
    'united states': [1930, 1934, 1950, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2022],  # 11
    'uruguay': [1930, 1950, 1954, 1962, 1966, 1970, 1974, 1986, 1990, 2002, 2010, 2014, 2018, 2022],  # 14
    'south korea': [1954, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022],  # 11
    'romania': [1930, 1934, 1938, 1970, 1990, 1994, 1998],  # 7
}

print("="*80)
print("ONE-BY-ONE COUNTRY CAMPAIGN ANALYSIS")
print("="*80)

for country_name in sorted(expected.keys()):
    print(f"\n{'='*80}")
    print(f"COUNTRY: {country_name.upper()}")
    print(f"Expected: {len(expected[country_name])} campaigns")
    print(f"Expected years: {expected[country_name]}")
    print('-'*80)
    
    # Find all year entries for this country
    pattern = rf'^\s+{country_name}:\s*\{{'
    years_found = []
    in_country = False
    
    for i, line in enumerate(lines, 1):
        if re.match(pattern, line):
            in_country = True
            continue
        
        if in_country:
            # Check for year entry
            year_match = re.match(r'^\s+(\d{4}):\s*\[', line)
            if year_match:
                year = int(year_match.group(1))
                years_found.append(year)
            
            # Check if we've left this country
            if re.match(r'^\s+[a-z\s\']+:\s*\{', line) and not re.match(pattern, line):
                break
            if re.match(r'^\s+\}\s*,?\s*$', line) and in_country and years_found:
                # Check if next line is another country
                if i < len(lines) - 1:
                    next_line = lines[i].strip()
                    if next_line and not next_line.startswith('//'):
                        break
    
    years_found = sorted(set(years_found))
    print(f"Found in file: {len(years_found)} campaigns")
    print(f"Years in file: {years_found}")
    
    missing = [y for y in expected[country_name] if y not in years_found]
    extra = [y for y in years_found if y not in expected[country_name]]
    
    if missing:
        print(f"❌ MISSING: {missing} ({len(missing)} campaigns)")
    if extra:
        print(f"⚠️  EXTRA (not actual participation): {extra} ({len(extra)} campaigns)")
    if not missing and not extra:
        print("✅ CORRECT - All campaigns present and no extras")
    
    print(f"Status: {len(years_found)}/{len(expected[country_name])} campaigns")

print("\n" + "="*80)
print("SUMMARY")
print("="*80)
