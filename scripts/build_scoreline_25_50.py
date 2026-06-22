#!/usr/bin/env python3
"""Emit fragments + scorelineLevels25to50Curated.json from scripts/scoreline_25_50_tuple_data.TUP."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = Path(__file__).resolve().parent
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

from scoreline_25_50_tuple_data import TUP  # noqa: E402

OUT = ROOT / "src/data/scorelineLevels25to50Curated.json"
FRAGDIR = ROOT / "src/data/scorelineCurated25to50"

H3 = (
    "Pick the regulation / extra-time scoreline "
    "(penalty shootouts use the draw before pens unless noted)."
)


def diff(lv: int) -> str:
    if lv <= 30:
        return "hard"
    if lv <= 45:
        return "tricky"
    return "ultimate"


def mk(
    lv: int,
    n: int,
    y: int,
    left: str,
    right: str,
    phase: str,
    opt: tuple[str, str, str, str],
    ans: str,
    note: str | None,
    h1: str,
    h2: str,
) -> dict:
    d: dict = {
        "id": f"sc-cur-{lv}-{n:02d}",
        "category": "guess-scoreline",
        "difficulty": diff(lv),
        "question": f"FIFA World Cup {y} — {left} vs {right} — {phase}",
        "optionA": opt[0],
        "optionB": opt[1],
        "optionC": opt[2],
        "optionD": opt[3],
        "correctAnswer": ans,
        "hint1": h1,
        "hint2": h2,
        "hint3": H3,
    }
    if note in ("pens", "aet"):
        d["scorelineResultNote"] = note
    return d


def phase_from_q(question: str) -> str:
    parts = question.split(" — ")
    return parts[-1].strip() if len(parts) >= 3 else ""


def hints(y: int, phase: str) -> tuple[str, str]:
    h1 = f"FIFA World Cup {y} — {phase}."
    h2 = "Ledger: regulation / extra-time before shootouts unless noted."
    return h1, h2


def main() -> None:
    rows: list[dict] = []
    for t in TUP:
        if len(t) != 9:
            raise SystemExit(f"tuple must have 9 fields, got {len(t)}: {t!r}")
        lv, n, y, L, R, P, opt, ans, note = t
        nnote = note.strip().lower() if isinstance(note, str) and note else None
        if nnote == "":
            nnote = None
        elif nnote not in (None, "pens", "aet"):
            nnote = None
        hi, h2 = hints(int(y), P)
        rows.append(mk(lv, n, int(y), L, R, P, opt, ans, nnote, hi, h2))

    if len(rows) != 260:
        raise SystemExit(f"Expected TUP length 260, got {len(rows)}")

    by: dict[int, list[dict]] = {lv: [] for lv in range(25, 51)}
    for q in rows:
        lv = int(q["id"].split("-")[2])
        by[lv].append(q)

    levels: list[list[dict]] = []
    for lv in range(25, 51):
        chunk = sorted(by[lv], key=lambda qq: qq["id"])
        if len(chunk) != 10:
            raise SystemExit(f"Level {lv}: expected 10, got {len(chunk)}")
        for i in range(9):
            a = phase_from_q(chunk[i]["question"])
            b = phase_from_q(chunk[i + 1]["question"])
            if a == b:
                raise SystemExit(f"Level {lv}: adjacent Q{i+1} & Q{i+2} share phase {a!r}")
        levels.append(chunk)

    FRAGDIR.mkdir(parents=True, exist_ok=True)
    for chunk in levels:
        lv = int(chunk[0]["id"].split("-")[2])
        (FRAGDIR / f"level_{lv:03d}.json").write_text(
            json.dumps(chunk, ensure_ascii=False, indent=2) + "\n", encoding="utf-8",
        )
    OUT.write_text(json.dumps(levels, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"OK: {len(levels)} levels -> {OUT}")


if __name__ == "__main__":
    main()
