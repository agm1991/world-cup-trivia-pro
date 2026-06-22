#!/usr/bin/env python3
"""Merge src/data/scorelineCurated25to50/level_*.json into scorelineLevels25to50Curated.json (26 levels)."""
from __future__ import annotations

import json
from pathlib import Path

H3 = (
    "Pick the regulation / extra-time scoreline "
    "(penalty shootouts use the draw before pens unless noted)."
)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    frag_dir = root / "src/data/scorelineCurated25to50"
    out_path = root / "src/data/scorelineLevels25to50Curated.json"

    out: list[list[dict]] = []
    for lv in range(25, 51):
        p = frag_dir / f"level_{lv:03d}.json"
        if not p.exists():
            raise SystemExit(f"missing fragment: {p}")
        chunk = json.loads(p.read_text(encoding="utf-8"))
        if not isinstance(chunk, list) or len(chunk) != 10:
            raise SystemExit(f"{p}: expected JSON array length 10, got {len(chunk) if isinstance(chunk, list) else type(chunk)}")
        # Ensure hint3 + ids
        for i, q in enumerate(chunk):
            q["hint3"] = H3
            exp_id = f"sc-cur-{lv}-{i + 1:02d}"
            if q.get("id") != exp_id:
                q["id"] = exp_id
        out.append(chunk)

        # Adjacent phase rule (no back-to-back same phase label)

    def phase_from_question(question: str) -> str:
        parts = question.split(" — ")
        return parts[-1].strip() if len(parts) >= 3 else ""

    for lvl_idx, lvl in enumerate(out):
        lv = 25 + lvl_idx
        for i in range(len(lvl) - 1):
            a = phase_from_question(lvl[i]["question"])
            b = phase_from_question(lvl[i + 1]["question"])
            if a == b:
                raise SystemExit(
                    f"Level {lv}: adjacent Q{i+1} & Q{i+2} share phase {a!r} (rule: no back-to-back)."
                )

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {len(out)} levels -> {out_path}")


if __name__ == "__main__":
    main()
