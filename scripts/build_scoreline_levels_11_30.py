#!/usr/bin/env python3
"""Emit src/data/scorelineLevels11to30Curated.json — 20 levels × 10 questions."""
from __future__ import annotations

import json
from pathlib import Path

from scoreline_curriculum_13_30 import get_levels_13_30

H3 = "Pick the regulation / extra-time scoreline (penalty shootouts use the draw before pens unless noted)."


def mk(
    level: int,
    n: int,
    year: int,
    left: str,
    right: str,
    phase: str,
    opt: tuple[str, str, str, str],
    ans: str,
    diff: str,
    h1: str,
    h2: str,
    note: str | None = None,
) -> dict:
    d: dict = {
        "id": f"sc-cur-{level}-{n:02d}",
        "category": "guess-scoreline",
        "difficulty": diff,
        "question": f"FIFA World Cup {year} — {left} vs {right} — {phase}",
        "optionA": opt[0],
        "optionB": opt[1],
        "optionC": opt[2],
        "optionD": opt[3],
        "correctAnswer": ans,
        "hint1": h1,
        "hint2": h2,
        "hint3": H3,
    }
    if note:
        d["scorelineResultNote"] = note
    return d


def main() -> None:
    out: list[list[dict]] = []

    # Level 11 — 2014 & 2010 group classics (medium)
    out.append([
        mk(11, 1, 2014, "Spain 🇪🇸", "Chile 🇨🇱", "GROUP STAGE", ("0-1", "0-2", "1-2", "0-0"), "B", "medium", "Maracanã upset; champions out.", "Two first-half Chile goals sank Spain."),
        mk(11, 2, 2010, "France 🇫🇷", "Mexico 🇲🇽", "GROUP STAGE", ("0-1", "0-2", "1-2", "0-0"), "B", "medium", "Polokwane; Chicharito and Blanco penalties.", "Mexico’s first WC win vs holders."),
        mk(11, 3, 2014, "USA 🇺🇸", "Portugal 🇵🇹", "GROUP STAGE", ("1-1", "2-2", "2-1", "1-2"), "B", "medium", "Manaus humidity; Ronaldo set up Silvestre Varela late.", "Silvério deep in added-time header."),
        mk(11, 4, 2010, "England 🏴󠁧󠁢󠁥󠁮󠁧󠁿", "USA 🇺🇸", "GROUP STAGE", ("0-0", "1-1", "2-1", "1-0"), "B", "medium", "Rustenburg opener; Steven Gerrard strike.", "Clint Dempsey’s shot squirmed past Rob Green."),
        mk(11, 5, 2014, "Australia 🇦🇺", "Netherlands 🇳🇱", "GROUP STAGE", ("1-3", "2-3", "2-2", "1-2"), "B", "medium", "Porto Alegre thriller; Cahill thunderbolt replied.", "Depay curled a late Dutch winner."),
        mk(11, 6, 2010, "Italy 🇮🇹", "Paraguay 🇵🇾", "GROUP STAGE", ("0-0", "1-1", "0-1", "1-0"), "B", "medium", "Cape Town parity; Alcaraz header.", "De Rossi levelled early in second half."),
        mk(11, 7, 2014, "Italy 🇮🇹", "Uruguay 🇺🇾", "GROUP STAGE", ("0-0", "0-1", "1-1", "1-0"), "B", "medium", "Natal; Godín decides after late drama.", "Suárez incident shadows the Uruguay goal."),
        mk(11, 8, 2010, "Brazil 🇧🇷", "Ivory Coast 🇨🇮", "GROUP STAGE", ("2-0", "3-1", "2-1", "3-0"), "B", "medium", "Jo’burg — Luís Fabiano brace.", "Drogba off the bench to halve arrears."),
        mk(11, 9, 2014, "England 🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Italy 🇮🇹", "GROUP STAGE", ("1-1", "1-2", "0-1", "0-2"), "B", "medium", "Manaus sauna; Marchisio screamer opener.", "Super Mario decides with a towering header."),
        mk(11, 10, 2010, "Slovenia 🇸🇮", "USA 🇺🇸", "GROUP STAGE", ("1-1", "2-2", "2-1", "3-2"), "B", "medium", "Johannesburg; Donovan sparks rally.", "Michael Bradley grabs a second comeback goal."),
    ])

    # Level 12 — 2006 & 2002 classics — Q4 Portugal 3–2 USA (options corrected to include 3-2)
    out.append([
        mk(12, 1, 2006, "Italy 🇮🇹", "Ghana 🇬🇭", "GROUP STAGE", ("1-0", "2-0", "2-1", "3-0"), "B", "medium", "Hanover — Pirlo free-kick, Iaquinta late.", "Muntari red card swung the midfield."),
        mk(12, 2, 2002, "England 🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Argentina 🇦🇷", "GROUP STAGE", ("0-0", "1-0", "1-1", "2-1"), "B", "medium", "Beckham pen from Owen run; redemption in Sapporo.", "Argentina finished bottom of England’s trio."),
        mk(12, 3, 2006, "Czech Republic 🇨🇿", "USA 🇺🇸", "GROUP STAGE", ("2-0", "3-0", "3-1", "4-0"), "B", "medium", "Gelsenkirchen; Koller, Rosický (2).", "Czechs ran riot vs Bruce Arena side."),
        mk(12, 4, 2002, "Portugal 🇵🇹", "USA 🇺🇸", "GROUP STAGE", ("3-2", "2-3", "3-3", "4-2"), "A", "medium", "Suwon comeback; Pauleta put Portugal ahead again.", "McBride header crowned the US comeback to start the group."),
        mk(12, 5, 2006, "France 🇫🇷", "Korea Republic 🇰🇷", "GROUP STAGE", ("1-0", "1-1", "0-0", "0-1"), "B", "medium", "Leipzig; Park scrambled an equaliser late.", "Zidane stayed on bench as France stalled."),
        mk(12, 6, 2002, "Denmark 🇩🇰", "France 🇫🇷", "GROUP STAGE", ("1-0", "2-0", "1-1", "2-1"), "B", "medium", "Incheon; holders humbled by Tomasson & Rommedahl.", "France failed to score in the group."),
        mk(12, 7, 2006, "Brazil 🇧🇷", "Australia 🇦🇺", "GROUP STAGE", ("1-0", "2-0", "3-0", "2-1"), "B", "medium", "Munich — Adriano, Fred wraps.", "Harry Kewell’s side rallied but fell short."),
        mk(12, 8, 2002, "Germany 🇩🇪", "Republic of Ireland 🇮🇪", "GROUP STAGE", ("1-0", "1-1", "0-0", "2-1"), "B", "medium", "Ibaraki; Keane nodded in desperate stoppage time.", "Klose already on the scoresheet for Germany."),
        mk(12, 9, 2006, "Togo 🇹🇬", "South Korea 🇰🇷", "GROUP STAGE", ("1-1", "1-2", "0-2", "0-1"), "B", "medium", "Frankfurt comeback; Tottenham link Adebayor-era Togo opener.", "Two Korean goals flipped the tale."),
        mk(12, 10, 2002, "Argentina 🇦🇷", "Sweden 🇸🇪", "GROUP STAGE", ("0-0", "1-1", "0-1", "1-2"), "B", "medium", "Miyagi; Anders Svensson free-kick response.", "Group F honours shared as Ortega subbed."),
    ])

    out.extend(get_levels_13_30(mk))

    root = Path(__file__).resolve().parents[1]
    target = root / "src/data/scorelineLevels11to30Curated.json"
    target.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(out)} levels ({sum(len(x) for x in out)} questions) -> {target}")


if __name__ == "__main__":
    main()
