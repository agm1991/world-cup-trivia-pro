#!/usr/bin/env python3
"""
Build scoreline_levels_25_to_50: reads embedded TSV-style rows OR fragment dir.
Uses scripts/scoreline_25_50_blob.tsv (tab-separated) — one row per question.
Columns: lvl\tn\t\ty\tL\tR\tphase\toptA\toptB\toptC\toptD\tans\tnote\th1\th2

note: empty | pens | aet
 difficulty set in code per level bucket.
"""

from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOB = Path(__file__).resolve().parent / "scoreline_25_50_blob.tsv"
FRAGDIR = ROOT / "src/data/scorelineCurated25to50"
OUT_JSON = ROOT / "src/data/scorelineLevels25to50Curated.json"

H3 = (
    "Pick the regulation / extra-time scoreline "
    "(penalty shootouts use the draw before pens unless noted)."
)


def diff_for_level(lv: int) -> str:
    if lv <= 30:
        return "hard"
    if lv <= 45:
        return "tricky"
    return "ultimate"


def phase_from_question(q: str) -> str:
    parts = q.split(" — ")
    return parts[-1].strip() if len(parts) >= 3 else ""


def mk_row(lv: int, n: int, y: str, left: str, right: str, phase: str, opts: tuple[str, str, str, str], ans: str, note: str, h1: str, h2: str) -> dict:
    d: dict = {
        "id": f"sc-cur-{lv}-{n:02d}",
        "category": "guess-scoreline",
        "difficulty": diff_for_level(lv),
        "question": f"FIFA World Cup {y} — {left} vs {right} — {phase}",
        "optionA": opts[0],
        "optionB": opts[1],
        "optionC": opts[2],
        "optionD": opts[3],
        "correctAnswer": ans,
        "hint1": h1 or f"{y} narrative beat.",
        "hint2": h2 or "Ledger from whistle to regulation / extra-time.",
        "hint3": H3,
    }
    if note and note.strip() and note.strip().lower() in ("pens", "aet"):
        d["scorelineResultNote"] = note.strip().lower()
    return d


def load_blob() -> list[dict]:
    if not BLOB.exists():
        raise SystemExit(f"Missing {BLOB}")
    rows: list[dict] = []
    text = BLOB.read_text(encoding="utf-8")
    # Allow UTF-8 with optional BOM
    if text.startswith("\ufeff"):
        text = text[1:]
    reader = csv.DictReader(
        text.splitlines(),
        delimiter="\t",
        fieldnames=(
            "lvl",
            "n",
            "y",
            "L",
            "R",
            "phase",
            "a",
            "b",
            "c",
            "d",
            "ans",
            "note",
            "h1",
            "h2",
        ),
    )
    for line_no, raw in enumerate(reader, start=1):
        raw = {k: (raw[k] or "").strip() for k in raw}
        if not raw["lvl"]:
            continue
        lv = int(raw["lvl"])
        n = int(raw["n"])
        opts = (raw["a"], raw["b"], raw["c"], raw["d"])
        note = raw["note"] if raw["note"] else ""
        rows.append(
            mk_row(
                lv,
                n,
                raw["y"],
                raw["L"],
                raw["R"],
                raw["phase"],
                opts,
                raw["ans"],
                note,
                raw["h1"],
                raw["h2"],
            )
        )

    if len(rows) != 260:
        raise SystemExit(f"Expected 260 rows, got {len(rows)} ({BLOB})")
    return rows


def group_levels(rows: list[dict]) -> list[list[dict]]:
    by: dict[int, list[dict]] = {lv: [] for lv in range(25, 51)}
    for q in rows:
        lv = int(q["id"].split("-")[2])
        by[lv].append(q)

    out: list[list[dict]] = []
    for lv in range(25, 51):
        chunk = sorted(by[lv], key=lambda qq: qq["id"])
        if len(chunk) != 10:
            raise SystemExit(f"Level {lv}: expected 10 qs, got {len(chunk)}")
        out.append(chunk)

    # Adjacency check
    for idx, lvl in enumerate(out):
        lv = 25 + idx
        for i in range(9):
            a = phase_from_question(lvl[i]["question"])
            b = phase_from_question(lvl[i + 1]["question"])
            if a == b:
                raise SystemExit(f"Level {lv}: Q{i+1} & Q{i+2} both {a!r}")

    return out


def write_fragments(levels: list[list[dict]]) -> None:
    FRAGDIR.mkdir(parents=True, exist_ok=True)
    for lv, chunk in enumerate(levels, start=25):
        p = FRAGDIR / f"level_{lv:03d}.json"
        p.write_text(json.dumps(chunk, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(p)


def main() -> None:
    rows = load_blob()
    levels = group_levels(rows)
    write_fragments(levels)
    OUT_JSON.write_text(json.dumps(levels, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote merged -> {OUT_JSON}")


if __name__ == "__main__":
    main()
