#!/usr/bin/env python3
"""Parse docs/scoreline-levels-25-50-spec.md into ordered question structs."""
from __future__ import annotations

import re
from pathlib import Path
from dataclasses import dataclass


@dataclass(frozen=True)
class SpecQ:
    level: int
    n: int
    year: int
    left_vs_right_line: str
    phase: str
    opts: tuple[str, str, str, str]


def parse_spec(md: str) -> list[SpecQ]:
    md = md.replace("\r\n", "\n")
    blocks = re.split(r"(?mi)^Level\s+(\d{1,2})\s*$", md)[1:]
    out: list[SpecQ] = []
    for i in range(0, len(blocks), 2):
        lvl = int(blocks[i])
        body = blocks[i + 1]
        qs = re.split(r"(?m)^(?=\d+\.\s+FIFA\s+World\s+Cup\b)", body)
        qs = [q.strip() for q in qs if q.strip()]
        for qb in qs:
            mnum = re.match(r"(\d+)\.\s+FIFA\s+World\s+Cup\s+(\d{4})\s*$", qb.split("\n")[0].strip())
            if not mnum:
                continue
            qn = int(mnum.group(1))
            year = int(mnum.group(2))
            rest = qb.split("\n", 1)[1]
            lines = [ln.strip() for ln in rest.split("\n")]
            matchup = ""
            phase = ""
            opts: list[str] = []
            mode = None
            for ln in lines:
                if not ln.strip():
                    continue
                low = ln.lower()
                if low.startswith(("a.", "b.", "c.", "d.")):
                    txt = ln.split(".", 1)[1].strip()
                    opts.append(txt)
                    continue
                if not matchup and (" vs " in ln or " Vs " in ln):
                    matchup = ln
                    continue
                if matchup and opts == []:
                    phase = ln
                    continue
            if len(opts) != 4 or not matchup or not phase:
                raise ValueError(f"Bad block L{lvl} Q{qn}:\n{qb[:280]}...")
            out.append(SpecQ(lvl, qn, year, matchup, phase, (opts[0], opts[1], opts[2], opts[3])))
    ordered = sorted(out, key=lambda q: (q.level, q.n))
    if len(ordered) != 260:
        raise ValueError(f"Expected 260 questions, got {len(ordered)}")
    return ordered
