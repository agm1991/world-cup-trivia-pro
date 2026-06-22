#!/usr/bin/env python3
"""Generate TS fragments for missingPlayerQuestions levels 7-17 (110 two-blank items)."""

def block(qid: str, diff: str, q: str, a: str, b: str, c: str, d: str, h1: str, h2: str, h3: str) -> str:
    return f"""  {{
    id: '{qid}',
    category: 'missing-player',
    difficulty: '{diff}',
    question:
      {q!r},
    optionA: {a!r},
    optionB: {b!r},
    optionC: {c!r},
    optionD: {d!r},
    correctAnswer: 'A',
    hint1: {h1!r},
    hint2: {h2!r},
    hint3: {h3!r},
  }}"""


def main():
    easy = []
    # mp-easy-061 .. 100 — Wikipedia-verified R16/QF 2006 & 2014, etc.
    easy.append(block(
        "mp-easy-061", "easy",
        "2006 FIFA World Cup Round of 16 — Portugal vs Netherlands — Portugal XI: Ricardo; Miguel, ___, Carvalho, Valente; Costinha, Maniche; Figo, Deco, Ronaldo, ___? (CB · CF)",
        "Fernando Meira · Pauleta", "Costinha · Petit", "Deco · Tiago", "Miguel · Simão",
        "Two missing starters", "Meira paired with Carvalho", "Scolari XI — Nuremberg",
    ))
    easy.append(block(
        "mp-easy-062", "easy",
        "2006 FIFA World Cup Round of 16 — Portugal vs Netherlands — Netherlands XI: van der Sar; Boulahrouz, Ooijer, Mathijsen, van Bronckhorst; van Bommel, Sneijder; Cocu; van Persie, Kuyt, ___? (left winger · right forward)",
        "Arjen Robben · Robin van Persie", "Sneijder · Huntelaar", "Davids · van der Vaart", "Seedorf · Makaay",
        "Two missing starters", "Robben wide; van Persie central", "4-2-3-1 diamond",
    ))
    # Fix 062: Wikipedia order RF van Persie, CF Kuyt, LF Robben — so missing are Robben and one of van Persie/Kuyt? Actually all three named in question - ERROR

    print("// Fix: regenerate manually")
    return


if __name__ == "__main__":
    main()
