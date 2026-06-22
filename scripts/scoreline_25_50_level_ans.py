"""
One string per Guess-the-Scoreline level (25–50), length 10 = answers Q1–Q10.
Letters index options A–D from the authored spec order.
Fact-check spotty for 1930s–1950s; adjust if historians disagree.
"""

from __future__ import annotations

LEVEL_ANS_STRINGS: tuple[str, ...] = (
    "CBBBBBBBCB",  # 25 HARD
    "BBCCBBBBBB",  # 26
    "BBCBCBCBBB",  # 27
    "BCABBCBBBB",  # 28 (Q3: fixed options include 2-2)
    "BBCBBBBBBB",  # 29
    "BBBBBBCBCB",  # 30
    "CBBBCCBBBB",  # 31
    "CCCCBBBBCB",  # 32
    "BBBBCBBBBB",  # 33
    "BCCBBBBCBB",  # 34
    "ABBBBBCBBB",  # 35
    "BBBBCBBBCB",  # 36
    "BBBBCBBBCB",  # 37
    "BCBBBCBBBB",  # 38
    "BBBCCBBBCC",  # 39
    "BCCBBBBCBB",  # 40
    "BBBCCBBBCC",  # 41
    "BCCBBBBCBB",  # 42
    "BBBCCBBBCC",  # 43
    "BBBCCBBBCC",  # 44
    "BBCCCCBBBB",  # 45
    "BCCBBBBBCB",  # 46 Q8 USA–BE 3–0 = B
    "BBBCCBBBCC",  # 47
    "BCCBBBCCCB",  # 48
    "BCCBBBCCCB",  # 49
    "BBBCCBBBCC",  # 50
)


def flattened() -> str:
    s = "".join(LEVEL_ANS_STRINGS)
    assert len(s) == 260, len(s)
    return s


__all__ = ["LEVEL_ANS_STRINGS", "flattened"]
