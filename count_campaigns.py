#!/usr/bin/env python3
import re

with open('src/data/campaignQuestions.ts', 'r') as f:
    content = f.read()

# Find all country blocks
countries = {}
lines = content.split('\n')
current_country = None
in_country = False

for i, line in enumerate(lines, 1):
    # Check for country entry
    match = re.match(r"^\s+([a-z\s']+):\s*\{", line)
    if match:
        country = match.group(1).strip().strip("'\"")
        if country and country not in ['getCampaignQuestions', 'export', 'const']:
            current_country = country
            countries[country] = []
            in_country = True
            continue
    
    if in_country and current_country:
        # Check for year entry
        year_match = re.match(r"^\s+(\d{4}):\s*\[", line)
        if year_match:
            year = int(year_match.group(1))
            if year not in countries[current_country]:
                countries[current_country].append(year)
        
        # Check if we've left this country (new country starts)
        if re.match(r"^\s+[a-z\s']+:\s*\{", line) and not re.match(rf"^\s+{re.escape(current_country)}", line):
            in_country = False
            current_country = None

# Sort by campaign count
sorted_countries = sorted(countries.items(), key=lambda x: len(x[1]), reverse=True)

print("="*80)
print("ALL COUNTRIES - CAMPAIGN COUNT")
print("="*80)
print(f"\nTotal countries: {len(countries)}\n")

for country, years in sorted_countries:
    if years:  # Only show countries with campaigns
        print(f"{country:30s} : {len(years):2d} campaigns - {sorted(years)}")

print("\n" + "="*80)
print("TOP 20 COUNTRIES BY CAMPAIGN COUNT")
print("="*80)

for i, (country, years) in enumerate(sorted_countries[:20], 1):
    if years:
        print(f"{i:2d}. {country:30s} : {len(years):2d} campaigns")

# Check specific countries mentioned by user
print("\n" + "="*80)
print("USER-MENTIONED COUNTRIES CHECK")
print("="*80)
user_countries = ['brazil', 'germany', 'france', 'england', 'italy', 'hungary', 
                  'netherlands', 'south korea', 'sweden', 'mexico', 'switzerland', 
                  'chile', 'cameroon', 'united states', 'uruguay', 'romania']

for country in user_countries:
    found = False
    for key, years in countries.items():
        if key.lower() == country.lower() or key.lower().strip("'\"") == country.lower():
            print(f"{country:20s} : {len(years):2d} campaigns - {sorted(years)}")
            found = True
            break
    if not found:
        print(f"{country:20s} : NOT FOUND")
