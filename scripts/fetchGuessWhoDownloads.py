#!/usr/bin/env python3
"""Re-fetch Guess Who portrait thumbnails from Wikipedia into src/assets/players/downloads.

Run from repo root: python3 scripts/fetchGuessWhoDownloads.py
Respect Wikimedia rate limits (built-in delays). Images are typically CC-licensed; verify on Commons.
"""
from __future__ import annotations

import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
DEST = REPO / "src/assets/players/downloads"

PAIRS = [
    ("Mario_Götze", "Mario_Gotze.jpg"),
    ("Julian Alvarez", "Julian_Alvarez.jpg"),
    ("Romelu Lukaku", "Romelu_Lukaku.jpg"),
    ("Hugo Lloris", "Hugo_Lloris.jpg"),
    ("Thomas Müller", "Thomas_Muller.jpg"),
    ("Miroslav Klose", "Miroslav_Klose.jpg"),
    ("Romário", "Romario.jpg"),
    ("Gary Medel", "Gary_Medel.jpg"),
    ("Vincent Kompany", "Vincent_Kompany.jpg"),
    ("David Trezeguet", "David_Trezeguet.jpg"),
    ("Sergio Busquets", "Sergio_Busquets.jpg"),
    ("Dunga", "Dunga.jpg"),
    ("Raphaël Varane", "Raphael_Varane.jpg"),
    ("Gonzalo Montiel", "Gonzalo_Montiel.jpg"),
    ("Marc-Vivien Foé", "Marc_Vivien_Foe.jpg"),
    ("Christophe Dugarry", "Christophe_Dugarry.jpg"),
    ("Jan Vertonghen", "Jan_Vertonghen.jpg"),
    ("Nacer Chadli", "Nacer_Chadli.jpg"),
    ("Didier Deschamps", "Didier_Deschamps.jpg"),
    ("Fabien Barthez", "Fabien_Barthez.jpg"),
    ("Enzo Fernández", "Enzo_Fernandez.jpg"),
    ("Yordan Letchkov", "Yordan_Letchkov.jpg"),
    ("Joan Capdevila", "Joan_Capdevila.jpg"),
    ("Rodrigo De Paul", "Rodrigo_De_Paul.jpg"),
    ("Marcel Desailly", "Marcel_Desailly.jpg"),
    ("Mile Jedinak", "Mile_Jedinak.jpg"),
    ("Eduardo Vargas", "Eduardo_Vargas.jpg"),
    ("Paul Pogba", "Paul_Pogba.jpg"),
    ("Emmanuel Petit", "Emmanuel_Petit.jpg"),
    ("Lúcio", "Lucio.jpg"),
    ("Edmílson", "Edmilson.jpg"),
    ("Marcos Senna", "Marcos_Senna.jpg"),
    ("Mark Bresciano", "Mark_Bresciano.jpg"),
    ("Lukas Podolski", "Lukas_Podolski.jpg"),
]


def main() -> int:
    DEST.mkdir(parents=True, exist_ok=True)
    ua = "WorldCupTriviaGuessWhoFetcher/1.0 (local dev)"
    for title, filename in PAIRS:
        time.sleep(1.2)
        api = "https://en.wikipedia.org/api/rest_v1/page/summary/" + urllib.parse.quote(title, safe="")
        req = urllib.request.Request(api, headers={"User-Agent": ua})
        try:
            with urllib.request.urlopen(req, timeout=25) as r:
                data = json.load(r)
        except Exception as e:
            print(f"API_FAIL {title}: {e}", file=sys.stderr)
            continue
        thumb = (data.get("thumbnail") or {}).get("source")
        if not thumb:
            print(f"NO_THUMB {title}", file=sys.stderr)
            continue
        time.sleep(0.5)
        path = DEST / filename
        try:
            with urllib.request.urlopen(
                urllib.request.Request(thumb, headers={"User-Agent": ua}),
                timeout=30,
            ) as img:
                path.write_bytes(img.read())
        except Exception as e:
            print(f"DL_FAIL {filename}: {e}", file=sys.stderr)
            continue
        print(f"OK {filename}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
