#!/usr/bin/env python3
"""Build src/data/scorelineLevels25to50Curated.json from spec + answer key."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from scoreline_25_50_level_ans import LEVEL_ANS_STRINGS  # noqa: E402
from scoreline_spec_parser import SpecQ, parse_spec  # noqa: E402

SPEC_PATH = ROOT / "docs" / "scoreline-levels-25-50-spec.md"
OUT_JSON = ROOT / "src" / "data" / "scorelineLevels25to50Curated.json"

# (level, qn) -> four option strings (order A–D). Historical fixes only.
OPTION_FIXES: dict[tuple[int, int], tuple[str, str, str, str]] = {
    (28, 3): ("2-2", "1-1", "2-1", "1-0"),  # SA–MA 1994 was 2–2; spec omitted it
}


def norm_phase_for_match(phase: str, year: int) -> str:
    """Distinguish knockouts by year so levels with many finals (e.g. 50) remain orderable."""
    u = " ".join(phase.upper().split())
    if u.startswith("FINAL"):
        return f"FINAL_{year}"
    if "THIRD" in u:
        return f"THIRD_{year}"
    if "SEMI" in u:
        return f"SEMI_{year}"
    if "QUARTER" in u:
        return f"QUARTER_{year}"
    if "ROUND OF 16" in u:
        return f"R16_{year}"
    if "SECOND ROUND" in u:
        return f"SECOND_ROUND_GROUP_{year}"
    if "GROUP" in u:
        return "GROUP_STAGE"
    return u


def adjacent_phases_forbidden(a: str, b: str) -> bool:
    """Reuse of abstract group-stage label is OK; knockouts keyed by year are distinct elsewhere."""
    if a != b:
        return False
    if a == "GROUP_STAGE":
        return False
    return True


def reorder_for_phase_adjacency(
    pairs: list[tuple[SpecQ, str]], level: int
) -> list[tuple[SpecQ, str]]:
    """Permute so adjacent knockout rounds (non–group-stage) never repeat."""
    n = len(pairs)
    phases = [
        norm_phase_for_match(sq.phase, sq.year)
        for sq, _ in pairs
    ]

    def dfs(path: list[int]) -> list[int] | None:
        if len(path) == n:
            return path
        for j in range(n):
            if j in path:
                continue
            if path and adjacent_phases_forbidden(phases[path[-1]], phases[j]):
                continue
            found = dfs(path + [j])
            if found is not None:
                return found
        return None

    perm = dfs([])
    if perm is None:
        raise SystemExit(
            f"Level {level}: cannot order 10 questions without adjacent duplicate phase"
        )
    return [pairs[i] for i in perm]


def check_adjacency(level: int, rows: list[dict]) -> None:
    phases: list[str] = []
    for r in rows:
        m = re.match(r"^FIFA World Cup (\d{4}) — .+ — (.+)$", r["question"].strip(), re.DOTALL)
        if not m:
            raise ValueError(f"L{level}: bad question format: {r['question'][:120]}...")
        yr = int(m.group(1))
        ph_raw = m.group(2)
        phases.append(norm_phase_for_match(ph_raw, yr))
    for i in range(1, len(phases)):
        if adjacent_phases_forbidden(phases[i], phases[i - 1]):
            raise SystemExit(
                f"Adjacent same knockout phase in L{level} Q{i} vs Q{i+1}: {phases[i - 1]!r}"
            )


def letter_to_index(ch: str) -> int:
    return "ABCD".index(ch.upper())


def maybe_scoreline_note(opts: tuple[str, str, str, str], letter: str) -> str | None:
    idx = letter_to_index(letter)
    raw = opts[idx].lower()
    if "pens" in raw or "(pens)" in raw:
        return "pens"
    if "aet" in raw or "(aet)" in raw or "a.e.t" in raw:
        return "aet"
    return None


def spec_to_questions(spec: list[SpecQ]) -> list[list[dict]]:
    by_level: dict[int, list[SpecQ]] = {}
    for q in spec:
        by_level.setdefault(q.level, []).append(q)
    for lv in range(25, 51):
        by_level[lv].sort(key=lambda x: x.n)

    out_levels: list[list[dict]] = []
    for li, lv in enumerate(range(25, 51)):
        ans = LEVEL_ANS_STRINGS[li]
        rows: list[dict] = []
        qs = by_level[lv]
        if len(qs) != 10 or len(ans) != 10:
            raise SystemExit(f"Level {lv}: need 10 questions and 10 answers")
        spec_pairs = []
        for j, sq in enumerate(qs):
            if sq.n != j + 1:
                raise SystemExit(f"L{lv}: expected Q{j+1}, got Q{sq.n}")
            ch = ans[j]
            if ch.upper() not in "ABCD":
                raise SystemExit(f"L{lv} Q{sq.n}: bad letter {ch!r}")
            spec_pairs.append((sq, ch))
        ordered = reorder_for_phase_adjacency(spec_pairs, lv)

        rows = []
        for pos, (sq, ch) in enumerate(ordered, start=1):
            opts = OPTION_FIXES.get((lv, sq.n), sq.opts)
            cor = ch.upper()

            obj: dict = {
                "id": f"sc-cur-{lv}-{pos:02d}",
                "category": "guess-scoreline",
                "difficulty": "hard",
                "question": (
                    f"FIFA World Cup {sq.year} — {sq.left_vs_right_line.strip()} — "
                    f"{sq.phase.strip().upper()}"
                ),
                "optionA": opts[0],
                "optionB": opts[1],
                "optionC": opts[2],
                "optionD": opts[3],
                "correctAnswer": cor,
                "hint1": f"{sq.phase.strip()} — {sq.year} edition.",
                "hint2": "Guess the scoreline from the teams and round (regulation or extra time).",
                "hint3": (
                    "Pick the regulation / extra-time scoreline "
                    "(penalty shootouts use the draw before pens unless noted)."
                ),
            }
            note = maybe_scoreline_note(opts, cor)
            if note:
                obj["scorelineResultNote"] = note
            rows.append(obj)

        check_adjacency(lv, rows)
        out_levels.append(rows)
    return out_levels


def main() -> None:
    md = SPEC_PATH.read_text(encoding="utf-8")
    spec = parse_spec(md)
    data = spec_to_questions(spec)
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUT_JSON} ({len(data)} levels × 10).")


if __name__ == "__main__":
    main()
