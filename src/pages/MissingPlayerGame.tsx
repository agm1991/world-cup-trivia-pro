import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSafeBack } from '@/hooks/useSafeBack';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Lightbulb, RotateCcw, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { GameOverModal } from '@/components/GameOverModal';
import { SafeDevQuestionNav } from '@/components/SafeDevQuestionNav';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { Category } from '@/types/game';
import { applyQuizCorrectScore, meetsPerfectQuizLevelCompletion, shouldFailQuizLevelAfterWrong } from '@/lib/quizLevelRules';
import { getMissingPlayerLineupQuestionsForLevel1to6 } from '@/data/missingPlayerLineupLevels1to6.frozen';
import { getMissingPlayerLineupQuestionsForLevel } from '@/data/missingPlayerLineupLevels7to17';
import { MissingPlayerFlagIcon } from '@/components/missing-player/MissingPlayerFlagIcon';

interface PlayerPosition {
  name: string;
  flag: string;
  x: number;
  y: number;
}

interface LineupQuestion {
  id: number;
  match: string;
  year: number;
  team: string;
  teamFlag: string;
  team1?: string;
  team2?: string;
  team1Flag?: string;
  team2Flag?: string;
  positions: PlayerPosition[];
  missingIndex: number;
  missingIndex2?: number; // For two-missing-player questions
  missingIndex3?: number; // For three-missing-player questions
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  hint1: string;
  hint2: string;
  hint3: string;
}

const allLineupQuestions: LineupQuestion[] = [
  // LEVEL 1: 2022 World Cup (Questions 1-10)
  {
    id: 1,
    match: "Argentina 🇦🇷 vs France 🇫🇷 - 2022 World Cup Final",
    year: 2022,
    team: "Argentina",
    teamFlag: "🇦🇷",
    positions: [
      { name: "E. Martínez", flag: "🇦🇷", x: 50, y: 90 },
      { name: "Molina", flag: "🇦🇷", x: 84, y: 72 },
      { name: "Romero", flag: "🇦🇷", x: 66, y: 76 },
      { name: "Otamendi", flag: "🇦🇷", x: 34, y: 76 },
      { name: "Tagliafico", flag: "🇦🇷", x: 16, y: 72 },
      { name: "De Paul", flag: "🇦🇷", x: 72, y: 52 },
      { name: "E. Fernández", flag: "🇦🇷", x: 50, y: 46 },
      { name: "Mac Allister", flag: "🇦🇷", x: 28, y: 52 },
      { name: "???", flag: "🇦🇷", x: 78, y: 24 },
      { name: "Álvarez", flag: "🇦🇷", x: 50, y: 12 },
      { name: "Di María", flag: "🇦🇷", x: 22, y: 24 },
    ],
    missingIndex: 8,
    optionA: "Lo Celso",
    optionB: "Paredes",
    optionC: "Messi",
    optionD: "Dybala",
    correctAnswer: 'C',
    hint1: "Captain and right winger",
    hint2: "7-time Ballon d'Or winner",
    hint3: "Finally won his first World Cup"
  },
  {
    id: 2,
    match: "Argentina 🇦🇷 vs France 🇫🇷 - 2022 World Cup Final",
    year: 2022,
    team: "France",
    teamFlag: "🇫🇷",
    positions: [
      { name: "Lloris", flag: "🇫🇷", x: 50, y: 90 },
      { name: "Koundé", flag: "🇫🇷", x: 80, y: 72 },
      { name: "Varane", flag: "🇫🇷", x: 65, y: 75 },
      { name: "Upamecano", flag: "🇫🇷", x: 35, y: 75 },
      { name: "T. Hernández", flag: "🇫🇷", x: 20, y: 72 },
      { name: "Griezmann", flag: "🇫🇷", x: 50, y: 55 },
      { name: "Tchouaméni", flag: "🇫🇷", x: 65, y: 50 },
      { name: "Rabiot", flag: "🇫🇷", x: 35, y: 50 },
      { name: "Dembélé", flag: "🇫🇷", x: 75, y: 30 },
      { name: "Mbappé", flag: "🇫🇷", x: 25, y: 30 },
      { name: "???", flag: "🇫🇷", x: 50, y: 18 },
    ],
    missingIndex: 10,
    optionA: "Benzema",
    optionB: "Giroud",
    optionC: "Thuram",
    optionD: "Kolo Muani",
    correctAnswer: 'B',
    hint1: "Center forward and France's all-time top scorer",
    hint2: "AC Milan striker",
    hint3: "Former Arsenal and Chelsea player"
  },
  {
    id: 3,
    match: "Argentina 🇦🇷 vs Croatia 🇭🇷 - 2022 World Cup Semi-Final",
    year: 2022,
    team: "Argentina",
    teamFlag: "🇦🇷",
    positions: [
      { name: "E. Martínez", flag: "🇦🇷", x: 50, y: 90 },
      { name: "Molina", flag: "🇦🇷", x: 84, y: 72 },
      { name: "Romero", flag: "🇦🇷", x: 66, y: 76 },
      { name: "Otamendi", flag: "🇦🇷", x: 34, y: 76 },
      { name: "Acuña", flag: "🇦🇷", x: 16, y: 72 },
      { name: "De Paul", flag: "🇦🇷", x: 72, y: 52 },
      { name: "E. Fernández", flag: "🇦🇷", x: 50, y: 46 },
      { name: "Mac Allister", flag: "🇦🇷", x: 28, y: 52 },
      { name: "Messi", flag: "🇦🇷", x: 78, y: 24 },
      { name: "Álvarez", flag: "🇦🇷", x: 50, y: 12 },
      { name: "???", flag: "🇦🇷", x: 22, y: 24 },
    ],
    missingIndex: 10,
    optionA: "Di María",
    optionB: "Paredes",
    optionC: "Lo Celso",
    optionD: "Dybala",
    correctAnswer: 'A',
    hint1: "Left winger who scored in the final",
    hint2: "Known as 'Fideo' (Noodle)",
    hint3: "Played for PSG with Messi"
  },
  {
    id: 4,
    match: "France 🇫🇷 vs Morocco 🇲🇦 - 2022 World Cup Semi-Final",
    year: 2022,
    team: "France",
    teamFlag: "🇫🇷",
    positions: [
      { name: "Lloris", flag: "🇫🇷", x: 50, y: 90 },
      { name: "Koundé", flag: "🇫🇷", x: 84, y: 72 },
      { name: "Varane", flag: "🇫🇷", x: 66, y: 76 },
      { name: "Konaté", flag: "🇫🇷", x: 34, y: 76 },
      { name: "T. Hernández", flag: "🇫🇷", x: 16, y: 72 },
      { name: "???", flag: "🇫🇷", x: 68, y: 56 },
      { name: "Fofana", flag: "🇫🇷", x: 32, y: 56 },
      { name: "Mbappé", flag: "🇫🇷", x: 22, y: 24 },
      { name: "Griezmann", flag: "🇫🇷", x: 50, y: 36 },
      { name: "Dembélé", flag: "🇫🇷", x: 78, y: 24 },
      { name: "Giroud", flag: "🇫🇷", x: 50, y: 12 },
    ],
    missingIndex: 5,
    optionA: "Pogba",
    optionB: "Kanté",
    optionC: "Tchouaméni",
    optionD: "Camavinga",
    correctAnswer: 'C',
    hint1: "Young Real Madrid defensive midfielder",
    hint2: "Previously played for Monaco",
    hint3: "Born in 2000"
  },
  {
    id: 5,
    match: "Croatia 🇭🇷 vs Brazil 🇧🇷 - 2022 World Cup Quarter-Final",
    year: 2022,
    team: "Croatia",
    teamFlag: "🇭🇷",
    positions: [
      { name: "Livaković", flag: "🇭🇷", x: 50, y: 90 },
      { name: "Juranović", flag: "🇭🇷", x: 84, y: 72 },
      { name: "Lovren", flag: "🇭🇷", x: 66, y: 76 },
      { name: "Gvardiol", flag: "🇭🇷", x: 34, y: 76 },
      { name: "Sosa", flag: "🇭🇷", x: 16, y: 72 },
      { name: "Brozović", flag: "🇭🇷", x: 50, y: 60 },
      { name: "Modrić", flag: "🇭🇷", x: 28, y: 52 },
      { name: "Kovačić", flag: "🇭🇷", x: 72, y: 52 },
      { name: "Pašalić", flag: "🇭🇷", x: 78, y: 24 },
      { name: "Kramarić", flag: "🇭🇷", x: 50, y: 12 },
      { name: "???", flag: "🇭🇷", x: 22, y: 24 },
    ],
    missingIndex: 10,
    optionA: "Perišić",
    optionB: "Rebić",
    optionC: "Oršić",
    optionD: "Livaja",
    correctAnswer: 'A',
    hint1: "Left winger and Inter Milan player",
    hint2: "Scored in the 2018 final",
    hint3: "Versatile attacking player"
  },
  {
    id: 6,
    match: "Croatia 🇭🇷 vs Brazil 🇧🇷 - 2022 World Cup Quarter-Final",
    year: 2022,
    team: "Brazil",
    teamFlag: "🇧🇷",
    positions: [
      { name: "Alisson", flag: "🇧🇷", x: 50, y: 90 },
      { name: "Danilo", flag: "🇧🇷", x: 80, y: 72 },
      { name: "Thiago Silva", flag: "🇧🇷", x: 65, y: 75 },
      { name: "Marquinhos", flag: "🇧🇷", x: 35, y: 75 },
      { name: "Alex Sandro", flag: "🇧🇷", x: 20, y: 72 },
      { name: "Casemiro", flag: "🇧🇷", x: 50, y: 55 },
      { name: "Paquetá", flag: "🇧🇷", x: 65, y: 50 },
      { name: "???", flag: "🇧🇷", x: 35, y: 50 },
      { name: "Raphinha", flag: "🇧🇷", x: 75, y: 30 },
      { name: "Richarlison", flag: "🇧🇷", x: 50, y: 18 },
      { name: "Vinícius Jr", flag: "🇧🇷", x: 25, y: 30 },
    ],
    missingIndex: 7,
    optionA: "Fred",
    optionB: "Fabinho",
    optionC: "Neymar",
    optionD: "Antony",
    correctAnswer: 'C',
    hint1: "Attacking midfielder and Brazil's number 10",
    hint2: "PSG and Barcelona legend",
    hint3: "Most expensive player in history"
  },
  {
    id: 7,
    match: "Morocco 🇲🇦 vs Spain 🇪🇸 - 2022 World Cup Round of 16",
    year: 2022,
    team: "Morocco",
    teamFlag: "🇲🇦",
    positions: [
      { name: "Bounou", flag: "🇲🇦", x: 50, y: 90 },
      { name: "Mazraoui", flag: "🇲🇦", x: 16, y: 72 },
      { name: "Saïss", flag: "🇲🇦", x: 34, y: 76 },
      { name: "Aguerd", flag: "🇲🇦", x: 66, y: 76 },
      { name: "Hakimi", flag: "🇲🇦", x: 84, y: 72 },
      { name: "Amallah", flag: "🇲🇦", x: 28, y: 48 },
      { name: "Amrabat", flag: "🇲🇦", x: 50, y: 58 },
      { name: "???", flag: "🇲🇦", x: 72, y: 48 },
      { name: "Boufal", flag: "🇲🇦", x: 18, y: 22 },
      { name: "En-Nesyri", flag: "🇲🇦", x: 50, y: 12 },
      { name: "Ziyech", flag: "🇲🇦", x: 82, y: 22 },
    ],
    missingIndex: 7,
    optionA: "Sabiri",
    optionB: "Ounahi",
    optionC: "El Yamiq",
    optionD: "Tissoudali",
    correctAnswer: 'B',
    hint1: "Right central midfielder from Angers in Regragui's 4-3-3",
    hint2: "Started the penalty-shootout win over Spain in Education City",
    hint3: "Amrabat sat deeper between Amallah and Ounahi",
  },
  {
    id: 8,
    match: "Spain 🇪🇸 vs Germany 🇩🇪 - 2022 World Cup Group Stage",
    year: 2022,
    team: "Spain",
    teamFlag: "🇪🇸",
    positions: [
      { name: "Simón", flag: "🇪🇸", x: 50, y: 90 },
      { name: "Azpilicueta", flag: "🇪🇸", x: 84, y: 72 },
      { name: "Rodri", flag: "🇪🇸", x: 66, y: 76 },
      { name: "Laporte", flag: "🇪🇸", x: 34, y: 76 },
      { name: "Alba", flag: "🇪🇸", x: 16, y: 72 },
      { name: "Busquets", flag: "🇪🇸", x: 50, y: 60 },
      { name: "Gavi", flag: "🇪🇸", x: 72, y: 52 },
      { name: "Pedri", flag: "🇪🇸", x: 28, y: 52 },
      { name: "Ferrán Torres", flag: "🇪🇸", x: 78, y: 24 },
      { name: "Morata", flag: "🇪🇸", x: 50, y: 12 },
      { name: "???", flag: "🇪🇸", x: 22, y: 24 },
    ],
    missingIndex: 10,
    optionA: "Asensio",
    optionB: "Olmo",
    optionC: "Sarabia",
    optionD: "Fati",
    correctAnswer: 'B',
    hint1: "Attacking midfielder from RB Leipzig",
    hint2: "Played for Dinamo Zagreb before",
    hint3: "Creative playmaker"
  },
  {
    id: 9,
    match: "Spain 🇪🇸 vs Germany 🇩🇪 - 2022 World Cup Group Stage",
    year: 2022,
    team: "Germany",
    teamFlag: "🇩🇪",
    positions: [
      { name: "Neuer", flag: "🇩🇪", x: 50, y: 90 },
      { name: "Kehrer", flag: "🇩🇪", x: 80, y: 72 },
      { name: "Süle", flag: "🇩🇪", x: 65, y: 75 },
      { name: "Schlotterbeck", flag: "🇩🇪", x: 35, y: 75 },
      { name: "Raum", flag: "🇩🇪", x: 20, y: 72 },
      { name: "Kimmich", flag: "🇩🇪", x: 50, y: 55 },
      { name: "Gündoğan", flag: "🇩🇪", x: 65, y: 50 },
      { name: "???", flag: "🇩🇪", x: 35, y: 50 },
      { name: "Gnabry", flag: "🇩🇪", x: 75, y: 30 },
      { name: "Müller", flag: "🇩🇪", x: 50, y: 18 },
      { name: "Musiala", flag: "🇩🇪", x: 25, y: 30 },
    ],
    missingIndex: 7,
    optionA: "Goretzka",
    optionB: "Hofmann",
    optionC: "Brandt",
    optionD: "Sané",
    correctAnswer: 'A',
    hint1: "Box-to-box midfielder from Bayern Munich",
    hint2: "Strong physical presence",
    hint3: "Part of Bayern's midfield"
  },
  {
    id: 10,
    match: "Portugal 🇵🇹 vs Uruguay 🇺🇾 - 2022 World Cup Group Stage",
    year: 2022,
    team: "Portugal",
    teamFlag: "🇵🇹",
    positions: [
      { name: "Costa", flag: "🇵🇹", x: 50, y: 90 },
      { name: "Cancelo", flag: "🇵🇹", x: 80, y: 72 },
      { name: "Pepe", flag: "🇵🇹", x: 65, y: 75 },
      { name: "Dias", flag: "🇵🇹", x: 35, y: 75 },
      { name: "Guerreiro", flag: "🇵🇹", x: 20, y: 72 },
      { name: "Neves", flag: "🇵🇹", x: 50, y: 55 },
      { name: "???", flag: "🇵🇹", x: 65, y: 50 },
      { name: "B. Silva", flag: "🇵🇹", x: 35, y: 50 },
      { name: "Félix", flag: "🇵🇹", x: 75, y: 30 },
      { name: "Ronaldo", flag: "🇵🇹", x: 50, y: 18 },
      { name: "Leão", flag: "🇵🇹", x: 25, y: 30 },
    ],
    missingIndex: 6,
    optionA: "Carvalho",
    optionB: "Palhinha",
    optionC: "Fernandes",
    optionD: "Vitinha",
    correctAnswer: 'C',
    hint1: "Attacking midfielder from Manchester United",
    hint2: "Known for his creativity and assists",
    hint3: "Portuguese playmaker"
  },
  // LEVEL 2: 2018 World Cup (Questions 11-20)
  {
    id: 11,
    match: "France 🇫🇷 vs Croatia 🇭🇷 - 2018 World Cup Final",
    year: 2018,
    team: "France",
    teamFlag: "🇫🇷",
    positions: [
      { name: "Lloris", flag: "🇫🇷", x: 50, y: 90 },
      { name: "Pavard", flag: "🇫🇷", x: 84, y: 72 },
      { name: "Varane", flag: "🇫🇷", x: 66, y: 76 },
      { name: "Umtiti", flag: "🇫🇷", x: 34, y: 76 },
      { name: "Hernández", flag: "🇫🇷", x: 16, y: 72 },
      { name: "Kanté", flag: "🇫🇷", x: 68, y: 56 },
      { name: "Pogba", flag: "🇫🇷", x: 32, y: 56 },
      { name: "Matuidi", flag: "🇫🇷", x: 22, y: 38 },
      { name: "Griezmann", flag: "🇫🇷", x: 50, y: 36 },
      { name: "???", flag: "🇫🇷", x: 78, y: 24 },
      { name: "Giroud", flag: "🇫🇷", x: 50, y: 12 },
    ],
    missingIndex: 9,
    optionA: "Coman",
    optionB: "Mbappé",
    optionC: "Dembélé",
    optionD: "Fekir",
    correctAnswer: 'B',
    hint1: "Right winger who scored twice in the final",
    hint2: "Youngest French scorer in a World Cup final",
    hint3: "Now plays for Real Madrid"
  },
  {
    id: 12,
    match: "France 🇫🇷 vs Croatia 🇭🇷 - 2018 World Cup Final",
    year: 2018,
    team: "Croatia",
    teamFlag: "🇭🇷",
    positions: [
      { name: "Subašić", flag: "🇭🇷", x: 50, y: 90 },
      { name: "Vrsaljko", flag: "🇭🇷", x: 80, y: 72 },
      { name: "Lovren", flag: "🇭🇷", x: 65, y: 75 },
      { name: "Vida", flag: "🇭🇷", x: 35, y: 75 },
      { name: "Strinić", flag: "🇭🇷", x: 20, y: 72 },
      { name: "Rakitić", flag: "🇭🇷", x: 65, y: 55 },
      { name: "Brozović", flag: "🇭🇷", x: 35, y: 55 },
      { name: "Rebić", flag: "🇭🇷", x: 75, y: 30 },
      { name: "Mandžukić", flag: "🇭🇷", x: 50, y: 18 },
      { name: "Perišić", flag: "🇭🇷", x: 25, y: 30 },
      { name: "???", flag: "🇭🇷", x: 50, y: 42 },
    ],
    missingIndex: 10,
    optionA: "Kovačić",
    optionB: "Modrić",
    optionC: "Kramarić",
    optionD: "Badelj",
    correctAnswer: 'B',
    hint1: "Central attacking midfielder and captain",
    hint2: "Won the Golden Ball as best player",
    hint3: "Real Madrid legend"
  },
  {
    id: 13,
    match: "England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs Croatia 🇭🇷 - 2018 World Cup Semi-Final",
    year: 2018,
    team: "England",
    teamFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    positions: [
      { name: "Pickford", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 50, y: 90 },
      { name: "Walker", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 72, y: 76 },
      { name: "Stones", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 50, y: 76 },
      { name: "Maguire", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 28, y: 76 },
      { name: "Trippier", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 88, y: 46 },
      { name: "Henderson", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 50, y: 56 },
      { name: "Alli", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 62, y: 38 },
      { name: "???", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 38, y: 38 },
      { name: "Young", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 12, y: 46 },
      { name: "Sterling", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 38, y: 12 },
      { name: "Kane", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 62, y: 12 },
    ],
    missingIndex: 7,
    optionA: "Lingard",
    optionB: "Dier",
    optionC: "Rashford",
    optionD: "Welbeck",
    correctAnswer: 'A',
    hint1: "Left central midfielder from Manchester United in Southgate's 3-5-2",
    hint2: "Started the Moscow semi-final alongside Dele Alli",
    hint3: "Young and Trippier provided the width as wing-backs",
  },
  {
    id: 14,
    match: "France 🇫🇷 vs Belgium 🇧🇪 - 2018 World Cup Semi-Final",
    year: 2018,
    team: "Belgium",
    teamFlag: "🇧🇪",
    positions: [
      { name: "Courtois", flag: "🇧🇪", x: 50, y: 90 },
      { name: "Alderweireld", flag: "🇧🇪", x: 70, y: 75 },
      { name: "Kompany", flag: "🇧🇪", x: 50, y: 75 },
      { name: "Vertonghen", flag: "🇧🇪", x: 30, y: 75 },
      { name: "Meunier", flag: "🇧🇪", x: 80, y: 72 },
      { name: "Witsel", flag: "🇧🇪", x: 50, y: 55 },
      { name: "De Bruyne", flag: "🇧🇪", x: 65, y: 50 },
      { name: "Fellaini", flag: "🇧🇪", x: 35, y: 50 },
      { name: "Chadli", flag: "🇧🇪", x: 75, y: 30 },
      { name: "Lukaku", flag: "🇧🇪", x: 50, y: 18 },
      { name: "???", flag: "🇧🇪", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Hazard",
    optionB: "Mertens",
    optionC: "Carrasco",
    optionD: "Tielemans",
    correctAnswer: 'A',
    hint1: "Left winger and Belgium's captain",
    hint2: "Chelsea and Real Madrid legend",
    hint3: "Creative playmaker"
  },
  {
    id: 15,
    match: "Brazil 🇧🇷 vs Belgium 🇧🇪 - 2018 World Cup Quarter-Final",
    year: 2018,
    team: "Brazil",
    teamFlag: "🇧🇷",
    positions: [
      { name: "Alisson", flag: "🇧🇷", x: 50, y: 90 },
      { name: "Fagner", flag: "🇧🇷", x: 84, y: 72 },
      { name: "Thiago Silva", flag: "🇧🇷", x: 66, y: 76 },
      { name: "Miranda", flag: "🇧🇷", x: 34, y: 76 },
      { name: "Marcelo", flag: "🇧🇷", x: 16, y: 72 },
      { name: "Casemiro", flag: "🇧🇷", x: 50, y: 60 },
      { name: "Paulinho", flag: "🇧🇷", x: 72, y: 52 },
      { name: "???", flag: "🇧🇷", x: 28, y: 52 },
      { name: "Willian", flag: "🇧🇷", x: 78, y: 24 },
      { name: "Firmino", flag: "🇧🇷", x: 50, y: 12 },
      { name: "Neymar", flag: "🇧🇷", x: 22, y: 24 },
    ],
    missingIndex: 7,
    optionA: "Coutinho",
    optionB: "Fernandinho",
    optionC: "Augusto",
    optionD: "Fred",
    correctAnswer: 'A',
    hint1: "Attacking midfielder from Barcelona",
    hint2: "Former Liverpool player",
    hint3: "Creative playmaker"
  },
  {
    id: 16,
    match: "Uruguay 🇺🇾 vs France 🇫🇷 - 2018 World Cup Quarter-Final",
    year: 2018,
    team: "Uruguay",
    teamFlag: "🇺🇾",
    positions: [
      { name: "Muslera", flag: "🇺🇾", x: 50, y: 90 },
      { name: "Cáceres", flag: "🇺🇾", x: 84, y: 72 },
      { name: "Godín", flag: "🇺🇾", x: 66, y: 76 },
      { name: "Giménez", flag: "🇺🇾", x: 34, y: 76 },
      { name: "Laxalt", flag: "🇺🇾", x: 16, y: 72 },
      { name: "Bentancur", flag: "🇺🇾", x: 50, y: 60 },
      { name: "Vecino", flag: "🇺🇾", x: 72, y: 52 },
      { name: "Torreira", flag: "🇺🇾", x: 28, y: 52 },
      { name: "Cavani", flag: "🇺🇾", x: 78, y: 24 },
      { name: "???", flag: "🇺🇾", x: 50, y: 12 },
      { name: "Stuani", flag: "🇺🇾", x: 22, y: 24 },
    ],
    missingIndex: 9,
    optionA: "Suárez",
    optionB: "Rodríguez",
    optionC: "Pereira",
    optionD: "Nández",
    correctAnswer: 'A',
    hint1: "Striker and Uruguay's all-time top scorer",
    hint2: "Barcelona and Liverpool legend",
    hint3: "Known for his finishing"
  },
  {
    id: 17,
    match: "Spain 🇪🇸 vs Russia 🇷🇺 - 2018 World Cup Round of 16",
    year: 2018,
    team: "Spain",
    teamFlag: "🇪🇸",
    positions: [
      { name: "De Gea", flag: "🇪🇸", x: 50, y: 90 },
      { name: "Nacho", flag: "🇪🇸", x: 84, y: 72 },
      { name: "Piqué", flag: "🇪🇸", x: 66, y: 76 },
      { name: "Ramos", flag: "🇪🇸", x: 34, y: 76 },
      { name: "Alba", flag: "🇪🇸", x: 16, y: 72 },
      { name: "Koke", flag: "🇪🇸", x: 68, y: 56 },
      { name: "Busquets", flag: "🇪🇸", x: 32, y: 56 },
      { name: "Silva", flag: "🇪🇸", x: 78, y: 24 },
      { name: "Isco", flag: "🇪🇸", x: 50, y: 36 },
      { name: "Asensio", flag: "🇪🇸", x: 22, y: 24 },
      { name: "???", flag: "🇪🇸", x: 50, y: 12 },
    ],
    missingIndex: 10,
    optionA: "Costa",
    optionB: "Morata",
    optionC: "Aspas",
    optionD: "Rodrigo",
    correctAnswer: 'A',
    hint1: "Striker from Atlético Madrid",
    hint2: "Former Chelsea player",
    hint3: "Physical center forward"
  },
  {
    id: 18,
    match: "Germany 🇩🇪 vs South Korea 🇰🇷 - 2018 World Cup Group Stage",
    year: 2018,
    team: "Germany",
    teamFlag: "🇩🇪",
    positions: [
      { name: "Neuer", flag: "🇩🇪", x: 50, y: 90 },
      { name: "Kimmich", flag: "🇩🇪", x: 84, y: 72 },
      { name: "Hummels", flag: "🇩🇪", x: 66, y: 76 },
      { name: "Süle", flag: "🇩🇪", x: 34, y: 76 },
      { name: "Hector", flag: "🇩🇪", x: 16, y: 72 },
      { name: "Khedira", flag: "🇩🇪", x: 68, y: 56 },
      { name: "Kroos", flag: "🇩🇪", x: 32, y: 56 },
      { name: "???", flag: "🇩🇪", x: 78, y: 24 },
      { name: "Özil", flag: "🇩🇪", x: 50, y: 36 },
      { name: "Reus", flag: "🇩🇪", x: 22, y: 24 },
      { name: "Werner", flag: "🇩🇪", x: 50, y: 12 },
    ],
    missingIndex: 7,
    optionA: "Gündoğan",
    optionB: "Goretzka",
    optionC: "Rudy",
    optionD: "Draxler",
    correctAnswer: 'B',
    hint1: "Right winger from Bayern Munich",
    hint2: "Started in Kazan as Germany crashed out",
    hint3: "Müller came off the bench at 63'"
  },
  {
    id: 19,
    match: "Argentina 🇦🇷 vs France 🇫🇷 - 2018 World Cup Group Stage",
    year: 2018,
    team: "Argentina",
    teamFlag: "🇦🇷",
    positions: [
      { name: "Caballero", flag: "🇦🇷", x: 50, y: 90 },
      { name: "Mercado", flag: "🇦🇷", x: 84, y: 72 },
      { name: "Otamendi", flag: "🇦🇷", x: 66, y: 76 },
      { name: "Rojo", flag: "🇦🇷", x: 34, y: 76 },
      { name: "Tagliafico", flag: "🇦🇷", x: 16, y: 72 },
      { name: "Mascherano", flag: "🇦🇷", x: 50, y: 60 },
      { name: "Biglia", flag: "🇦🇷", x: 72, y: 52 },
      { name: "Messi", flag: "🇦🇷", x: 50, y: 36 },
      { name: "Di María", flag: "🇦🇷", x: 78, y: 24 },
      { name: "Agüero", flag: "🇦🇷", x: 50, y: 12 },
      { name: "???", flag: "🇦🇷", x: 22, y: 24 },
    ],
    missingIndex: 10,
    optionA: "Pavón",
    optionB: "Higuaín",
    optionC: "Dybala",
    optionD: "Meza",
    correctAnswer: 'A',
    hint1: "Right winger from Boca Juniors",
    hint2: "Young attacking player",
    hint3: "Provided width on the right"
  },
  {
    id: 20,
    match: "Portugal 🇵🇹 vs Spain 🇪🇸 - 2018 World Cup Group Stage",
    year: 2018,
    team: "Portugal",
    teamFlag: "🇵🇹",
    positions: [
      { name: "Patrício", flag: "🇵🇹", x: 50, y: 90 },
      { name: "Cedric", flag: "🇵🇹", x: 84, y: 72 },
      { name: "Pepe", flag: "🇵🇹", x: 66, y: 76 },
      { name: "Fonte", flag: "🇵🇹", x: 34, y: 76 },
      { name: "Guerreiro", flag: "🇵🇹", x: 16, y: 72 },
      { name: "William", flag: "🇵🇹", x: 38, y: 56 },
      { name: "Moutinho", flag: "🇵🇹", x: 62, y: 56 },
      { name: "B. Silva", flag: "🇵🇹", x: 78, y: 24 },
      { name: "Guedes", flag: "🇵🇹", x: 50, y: 36 },
      { name: "???", flag: "🇵🇹", x: 22, y: 24 },
      { name: "Ronaldo", flag: "🇵🇹", x: 50, y: 12 },
    ],
    missingIndex: 9,
    optionA: "Quaresma",
    optionB: "André Silva",
    optionC: "Fernandes",
    optionD: "Mário",
    correctAnswer: 'C',
    hint1: "Left winger who later joined Manchester United",
    hint2: "Started in Fernando Santos's 4-3-3 in Sochi",
    hint3: "Quaresma came off the bench at 69'"
  },
  // LEVEL 3: 2014 World Cup (Questions 21-30)
  {
    id: 21,
    match: "Germany 🇩🇪 vs Argentina 🇦🇷 - 2014 World Cup Final",
    year: 2014,
    team: "Germany",
    teamFlag: "🇩🇪",
    positions: [
      { name: "Neuer", flag: "🇩🇪", x: 50, y: 90 },
      { name: "Lahm", flag: "🇩🇪", x: 84, y: 72 },
      { name: "Boateng", flag: "🇩🇪", x: 66, y: 76 },
      { name: "Hummels", flag: "🇩🇪", x: 34, y: 76 },
      { name: "Höwedes", flag: "🇩🇪", x: 16, y: 72 },
      { name: "Schweinsteiger", flag: "🇩🇪", x: 68, y: 56 },
      { name: "Kroos", flag: "🇩🇪", x: 32, y: 56 },
      { name: "Müller", flag: "🇩🇪", x: 78, y: 24 },
      { name: "Kramer", flag: "🇩🇪", x: 50, y: 36 },
      { name: "Özil", flag: "🇩🇪", x: 22, y: 24 },
      { name: "???", flag: "🇩🇪", x: 50, y: 12 },
    ],
    missingIndex: 10,
    optionA: "Götze",
    optionB: "Schürrle",
    optionC: "Klose",
    optionD: "Podolski",
    correctAnswer: 'C',
    hint1: "Center forward and all-time World Cup top scorer",
    hint2: "Scored 16 World Cup goals total",
    hint3: "Broke Ronaldo's record in this tournament"
  },
  {
    id: 22,
    match: "Germany 🇩🇪 vs Argentina 🇦🇷 - 2014 World Cup Final",
    year: 2014,
    team: "Argentina",
    teamFlag: "🇦🇷",
    positions: [
      { name: "Romero", flag: "🇦🇷", x: 50, y: 90 },
      { name: "Zabaleta", flag: "🇦🇷", x: 80, y: 72 },
      { name: "Demichelis", flag: "🇦🇷", x: 65, y: 75 },
      { name: "Garay", flag: "🇦🇷", x: 35, y: 75 },
      { name: "Rojo", flag: "🇦🇷", x: 20, y: 72 },
      { name: "Biglia", flag: "🇦🇷", x: 65, y: 55 },
      { name: "Mascherano", flag: "🇦🇷", x: 35, y: 55 },
      { name: "Lavezzi", flag: "🇦🇷", x: 75, y: 30 },
      { name: "Messi", flag: "🇦🇷", x: 50, y: 42 },
      { name: "Pérez", flag: "🇦🇷", x: 25, y: 30 },
      { name: "???", flag: "🇦🇷", x: 50, y: 18 },
    ],
    missingIndex: 10,
    optionA: "Di María",
    optionB: "Agüero",
    optionC: "Higuaín",
    optionD: "Palacio",
    correctAnswer: 'C',
    hint1: "Center forward who started the final",
    hint2: "Played for Napoli and Juventus",
    hint3: "Missed a key chance in the final"
  },
  {
    id: 23,
    match: "Brazil 🇧🇷 vs Germany 🇩🇪 - 2014 World Cup Semi-Final",
    year: 2014,
    team: "Brazil",
    teamFlag: "🇧🇷",
    positions: [
      { name: "Júlio César", flag: "🇧🇷", x: 50, y: 90 },
      { name: "Maicon", flag: "🇧🇷", x: 84, y: 72 },
      { name: "Dante", flag: "🇧🇷", x: 66, y: 76 },
      { name: "David Luiz", flag: "🇧🇷", x: 34, y: 76 },
      { name: "Marcelo", flag: "🇧🇷", x: 16, y: 72 },
      { name: "Fernandinho", flag: "🇧🇷", x: 68, y: 56 },
      { name: "Luiz Gustavo", flag: "🇧🇷", x: 32, y: 56 },
      { name: "???", flag: "🇧🇷", x: 78, y: 24 },
      { name: "Oscar", flag: "🇧🇷", x: 50, y: 36 },
      { name: "Bernard", flag: "🇧🇷", x: 22, y: 24 },
      { name: "Fred", flag: "🇧🇷", x: 50, y: 12 },
    ],
    missingIndex: 7,
    optionA: "Hulk",
    optionB: "Bernard",
    optionC: "Jô",
    optionD: "Ramires",
    correctAnswer: 'A',
    hint1: "Right winger from Zenit",
    hint2: "Physical and powerful player",
    hint3: "Known for his strength"
  },
  {
    id: 24,
    match: "Netherlands 🇳🇱 vs Argentina 🇦🇷 - 2014 World Cup Semi-Final",
    year: 2014,
    team: "Netherlands",
    teamFlag: "🇳🇱",
    positions: [
      { name: "Cillessen", flag: "🇳🇱", x: 50, y: 90 },
      { name: "???", flag: "🇳🇱", x: 88, y: 48 },
      { name: "De Vrij", flag: "🇳🇱", x: 74, y: 72 },
      { name: "Vlaar", flag: "🇳🇱", x: 50, y: 72 },
      { name: "Martins Indi", flag: "🇳🇱", x: 26, y: 72 },
      { name: "Blind", flag: "🇳🇱", x: 12, y: 48 },
      { name: "De Jong", flag: "🇳🇱", x: 50, y: 54 },
      { name: "Wijnaldum", flag: "🇳🇱", x: 68, y: 52 },
      { name: "Sneijder", flag: "🇳🇱", x: 32, y: 52 },
      { name: "Robben", flag: "🇳🇱", x: 78, y: 24 },
      { name: "van Persie", flag: "🇳🇱", x: 50, y: 12 },
    ],
    missingIndex: 1,
    optionA: "Sneijder",
    optionB: "Kuyt",
    optionC: "Depay",
    optionD: "Huntelaar",
    correctAnswer: 'B',
    hint1: "Right wing-back and Liverpool legend",
    hint2: "Versatile player who played multiple positions",
    hint3: "Known for his work rate"
  },
  {
    id: 25,
    match: "Colombia 🇨🇴 vs Brazil 🇧🇷 - 2014 World Cup Quarter-Final",
    year: 2014,
    team: "Colombia",
    teamFlag: "🇨🇴",
    positions: [
      { name: "Ospina", flag: "🇨🇴", x: 50, y: 90 },
      { name: "Zúñiga", flag: "🇨🇴", x: 84, y: 72 },
      { name: "Zapata", flag: "🇨🇴", x: 66, y: 76 },
      { name: "Yepes", flag: "🇨🇴", x: 34, y: 76 },
      { name: "Armero", flag: "🇨🇴", x: 16, y: 72 },
      { name: "Cuadrado", flag: "🇨🇴", x: 80, y: 40 },
      { name: "Guarín", flag: "🇨🇴", x: 60, y: 48 },
      { name: "Sánchez", flag: "🇨🇴", x: 36, y: 48 },
      { name: "Ibarbo", flag: "🇨🇴", x: 18, y: 40 },
      { name: "???", flag: "🇨🇴", x: 36, y: 12 },
      { name: "James", flag: "🇨🇴", x: 64, y: 12 },
    ],
    missingIndex: 9,
    optionA: "Gutiérrez",
    optionB: "Bacca",
    optionC: "Ibarbo",
    optionD: "James",
    correctAnswer: 'A',
    hint1: "Striker who partnered James Rodríguez up front",
    hint2: "Played for River Plate and Racing Club",
    hint3: "Started the quarter-final before Bacca came on",
  },
  {
    id: 26,
    match: "Belgium 🇧🇪 vs Argentina 🇦🇷 - 2014 World Cup Quarter-Final",
    year: 2014,
    team: "Belgium",
    teamFlag: "🇧🇪",
    positions: [
      { name: "Courtois", flag: "🇧🇪", x: 50, y: 90 },
      { name: "Alderweireld", flag: "🇧🇪", x: 74, y: 72 },
      { name: "Van Buyten", flag: "🇧🇪", x: 50, y: 72 },
      { name: "Kompany", flag: "🇧🇪", x: 26, y: 72 },
      { name: "Vertonghen", flag: "🇧🇪", x: 50, y: 54 },
      { name: "Witsel", flag: "🇧🇪", x: 72, y: 52 },
      { name: "Fellaini", flag: "🇧🇪", x: 26, y: 52 },
      { name: "Mirallas", flag: "🇧🇪", x: 22, y: 32 },
      { name: "De Bruyne", flag: "🇧🇪", x: 72, y: 32 },
      { name: "Hazard", flag: "🇧🇪", x: 50, y: 12 },
      { name: "???", flag: "🇧🇪", x: 88, y: 22 },
    ],
    missingIndex: 10,
    optionA: "Meunier",
    optionB: "Chadli",
    optionC: "Origi",
    optionD: "Lukaku",
    correctAnswer: 'C',
    hint1: "Young striker who started the quarter-final",
    hint2: "Later played for Liverpool and AC Milan",
    hint3: "Partnered Hazard and De Bruyne in attack",
  },
  {
    id: 27,
    match: "France 🇫🇷 vs Nigeria 🇳🇬 - 2014 World Cup Round of 16",
    year: 2014,
    team: "France",
    teamFlag: "🇫🇷",
    positions: [
      { name: "Lloris", flag: "🇫🇷", x: 50, y: 90 },
      { name: "Debuchy", flag: "🇫🇷", x: 80, y: 72 },
      { name: "Varane", flag: "🇫🇷", x: 65, y: 75 },
      { name: "Koscielny", flag: "🇫🇷", x: 35, y: 75 },
      { name: "Evra", flag: "🇫🇷", x: 20, y: 72 },
      { name: "Matuidi", flag: "🇫🇷", x: 50, y: 55 },
      { name: "Cabaye", flag: "🇫🇷", x: 65, y: 50 },
      { name: "Pogba", flag: "🇫🇷", x: 35, y: 50 },
      { name: "Valbuena", flag: "🇫🇷", x: 75, y: 30 },
      { name: "Benzema", flag: "🇫🇷", x: 50, y: 18 },
      { name: "???", flag: "🇫🇷", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Griezmann",
    optionB: "Giroud",
    optionC: "Rémy",
    optionD: "Sissoko",
    correctAnswer: 'A',
    hint1: "Left winger from Atlético Madrid",
    hint2: "Later became France's key player",
    hint3: "Creative attacking player"
  },
  {
    id: 28,
    match: "Spain 🇪🇸 vs Netherlands 🇳🇱 - 2014 World Cup Group Stage",
    year: 2014,
    team: "Spain",
    teamFlag: "🇪🇸",
    positions: [
      { name: "Casillas", flag: "🇪🇸", x: 50, y: 90 },
      { name: "Azpilicueta", flag: "🇪🇸", x: 80, y: 72 },
      { name: "Piqué", flag: "🇪🇸", x: 65, y: 75 },
      { name: "Ramos", flag: "🇪🇸", x: 35, y: 75 },
      { name: "Alba", flag: "🇪🇸", x: 20, y: 72 },
      { name: "Busquets", flag: "🇪🇸", x: 50, y: 55 },
      { name: "Xavi", flag: "🇪🇸", x: 65, y: 50 },
      { name: "Iniesta", flag: "🇪🇸", x: 35, y: 50 },
      { name: "Pedro", flag: "🇪🇸", x: 75, y: 30 },
      { name: "Costa", flag: "🇪🇸", x: 50, y: 18 },
      { name: "???", flag: "🇪🇸", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Silva",
    optionB: "Fàbregas",
    optionC: "Torres",
    optionD: "Mata",
    correctAnswer: 'A',
    hint1: "Attacking midfielder from Manchester City",
    hint2: "Creative playmaker",
    hint3: "Former Valencia player"
  },
  {
    id: 29,
    match: "Italy 🇮🇹 vs Uruguay 🇺🇾 - 2014 World Cup Group Stage",
    year: 2014,
    team: "Italy",
    teamFlag: "🇮🇹",
    positions: [
      { name: "Buffon", flag: "🇮🇹", x: 50, y: 90 },
      { name: "Abate", flag: "🇮🇹", x: 80, y: 72 },
      { name: "Barzagli", flag: "🇮🇹", x: 65, y: 75 },
      { name: "Chiellini", flag: "🇮🇹", x: 35, y: 75 },
      { name: "De Sciglio", flag: "🇮🇹", x: 20, y: 72 },
      { name: "De Rossi", flag: "🇮🇹", x: 50, y: 55 },
      { name: "Pirlo", flag: "🇮🇹", x: 65, y: 50 },
      { name: "Verratti", flag: "🇮🇹", x: 35, y: 50 },
      { name: "Candreva", flag: "🇮🇹", x: 75, y: 30 },
      { name: "Balotelli", flag: "🇮🇹", x: 50, y: 18 },
      { name: "???", flag: "🇮🇹", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Immobile",
    optionB: "Insigne",
    optionC: "Cassano",
    optionD: "Cerci",
    correctAnswer: 'B',
    hint1: "Left winger from Napoli",
    hint2: "Small and agile player",
    hint3: "Creative attacking player"
  },
  {
    id: 30,
    match: "England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs Uruguay 🇺🇾 - 2014 World Cup Group Stage",
    year: 2014,
    team: "England",
    teamFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    positions: [
      { name: "Hart", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 50, y: 90 },
      { name: "Johnson", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 80, y: 72 },
      { name: "Cahill", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 65, y: 75 },
      { name: "Jagielka", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 35, y: 75 },
      { name: "Baines", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 20, y: 72 },
      { name: "Gerrard", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 50, y: 55 },
      { name: "Henderson", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 65, y: 50 },
      { name: "Sterling", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 75, y: 30 },
      { name: "Rooney", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 50, y: 42 },
      { name: "Sturridge", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 50, y: 18 },
      { name: "???", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Welbeck",
    optionB: "Lallana",
    optionC: "Barkley",
    optionD: "Wilshere",
    correctAnswer: 'A',
    hint1: "Left winger from Arsenal",
    hint2: "Versatile forward",
    hint3: "Known for his work rate"
  },
  // LEVEL 4: 2010 World Cup (Questions 31-50)
  {
    id: 31,
    match: "Spain 🇪🇸 vs Netherlands 🇳🇱 - 2010 World Cup Final",
    year: 2010,
    team: "Spain",
    teamFlag: "🇪🇸",
    positions: [
      { name: "Casillas", flag: "🇪🇸", x: 50, y: 90 },
      { name: "Sergio Ramos", flag: "🇪🇸", x: 84, y: 72 },
      { name: "Piqué", flag: "🇪🇸", x: 66, y: 76 },
      { name: "Puyol", flag: "🇪🇸", x: 34, y: 76 },
      { name: "Capdevila", flag: "🇪🇸", x: 16, y: 72 },
      { name: "Busquets", flag: "🇪🇸", x: 68, y: 56 },
      { name: "Xabi Alonso", flag: "🇪🇸", x: 32, y: 56 },
      { name: "Xavi", flag: "🇪🇸", x: 50, y: 46 },
      { name: "???", flag: "🇪🇸", x: 78, y: 24 },
      { name: "Pedro", flag: "🇪🇸", x: 22, y: 24 },
      { name: "Villa", flag: "🇪🇸", x: 50, y: 12 },
    ],
    missingIndex: 8,
    optionA: "Silva",
    optionB: "Iniesta",
    optionC: "Fàbregas",
    optionD: "Torres",
    correctAnswer: 'B',
    hint1: "Right winger who scored the winning goal in extra time",
    hint2: "Barcelona legend from La Masia",
    hint3: "Man of the Match in the final"
  },
  {
    id: 32,
    match: "Spain 🇪🇸 vs Netherlands 🇳🇱 - 2010 World Cup Final",
    year: 2010,
    team: "Netherlands",
    teamFlag: "🇳🇱",
    positions: [
      { name: "Stekelenburg", flag: "🇳🇱", x: 50, y: 90 },
      { name: "van der Wiel", flag: "🇳🇱", x: 84, y: 72 },
      { name: "Heitinga", flag: "🇳🇱", x: 66, y: 76 },
      { name: "Mathijsen", flag: "🇳🇱", x: 34, y: 76 },
      { name: "van Bronckhorst", flag: "🇳🇱", x: 16, y: 72 },
      { name: "van Bommel", flag: "🇳🇱", x: 68, y: 56 },
      { name: "de Jong", flag: "🇳🇱", x: 32, y: 56 },
      { name: "Robben", flag: "🇳🇱", x: 78, y: 24 },
      { name: "???", flag: "🇳🇱", x: 50, y: 36 },
      { name: "Kuyt", flag: "🇳🇱", x: 22, y: 24 },
      { name: "van Persie", flag: "🇳🇱", x: 50, y: 12 },
    ],
    missingIndex: 8,
    optionA: "Huntelaar",
    optionB: "Sneijder",
    optionC: "Elia",
    optionD: "Afellay",
    correctAnswer: 'B',
    hint1: "Central attacking midfielder",
    hint2: "Played for Inter Milan and Real Madrid",
    hint3: "Top scorer of the tournament"
  },
  {
    id: 33,
    match: "Germany 🇩🇪 vs Spain 🇪🇸 - 2010 World Cup Semi-Final",
    year: 2010,
    team: "Germany",
    teamFlag: "🇩🇪",
    positions: [
      { name: "Neuer", flag: "🇩🇪", x: 50, y: 90 },
      { name: "Lahm", flag: "🇩🇪", x: 84, y: 72 },
      { name: "Friedrich", flag: "🇩🇪", x: 66, y: 76 },
      { name: "Mertesacker", flag: "🇩🇪", x: 34, y: 76 },
      { name: "Boateng", flag: "🇩🇪", x: 16, y: 72 },
      { name: "Khedira", flag: "🇩🇪", x: 68, y: 56 },
      { name: "Schweinsteiger", flag: "🇩🇪", x: 32, y: 56 },
      { name: "Trochowski", flag: "🇩🇪", x: 78, y: 24 },
      { name: "Özil", flag: "🇩🇪", x: 50, y: 36 },
      { name: "???", flag: "🇩🇪", x: 22, y: 24 },
      { name: "Klose", flag: "🇩🇪", x: 50, y: 12 },
    ],
    missingIndex: 9,
    optionA: "Podolski",
    optionB: "Klose",
    optionC: "Gómez",
    optionD: "Cacau",
    correctAnswer: 'A',
    hint1: "Left winger from Köln",
    hint2: "Former Bayern Munich player",
    hint3: "Versatile attacking player"
  },
  {
    id: 34,
    match: "Uruguay 🇺🇾 vs Ghana 🇬🇭 - 2010 World Cup Quarter-Final",
    year: 2010,
    team: "Uruguay",
    teamFlag: "🇺🇾",
    positions: [
      { name: "Muslera", flag: "🇺🇾", x: 50, y: 90 },
      { name: "Pereira", flag: "🇺🇾", x: 84, y: 72 },
      { name: "Lugano", flag: "🇺🇾", x: 66, y: 76 },
      { name: "Victorino", flag: "🇺🇾", x: 34, y: 76 },
      { name: "Fucile", flag: "🇺🇾", x: 16, y: 72 },
      { name: "???", flag: "🇺🇾", x: 78, y: 38 },
      { name: "Pérez", flag: "🇺🇾", x: 42, y: 50 },
      { name: "Arévalo", flag: "🇺🇾", x: 58, y: 50 },
      { name: "Cavani", flag: "🇺🇾", x: 22, y: 38 },
      { name: "Suárez", flag: "🇺🇾", x: 40, y: 12 },
      { name: "Forlán", flag: "🇺🇾", x: 60, y: 12 },
    ],
    missingIndex: 5,
    optionA: "Fernández",
    optionB: "Gargano",
    optionC: "González",
    optionD: "Lodeiro",
    correctAnswer: 'A',
    hint1: "Right midfielder from Unión San José",
    hint2: "Provided width on the right flank",
    hint3: "Started before Nicolás Lodeiro replaced him",
  },
  {
    id: 35,
    match: "Brazil 🇧🇷 vs Chile 🇨🇱 - 2010 World Cup Round of 16",
    year: 2010,
    team: "Brazil",
    teamFlag: "🇧🇷",
    positions: [
      { name: "Júlio César", flag: "🇧🇷", x: 50, y: 90 },
      { name: "Maicon", flag: "🇧🇷", x: 84, y: 72 },
      { name: "Lúcio", flag: "🇧🇷", x: 66, y: 76 },
      { name: "Juan", flag: "🇧🇷", x: 34, y: 76 },
      { name: "Bastos", flag: "🇧🇷", x: 16, y: 72 },
      { name: "Gilberto Silva", flag: "🇧🇷", x: 50, y: 60 },
      { name: "Dani Alves", flag: "🇧🇷", x: 78, y: 38 },
      { name: "Ramires", flag: "🇧🇷", x: 22, y: 38 },
      { name: "???", flag: "🇧🇷", x: 50, y: 34 },
      { name: "Robinho", flag: "🇧🇷", x: 38, y: 16 },
      { name: "Luis Fabiano", flag: "🇧🇷", x: 58, y: 12 },
    ],
    missingIndex: 8,
    optionA: "Kaká",
    optionB: "Elano",
    optionC: "Meló",
    optionD: "Nilmar",
    correctAnswer: 'A',
    hint1: "Attacking midfielder and Brazil's number 10",
    hint2: "Set up Luis Fabiano's second goal in Johannesburg",
    hint3: "2007 Ballon d'Or winner"
  },
  {
    id: 36,
    match: "Argentina 🇦🇷 vs Greece 🇬🇷 - 2010 World Cup Group Stage",
    year: 2010,
    team: "Argentina",
    teamFlag: "🇦🇷",
    positions: [
      { name: "Romero", flag: "🇦🇷", x: 50, y: 90 },
      { name: "Burdisso", flag: "🇦🇷", x: 84, y: 72 },
      { name: "Demichelis", flag: "🇦🇷", x: 66, y: 76 },
      { name: "Otamendi", flag: "🇦🇷", x: 34, y: 76 },
      { name: "C. Rodríguez", flag: "🇦🇷", x: 16, y: 72 },
      { name: "Bolatti", flag: "🇦🇷", x: 50, y: 58 },
      { name: "Verón", flag: "🇦🇷", x: 78, y: 40 },
      { name: "???", flag: "🇦🇷", x: 22, y: 40 },
      { name: "Messi", flag: "🇦🇷", x: 50, y: 32 },
      { name: "Agüero", flag: "🇦🇷", x: 38, y: 12 },
      { name: "Milito", flag: "🇦🇷", x: 62, y: 12 },
    ],
    missingIndex: 7,
    optionA: "Zabaleta",
    optionB: "Gutiérrez",
    optionC: "Pastore",
    optionD: "Maxi Rodríguez",
    correctAnswer: 'D',
    hint1: "Right midfielder from Liverpool",
    hint2: "Started all three group games in South Africa",
    hint3: "Gutiérrez was on the bench in Polokwane"
  },
  {
    id: 37,
    match: "England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs Germany 🇩🇪 - 2010 World Cup Round of 16",
    year: 2010,
    team: "England",
    teamFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    positions: [
      { name: "James", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 50, y: 90 },
      { name: "Johnson", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 84, y: 72 },
      { name: "Terry", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 66, y: 76 },
      { name: "Upson", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 34, y: 76 },
      { name: "A. Cole", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 16, y: 72 },
      { name: "Lampard", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 68, y: 50 },
      { name: "Barry", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 32, y: 50 },
      { name: "Gerrard", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 20, y: 36 },
      { name: "???", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 80, y: 36 },
      { name: "Defoe", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 36, y: 12 },
      { name: "Rooney", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 64, y: 12 },
    ],
    missingIndex: 8,
    optionA: "Rooney",
    optionB: "Heskey",
    optionC: "Milner",
    optionD: "Wright-Phillips",
    correctAnswer: 'C',
    hint1: "Right midfielder from Aston Villa",
    hint2: "Capello's flat 4-4-2 in Bloemfontein",
    hint3: "Substituted for Joe Cole on 64'"
  },
  {
    id: 38,
    match: "France 🇫🇷 vs Mexico 🇲🇽 - 2010 World Cup Group Stage",
    year: 2010,
    team: "France",
    teamFlag: "🇫🇷",
    positions: [
      { name: "Lloris", flag: "🇫🇷", x: 50, y: 90 },
      { name: "Sagna", flag: "🇫🇷", x: 84, y: 72 },
      { name: "Gallas", flag: "🇫🇷", x: 66, y: 76 },
      { name: "Abidal", flag: "🇫🇷", x: 34, y: 76 },
      { name: "Evra", flag: "🇫🇷", x: 16, y: 72 },
      { name: "Toulalan", flag: "🇫🇷", x: 38, y: 56 },
      { name: "Diaby", flag: "🇫🇷", x: 62, y: 56 },
      { name: "???", flag: "🇫🇷", x: 82, y: 32 },
      { name: "Ribéry", flag: "🇫🇷", x: 50, y: 32 },
      { name: "Malouda", flag: "🇫🇷", x: 18, y: 32 },
      { name: "Anelka", flag: "🇫🇷", x: 50, y: 12 },
    ],
    missingIndex: 7,
    optionA: "Henry",
    optionB: "Govou",
    optionC: "Valbuena",
    optionD: "Benzema",
    correctAnswer: 'B',
    hint1: "Left winger from Lyon",
    hint2: "Started in Polokwane while Henry stayed on the bench",
    hint3: "Substituted for Valbuena on 69'"
  },
  {
    id: 39,
    match: "Portugal 🇵🇹 vs Spain 🇪🇸 - 2010 World Cup Round of 16",
    year: 2010,
    team: "Portugal",
    teamFlag: "🇵🇹",
    positions: [
      { name: "Eduardo", flag: "🇵🇹", x: 50, y: 90 },
      { name: "Ricardo Costa", flag: "🇵🇹", x: 84, y: 72 },
      { name: "Carvalho", flag: "🇵🇹", x: 66, y: 76 },
      { name: "Bruno Alves", flag: "🇵🇹", x: 34, y: 76 },
      { name: "Coentrão", flag: "🇵🇹", x: 16, y: 72 },
      { name: "Pepe", flag: "🇵🇹", x: 50, y: 60 },
      { name: "Tiago", flag: "🇵🇹", x: 68, y: 52 },
      { name: "Meireles", flag: "🇵🇹", x: 32, y: 52 },
      { name: "???", flag: "🇵🇹", x: 78, y: 24 },
      { name: "Ronaldo", flag: "🇵🇹", x: 22, y: 24 },
      { name: "Hugo Almeida", flag: "🇵🇹", x: 50, y: 12 },
    ],
    missingIndex: 8,
    optionA: "Simão",
    optionB: "Nani",
    optionC: "Danny",
    optionD: "Postiga",
    correctAnswer: 'A',
    hint1: "Right winger and Portugal veteran",
    hint2: "Started the Iberian derby in Cape Town",
    hint3: "Substituted for Danny at 72'"
  },
  {
    id: 40,
    match: "Italy 🇮🇹 vs Slovakia 🇸🇰 - 2010 World Cup Group Stage",
    year: 2010,
    team: "Italy",
    teamFlag: "🇮🇹",
    positions: [
      { name: "Marchetti", flag: "🇮🇹", x: 50, y: 90 },
      { name: "Zambrotta", flag: "🇮🇹", x: 84, y: 72 },
      { name: "Cannavaro", flag: "🇮🇹", x: 66, y: 76 },
      { name: "Chiellini", flag: "🇮🇹", x: 34, y: 76 },
      { name: "Criscito", flag: "🇮🇹", x: 16, y: 72 },
      { name: "De Rossi", flag: "🇮🇹", x: 50, y: 46 },
      { name: "Gattuso", flag: "🇮🇹", x: 68, y: 56 },
      { name: "Montolivo", flag: "🇮🇹", x: 32, y: 56 },
      { name: "Pepe", flag: "🇮🇹", x: 78, y: 24 },
      { name: "???", flag: "🇮🇹", x: 22, y: 24 },
      { name: "Iaquinta", flag: "🇮🇹", x: 50, y: 12 },
    ],
    missingIndex: 9,
    optionA: "Di Natale",
    optionB: "Gilardino",
    optionC: "Quagliarella",
    optionD: "Pazzini",
    correctAnswer: 'A',
    hint1: "Left winger from Udinese",
    hint2: "Started on the left in Ellis Park",
    hint3: "Quagliarella came on at 83'",
  },
  {
    id: 41,
    match: "Netherlands 🇳🇱 vs Uruguay 🇺🇾 - 2010 World Cup Semi-Final",
    year: 2010,
    team: "Netherlands",
    teamFlag: "🇳🇱",
    positions: [
      { name: "Stekelenburg", flag: "🇳🇱", x: 50, y: 90 },
      { name: "Boulahrouz", flag: "🇳🇱", x: 84, y: 72 },
      { name: "Heitinga", flag: "🇳🇱", x: 66, y: 76 },
      { name: "Mathijsen", flag: "🇳🇱", x: 34, y: 76 },
      { name: "van Bronckhorst", flag: "🇳🇱", x: 16, y: 72 },
      { name: "van Bommel", flag: "🇳🇱", x: 68, y: 56 },
      { name: "de Zeeuw", flag: "🇳🇱", x: 32, y: 56 },
      { name: "Robben", flag: "🇳🇱", x: 78, y: 24 },
      { name: "Sneijder", flag: "🇳🇱", x: 50, y: 36 },
      { name: "Kuyt", flag: "🇳🇱", x: 22, y: 24 },
      { name: "???", flag: "🇳🇱", x: 50, y: 12 },
    ],
    missingIndex: 10,
    optionA: "van Persie",
    optionB: "Huntelaar",
    optionC: "Elia",
    optionD: "Afellay",
    correctAnswer: 'A',
    hint1: "Striker and Arsenal player",
    hint2: "Known for his volley goals",
    hint3: "Netherlands' all-time top scorer"
  },
  {
    id: 42,
    match: "Germany 🇩🇪 vs Argentina 🇦🇷 - 2010 World Cup Quarter-Final",
    year: 2010,
    team: "Germany",
    teamFlag: "🇩🇪",
    positions: [
      { name: "Neuer", flag: "🇩🇪", x: 50, y: 90 },
      { name: "Lahm", flag: "🇩🇪", x: 84, y: 72 },
      { name: "Mertesacker", flag: "🇩🇪", x: 66, y: 76 },
      { name: "Friedrich", flag: "🇩🇪", x: 34, y: 76 },
      { name: "Boateng", flag: "🇩🇪", x: 16, y: 72 },
      { name: "Khedira", flag: "🇩🇪", x: 68, y: 56 },
      { name: "Schweinsteiger", flag: "🇩🇪", x: 32, y: 56 },
      { name: "Müller", flag: "🇩🇪", x: 78, y: 24 },
      { name: "???", flag: "🇩🇪", x: 50, y: 36 },
      { name: "Podolski", flag: "🇩🇪", x: 22, y: 24 },
      { name: "Klose", flag: "🇩🇪", x: 50, y: 12 },
    ],
    missingIndex: 8,
    optionA: "Özil",
    optionB: "Podolski",
    optionC: "Gómez",
    optionD: "Cacau",
    correctAnswer: 'A',
    hint1: "Attacking midfielder from Werder Bremen",
    hint2: "Creative playmaker",
    hint3: "Later played for Real Madrid and Arsenal"
  },
  {
    id: 53,
    match: "Argentina 🇦🇷 vs Mexico 🇲🇽 - 2010 World Cup Round of 16",
    year: 2010,
    team: "Argentina",
    teamFlag: "🇦🇷",
    positions: [
      { name: "Romero", flag: "🇦🇷", x: 50, y: 90 },
      { name: "Gutiérrez", flag: "🇦🇷", x: 84, y: 72 },
      { name: "Demichelis", flag: "🇦🇷", x: 66, y: 76 },
      { name: "Burdisso", flag: "🇦🇷", x: 34, y: 76 },
      { name: "Heinze", flag: "🇦🇷", x: 16, y: 72 },
      { name: "Mascherano", flag: "🇦🇷", x: 32, y: 56 },
      { name: "Di María", flag: "🇦🇷", x: 78, y: 24 },
      { name: "Messi", flag: "🇦🇷", x: 50, y: 36 },
      { name: "Tevez", flag: "🇦🇷", x: 22, y: 24 },
      { name: "Higuaín", flag: "🇦🇷", x: 50, y: 12 },
      { name: "???", flag: "🇦🇷", x: 68, y: 56 },
    ],
    missingIndex: 10,
    optionA: "Maxi Rodríguez",
    optionB: "Pastore",
    optionC: "Bolatti",
    optionD: "Verón",
    correctAnswer: 'A',
    hint1: "Right midfielder from Liverpool",
    hint2: "Scored winning goal in 2006",
    hint3: "Versatile midfielder"
  },
  {
    id: 54,
    match: "Brazil 🇧🇷 vs Netherlands 🇳🇱 - 2010 World Cup Quarter-Final",
    year: 2010,
    team: "Brazil",
    teamFlag: "🇧🇷",
    positions: [
      { name: "Júlio César", flag: "🇧🇷", x: 50, y: 90 },
      { name: "Maicon", flag: "🇧🇷", x: 84, y: 72 },
      { name: "Lúcio", flag: "🇧🇷", x: 66, y: 76 },
      { name: "Juan", flag: "🇧🇷", x: 34, y: 76 },
      { name: "Bastos", flag: "🇧🇷", x: 16, y: 72 },
      { name: "Gilberto Silva", flag: "🇧🇷", x: 28, y: 56 },
      { name: "Meló", flag: "🇧🇷", x: 50, y: 60 },
      { name: "Kaká", flag: "🇧🇷", x: 50, y: 36 },
      { name: "Robinho", flag: "🇧🇷", x: 62, y: 12 },
      { name: "Luis Fabiano", flag: "🇧🇷", x: 38, y: 12 },
      { name: "???", flag: "🇧🇷", x: 72, y: 56 },
    ],
    missingIndex: 10,
    optionA: "Elias",
    optionB: "Ramires",
    optionC: "Alves",
    optionD: "Josué",
    correctAnswer: 'A',
    hint1: "Central midfielder from Corinthians",
    hint2: "Defensive midfielder",
    hint3: "Provided balance in midfield"
  },
  {
    id: 55,
    match: "Ghana 🇬🇭 vs Uruguay 🇺🇾 - 2010 World Cup Quarter-Final",
    year: 2010,
    team: "Ghana",
    teamFlag: "🇬🇭",
    positions: [
      { name: "Kingson", flag: "🇬🇭", x: 50, y: 90 },
      { name: "Paintsil", flag: "🇬🇭", x: 84, y: 72 },
      { name: "Mensah", flag: "🇬🇭", x: 66, y: 76 },
      { name: "Vorsah", flag: "🇬🇭", x: 34, y: 76 },
      { name: "Sarpei", flag: "🇬🇭", x: 16, y: 72 },
      { name: "Annan", flag: "🇬🇭", x: 50, y: 60 },
      { name: "Inkoom", flag: "🇬🇭", x: 78, y: 38 },
      { name: "Asamoah", flag: "🇬🇭", x: 42, y: 38 },
      { name: "Ayew", flag: "🇬🇭", x: 58, y: 38 },
      { name: "Gyan", flag: "🇬🇭", x: 50, y: 12 },
      { name: "???", flag: "🇬🇭", x: 22, y: 38 },
    ],
    missingIndex: 10,
    optionA: "Tagoe",
    optionB: "Adiyiah",
    optionC: "Appiah",
    optionD: "Muntari",
    correctAnswer: 'D',
    hint1: "Central midfielder from Inter Milan",
    hint2: "Physical presence in midfield",
    hint3: "Known for his long-range shots"
  },
  {
    id: 56,
    match: "Paraguay 🇵🇾 vs Spain 🇪🇸 - 2010 World Cup Quarter-Final",
    year: 2010,
    team: "Paraguay",
    teamFlag: "🇵🇾",
    positions: [
      { name: "Villar", flag: "🇵🇾", x: 50, y: 90 },
      { name: "Verón", flag: "🇵🇾", x: 84, y: 72 },
      { name: "Moreira", flag: "🇵🇾", x: 66, y: 76 },
      { name: "Da Silva", flag: "🇵🇾", x: 34, y: 76 },
      { name: "Rodríguez", flag: "🇵🇾", x: 16, y: 72 },
      { name: "Vera", flag: "🇵🇾", x: 50, y: 60 },
      { name: "Riveros", flag: "🇵🇾", x: 32, y: 56 },
      { name: "Barreto", flag: "🇵🇾", x: 68, y: 56 },
      { name: "Valdez", flag: "🇵🇾", x: 78, y: 24 },
      { name: "Santa Cruz", flag: "🇵🇾", x: 50, y: 12 },
      { name: "???", flag: "🇵🇾", x: 22, y: 24 },
    ],
    missingIndex: 10,
    optionA: "Cardozo",
    optionB: "Barrios",
    optionC: "Benítez",
    optionD: "Cáceres",
    correctAnswer: 'A',
    hint1: "Striker from Benfica",
    hint2: "Clinical finisher",
    hint3: "Paraguay's top scorer"
  },
  {
    id: 57,
    match: "Japan 🇯🇵 vs Paraguay 🇵🇾 - 2010 World Cup Round of 16",
    year: 2010,
    team: "Japan",
    teamFlag: "🇯🇵",
    positions: [
      { name: "Kawashima", flag: "🇯🇵", x: 50, y: 90 },
      { name: "Uchida", flag: "🇯🇵", x: 84, y: 72 },
      { name: "Nakazawa", flag: "🇯🇵", x: 66, y: 76 },
      { name: "Tanaka", flag: "🇯🇵", x: 34, y: 76 },
      { name: "Komano", flag: "🇯🇵", x: 16, y: 72 },
      { name: "Hasebe", flag: "🇯🇵", x: 50, y: 60 },
      { name: "Endo", flag: "🇯🇵", x: 62, y: 56 },
      { name: "Matsui", flag: "🇯🇵", x: 78, y: 38 },
      { name: "Honda", flag: "🇯🇵", x: 50, y: 12 },
      { name: "Okazaki", flag: "🇯🇵", x: 38, y: 56 },
      { name: "???", flag: "🇯🇵", x: 22, y: 38 },
    ],
    missingIndex: 10,
    optionA: "Matsuda",
    optionB: "Inamoto",
    optionC: "Nakamura",
    optionD: "Tamada",
    correctAnswer: 'D',
    hint1: "Left winger from Nagoya Grampus",
    hint2: "Fast and skillful player",
    hint3: "Provided width on the left"
  },
  {
    id: 58,
    match: "South Korea 🇰🇷 vs Uruguay 🇺🇾 - 2010 World Cup Round of 16",
    year: 2010,
    team: "South Korea",
    teamFlag: "🇰🇷",
    positions: [
      { name: "Jung S.R.", flag: "🇰🇷", x: 50, y: 90 },
      { name: "Cha D.R.", flag: "🇰🇷", x: 84, y: 72 },
      { name: "Lee J.S.", flag: "🇰🇷", x: 66, y: 76 },
      { name: "Cho Y.H.", flag: "🇰🇷", x: 34, y: 76 },
      { name: "Lee Y.P.", flag: "🇰🇷", x: 16, y: 72 },
      { name: "Ki S.Y.", flag: "🇰🇷", x: 32, y: 56 },
      { name: "Kim J.W.", flag: "🇰🇷", x: 68, y: 56 },
      { name: "Park J.S.", flag: "🇰🇷", x: 22, y: 24 },
      { name: "Lee C.Y.", flag: "🇰🇷", x: 78, y: 24 },
      { name: "Park C.Y.", flag: "🇰🇷", x: 50, y: 12 },
      { name: "???", flag: "🇰🇷", x: 50, y: 60 },
    ],
    missingIndex: 10,
    optionA: "Kim N.I.",
    optionB: "Yeom K.H.",
    optionC: "Kim B.K.",
    optionD: "Lee D.G.",
    correctAnswer: 'A',
    hint1: "Central midfielder from Incheon",
    hint2: "Defensive midfielder",
    hint3: "Provided balance in midfield"
  },
  {
    id: 59,
    match: "USA 🇺🇸 vs Ghana 🇬🇭 - 2010 World Cup Round of 16",
    year: 2010,
    team: "USA",
    teamFlag: "🇺🇸",
    positions: [
      { name: "Howard", flag: "🇺🇸", x: 50, y: 90 },
      { name: "Cherundolo", flag: "🇺🇸", x: 84, y: 72 },
      { name: "Bocanegra", flag: "🇺🇸", x: 66, y: 76 },
      { name: "Onyewu", flag: "🇺🇸", x: 34, y: 76 },
      { name: "Bornstein", flag: "🇺🇸", x: 16, y: 72 },
      { name: "Bradley", flag: "🇺🇸", x: 32, y: 56 },
      { name: "Edu", flag: "🇺🇸", x: 68, y: 56 },
      { name: "Donovan", flag: "🇺🇸", x: 22, y: 24 },
      { name: "Dempsey", flag: "🇺🇸", x: 78, y: 24 },
      { name: "Altidore", flag: "🇺🇸", x: 50, y: 12 },
      { name: "???", flag: "🇺🇸", x: 50, y: 36 },
    ],
    missingIndex: 10,
    optionA: "Feilhaber",
    optionB: "Clark",
    optionC: "Torres",
    optionD: "Findley",
    correctAnswer: 'A',
    hint1: "Central midfielder from AGF",
    hint2: "Creative playmaker",
    hint3: "Provided attacking support"
  },
  {
    id: 60,
    match: "Chile 🇨🇱 vs Brazil 🇧🇷 - 2010 World Cup Round of 16",
    year: 2010,
    team: "Chile",
    teamFlag: "🇨🇱",
    positions: [
      { name: "Bravo", flag: "🇨🇱", x: 50, y: 90 },
      { name: "Isla", flag: "🇨🇱", x: 84, y: 72 },
      { name: "Medel", flag: "🇨🇱", x: 66, y: 76 },
      { name: "Jara", flag: "🇨🇱", x: 34, y: 76 },
      { name: "Carmona", flag: "🇨🇱", x: 16, y: 72 },
      { name: "Vidal", flag: "🇨🇱", x: 62, y: 56 },
      { name: "Millar", flag: "🇨🇱", x: 38, y: 56 },
      { name: "Valdivia", flag: "🇨🇱", x: 50, y: 36 },
      { name: "Sanchez", flag: "🇨🇱", x: 78, y: 24 },
      { name: "Suazo", flag: "🇨🇱", x: 50, y: 12 },
      { name: "???", flag: "🇨🇱", x: 22, y: 24 },
    ],
    missingIndex: 10,
    optionA: "Beausejour",
    optionB: "Gonzalez",
    optionC: "Fuentes",
    optionD: "Fierro",
    correctAnswer: 'A',
    hint1: "Left midfielder from Club América",
    hint2: "Provided width on the left",
    hint3: "Versatile midfielder"
  },
  // LEVEL 5: 2006 World Cup (Questions 51-70)
  {
    id: 51,
    match: "Italy 🇮🇹 vs France 🇫🇷 - 2006 World Cup Final",
    year: 2006,
    team: "Italy",
    teamFlag: "🇮🇹",
    positions: [
      { name: "Buffon", flag: "🇮🇹", x: 50, y: 90 },
      { name: "Zambrotta", flag: "🇮🇹", x: 84, y: 72 },
      { name: "Cannavaro", flag: "🇮🇹", x: 66, y: 76 },
      { name: "Materazzi", flag: "🇮🇹", x: 34, y: 76 },
      { name: "Grosso", flag: "🇮🇹", x: 16, y: 72 },
      { name: "Camoranesi", flag: "🇮🇹", x: 78, y: 38 },
      { name: "Gattuso", flag: "🇮🇹", x: 60, y: 54 },
      { name: "???", flag: "🇮🇹", x: 40, y: 54 },
      { name: "Perrotta", flag: "🇮🇹", x: 22, y: 38 },
      { name: "Totti", flag: "🇮🇹", x: 50, y: 34 },
      { name: "Toni", flag: "🇮🇹", x: 50, y: 12 },
    ],
    missingIndex: 7,
    optionA: "De Rossi",
    optionB: "Pirlo",
    optionC: "Marchisio",
    optionD: "Aquilani",
    correctAnswer: 'B',
    hint1: "Deep-lying playmaker in central midfield",
    hint2: "Known for his free kicks and long passes",
    hint3: "AC Milan and Juventus legend"
  },
  {
    id: 52,
    match: "Italy 🇮🇹 vs France 🇫🇷 - 2006 World Cup Final",
    year: 2006,
    team: "France",
    teamFlag: "🇫🇷",
    positions: [
      { name: "Barthez", flag: "🇫🇷", x: 50, y: 90 },
      { name: "Sagnol", flag: "🇫🇷", x: 84, y: 72 },
      { name: "Thuram", flag: "🇫🇷", x: 66, y: 76 },
      { name: "Gallas", flag: "🇫🇷", x: 34, y: 76 },
      { name: "Abidal", flag: "🇫🇷", x: 16, y: 72 },
      { name: "Ribéry", flag: "🇫🇷", x: 78, y: 24 },
      { name: "Makelele", flag: "🇫🇷", x: 32, y: 56 },
      { name: "Vieira", flag: "🇫🇷", x: 68, y: 56 },
      { name: "Malouda", flag: "🇫🇷", x: 22, y: 24 },
      { name: "Henry", flag: "🇫🇷", x: 50, y: 12 },
      { name: "???", flag: "🇫🇷", x: 50, y: 36 },
    ],
    missingIndex: 10,
    optionA: "Trezeguet",
    optionB: "Zidane",
    optionC: "Wiltord",
    optionD: "Saha",
    correctAnswer: 'B',
    hint1: "Central attacking midfielder and captain",
    hint2: "Scored a penalty in the final",
    hint3: "Famous for headbutt incident"
  },
  {
    id: 53,
    match: "Germany 🇩🇪 vs Italy 🇮🇹 - 2006 World Cup Semi-Final",
    year: 2006,
    team: "Germany",
    teamFlag: "🇩🇪",
    positions: [
      { name: "Lehmann", flag: "🇩🇪", x: 50, y: 90 },
      { name: "Friedrich", flag: "🇩🇪", x: 84, y: 72 },
      { name: "Mertesacker", flag: "🇩🇪", x: 66, y: 76 },
      { name: "Metzelder", flag: "🇩🇪", x: 34, y: 76 },
      { name: "Lahm", flag: "🇩🇪", x: 16, y: 72 },
      { name: "Schneider", flag: "🇩🇪", x: 78, y: 35 },
      { name: "Ballack", flag: "🇩🇪", x: 41, y: 54 },
      { name: "Kehl", flag: "🇩🇪", x: 59, y: 54 },
      { name: "???", flag: "🇩🇪", x: 22, y: 35 },
      { name: "Klose", flag: "🇩🇪", x: 40, y: 12 },
      { name: "Podolski", flag: "🇩🇪", x: 60, y: 12 },
    ],
    missingIndex: 8,
    optionA: "Podolski",
    optionB: "Neuville",
    optionC: "Borowski",
    optionD: "Hitzlsperger",
    correctAnswer: 'C',
    hint1: "Left midfielder in Klinsmann's 4-4-2",
    hint2: "Kehl replaced suspended Frings in Dortmund",
    hint3: "Podolski and Klose started as the front two"
  },
  {
    id: 54,
    match: "Brazil 🇧🇷 vs France 🇫🇷 - 2006 World Cup Quarter-Final",
    year: 2006,
    team: "Brazil",
    teamFlag: "🇧🇷",
    positions: [
      { name: "Dida", flag: "🇧🇷", x: 50, y: 90 },
      { name: "Cafu", flag: "🇧🇷", x: 84, y: 72 },
      { name: "Lúcio", flag: "🇧🇷", x: 66, y: 76 },
      { name: "Juan", flag: "🇧🇷", x: 34, y: 76 },
      { name: "Roberto Carlos", flag: "🇧🇷", x: 16, y: 72 },
      { name: "Gilberto Silva", flag: "🇧🇷", x: 62, y: 56 },
      { name: "Zé Roberto", flag: "🇧🇷", x: 38, y: 56 },
      { name: "Kaká", flag: "🇧🇷", x: 68, y: 38 },
      { name: "???", flag: "🇧🇷", x: 32, y: 38 },
      { name: "Ronaldinho", flag: "🇧🇷", x: 50, y: 24 },
      { name: "Ronaldo", flag: "🇧🇷", x: 50, y: 12 },
    ],
    missingIndex: 8,
    optionA: "Adriano",
    optionB: "Robinho",
    optionC: "Juninho",
    optionD: "Emerson",
    correctAnswer: 'C',
    hint1: "Left attacking midfielder from Lyon in Parreira's 4-2-2-1-1",
    hint2: "Started in Frankfurt before Adriano replaced him at 63'",
    hint3: "Robinho came on for Kaká at 79'",
  },
  {
    id: 55,
    match: "England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs Portugal 🇵🇹 - 2006 World Cup Quarter-Final",
    year: 2006,
    team: "England",
    teamFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    positions: [
      { name: "Robinson", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 50, y: 90 },
      { name: "???", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 84, y: 72 },
      { name: "Ferdinand", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 66, y: 76 },
      { name: "Terry", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 34, y: 76 },
      { name: "A. Cole", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 16, y: 72 },
      { name: "Beckham", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 78, y: 35 },
      { name: "Gerrard", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 32, y: 54 },
      { name: "Hargreaves", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 50, y: 54 },
      { name: "Lampard", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 68, y: 54 },
      { name: "J. Cole", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 22, y: 35 },
      { name: "Rooney", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", x: 50, y: 12 },
    ],
    missingIndex: 1,
    optionA: "G. Neville",
    optionB: "Carragher",
    optionC: "Crouch",
    optionD: "Bridge",
    correctAnswer: 'A',
    hint1: "Manchester United right-back — started in Gelsenkirchen",
    hint2: "Eriksson's 4-5-1 with three central midfielders",
    hint3: "Not in the squad: Owen (injured), Crouch (bench)"
  },
  {
    id: 56,
    match: "Spain 🇪🇸 vs France 🇫🇷 - 2006 World Cup Round of 16",
    year: 2006,
    team: "Spain",
    teamFlag: "🇪🇸",
    positions: [
      { name: "Casillas", flag: "🇪🇸", x: 50, y: 90 },
      { name: "Sergio Ramos", flag: "🇪🇸", x: 84, y: 72 },
      { name: "Pablo", flag: "🇪🇸", x: 66, y: 76 },
      { name: "Puyol", flag: "🇪🇸", x: 34, y: 76 },
      { name: "Pernía", flag: "🇪🇸", x: 16, y: 72 },
      { name: "Fàbregas", flag: "🇪🇸", x: 72, y: 52 },
      { name: "Alonso", flag: "🇪🇸", x: 50, y: 52 },
      { name: "Xavi", flag: "🇪🇸", x: 28, y: 52 },
      { name: "???", flag: "🇪🇸", x: 22, y: 32 },
      { name: "Torres", flag: "🇪🇸", x: 78, y: 32 },
      { name: "Raúl", flag: "🇪🇸", x: 50, y: 12 },
    ],
    missingIndex: 8,
    optionA: "Villa",
    optionB: "Raúl",
    optionC: "Morientes",
    optionD: "Reyes",
    correctAnswer: 'A',
    hint1: "Left attacking midfielder from Valencia",
    hint2: "Scored a first-half penalty in Hanover",
    hint3: "Substituted for Joaquín at 54'"
  },
  {
    id: 57,
    match: "Argentina 🇦🇷 vs Mexico 🇲🇽 - 2006 World Cup Group Stage",
    year: 2006,
    team: "Argentina",
    teamFlag: "🇦🇷",
    positions: [
      { name: "Abbondanzieri", flag: "🇦🇷", x: 50, y: 90 },
      { name: "Scaloni", flag: "🇦🇷", x: 84, y: 72 },
      { name: "Ayala", flag: "🇦🇷", x: 66, y: 76 },
      { name: "Heinze", flag: "🇦🇷", x: 34, y: 76 },
      { name: "Sorín", flag: "🇦🇷", x: 16, y: 72 },
      { name: "Mascherano", flag: "🇦🇷", x: 32, y: 56 },
      { name: "Cambiasso", flag: "🇦🇷", x: 68, y: 56 },
      { name: "Riquelme", flag: "🇦🇷", x: 50, y: 36 },
      { name: "Maxi", flag: "🇦🇷", x: 78, y: 24 },
      { name: "Crespo", flag: "🇦🇷", x: 50, y: 12 },
      { name: "???", flag: "🇦🇷", x: 22, y: 24 },
    ],
    missingIndex: 10,
    optionA: "Saviola",
    optionB: "Tevez",
    optionC: "Messi",
    optionD: "Palacio",
    correctAnswer: 'C',
    hint1: "Right winger and future legend",
    hint2: "Young Barcelona player",
    hint3: "Made his World Cup debut"
  },
  {
    id: 58,
    match: "Portugal 🇵🇹 vs Netherlands 🇳🇱 - 2006 World Cup Round of 16",
    year: 2006,
    team: "Portugal",
    teamFlag: "🇵🇹",
    positions: [
      { name: "Ricardo", flag: "🇵🇹", x: 50, y: 90 },
      { name: "Miguel", flag: "🇵🇹", x: 84, y: 72 },
      { name: "Carvalho", flag: "🇵🇹", x: 66, y: 76 },
      { name: "Meira", flag: "🇵🇹", x: 34, y: 76 },
      { name: "Valente", flag: "🇵🇹", x: 16, y: 72 },
      { name: "Costinha", flag: "🇵🇹", x: 38, y: 52 },
      { name: "Maniche", flag: "🇵🇹", x: 62, y: 52 },
      { name: "Deco", flag: "🇵🇹", x: 50, y: 36 },
      { name: "???", flag: "🇵🇹", x: 78, y: 24 },
      { name: "Ronaldo", flag: "🇵🇹", x: 22, y: 24 },
      { name: "Pauleta", flag: "🇵🇹", x: 50, y: 12 },
    ],
    missingIndex: 8,
    optionA: "Figo",
    optionB: "Simão",
    optionC: "Nani",
    optionD: "Postiga",
    correctAnswer: 'A',
    hint1: "Right winger and Portugal legend",
    hint2: "Captain in the Battle of Nuremberg",
    hint3: "Simão replaced Ronaldo at 34'"
  },
  {
    id: 59,
    match: "Portugal 🇵🇹 vs Netherlands 🇳🇱 - 2006 World Cup Group Stage",
    year: 2006,
    team: "Netherlands",
    teamFlag: "🇳🇱",
    positions: [
      { name: "Van der Sar", flag: "🇳🇱", x: 50, y: 90 },
      { name: "Heitinga", flag: "🇳🇱", x: 84, y: 72 },
      { name: "Mathijsen", flag: "🇳🇱", x: 66, y: 76 },
      { name: "Ooijer", flag: "🇳🇱", x: 34, y: 76 },
      { name: "Van Bronckhorst", flag: "🇳🇱", x: 16, y: 72 },
      { name: "Van Bommel", flag: "🇳🇱", x: 32, y: 56 },
      { name: "Cocu", flag: "🇳🇱", x: 68, y: 56 },
      { name: "Sneijder", flag: "🇳🇱", x: 50, y: 36 },
      { name: "Robben", flag: "🇳🇱", x: 78, y: 24 },
      { name: "Van Nistelrooy", flag: "🇳🇱", x: 50, y: 12 },
      { name: "???", flag: "🇳🇱", x: 22, y: 24 },
    ],
    missingIndex: 10,
    optionA: "Van Persie",
    optionB: "Kuyt",
    optionC: "Huntelaar",
    optionD: "Babel",
    correctAnswer: 'A',
    hint1: "Left winger from Arsenal",
    hint2: "Future Arsenal captain",
    hint3: "Versatile forward"
  },
  {
    id: 60,
    match: "Czech Republic 🇨🇿 vs Italy 🇮🇹 - 2006 World Cup Group Stage",
    year: 2006,
    team: "Czech Republic",
    teamFlag: "🇨🇿",
    positions: [
      { name: "Čech", flag: "🇨🇿", x: 50, y: 90 },
      { name: "Grygera", flag: "🇨🇿", x: 84, y: 72 },
      { name: "Ujfaluši", flag: "🇨🇿", x: 66, y: 76 },
      { name: "Rozehnal", flag: "🇨🇿", x: 34, y: 76 },
      { name: "Jankulovski", flag: "🇨🇿", x: 16, y: 72 },
      { name: "Galásek", flag: "🇨🇿", x: 50, y: 60 },
      { name: "Rosický", flag: "🇨🇿", x: 72, y: 52 },
      { name: "Poborský", flag: "🇨🇿", x: 28, y: 52 },
      { name: "Nedvěd", flag: "🇨🇿", x: 78, y: 24 },
      { name: "Koller", flag: "🇨🇿", x: 50, y: 12 },
      { name: "???", flag: "🇨🇿", x: 22, y: 24 },
    ],
    missingIndex: 10,
    optionA: "Baroš",
    optionB: "Heinz",
    optionC: "Šmicer",
    optionD: "Jarolím",
    correctAnswer: 'A',
    hint1: "Striker from Aston Villa",
    hint2: "Euro 2004 top scorer",
    hint3: "Clinical finisher"
  },
  {
    id: 61,
    match: "Ukraine 🇺🇦 vs Switzerland 🇨🇭 - 2006 World Cup Round of 16",
    year: 2006,
    team: "Ukraine",
    teamFlag: "🇺🇦",
    positions: [
      { name: "Shovkovskiy", flag: "🇺🇦", x: 50, y: 90 },
      { name: "Rusol", flag: "🇺🇦", x: 65, y: 75 },
      { name: "Sviderskiy", flag: "🇺🇦", x: 35, y: 75 },
      { name: "Nesmachniy", flag: "🇺🇦", x: 20, y: 72 },
      { name: "Tymoshchuk", flag: "🇺🇦", x: 50, y: 55 },
      { name: "Shelayev", flag: "🇺🇦", x: 65, y: 50 },
      { name: "Gusin", flag: "🇺🇦", x: 35, y: 50 },
      { name: "Rotan", flag: "🇺🇦", x: 50, y: 42 },
      { name: "Shevchenko", flag: "🇺🇦", x: 50, y: 18 },
      { name: "Voronin", flag: "🇺🇦", x: 75, y: 30 },
      { name: "???", flag: "🇺🇦", x: 80, y: 72 },
    ],
    missingIndex: 10,
    optionA: "Yarmolenko",
    optionB: "Rebrov",
    optionC: "Kalynychenko",
    optionD: "Milevskiy",
    correctAnswer: 'B',
    hint1: "Right-back and forward",
    hint2: "Former Tottenham player",
    hint3: "Versatile player"
  },
  {
    id: 62,
    match: "Australia 🇦🇺 vs Italy 🇮🇹 - 2006 World Cup Round of 16",
    year: 2006,
    team: "Australia",
    teamFlag: "🇦🇺",
    positions: [
      { name: "Schwarzer", flag: "🇦🇺", x: 50, y: 90 },
      { name: "Neill", flag: "🇦🇺", x: 80, y: 72 },
      { name: "Moore", flag: "🇦🇺", x: 65, y: 75 },
      { name: "Popovic", flag: "🇦🇺", x: 35, y: 75 },
      { name: "Chipperfield", flag: "🇦🇺", x: 20, y: 72 },
      { name: "Grella", flag: "🇦🇺", x: 50, y: 55 },
      { name: "Culina", flag: "🇦🇺", x: 65, y: 50 },
      { name: "Bresciano", flag: "🇦🇺", x: 50, y: 42 },
      { name: "Kewell", flag: "🇦🇺", x: 75, y: 30 },
      { name: "Viduka", flag: "🇦🇺", x: 50, y: 18 },
      { name: "???", flag: "🇦🇺", x: 35, y: 50 },
    ],
    missingIndex: 10,
    optionA: "Emerton",
    optionB: "Aloisi",
    optionC: "Skoko",
    optionD: "Sterjovski",
    correctAnswer: 'A',
    hint1: "Right midfielder from Blackburn",
    hint2: "Versatile player",
    hint3: "Provided width on the right"
  },
  {
    id: 63,
    match: "Mexico 🇲🇽 vs Argentina 🇦🇷 - 2006 World Cup Round of 16",
    year: 2006,
    team: "Mexico",
    teamFlag: "🇲🇽",
    positions: [
      { name: "Sánchez", flag: "🇲🇽", x: 50, y: 90 },
      { name: "Salcido", flag: "🇲🇽", x: 80, y: 72 },
      { name: "Márquez", flag: "🇲🇽", x: 65, y: 75 },
      { name: "Osorio", flag: "🇲🇽", x: 35, y: 75 },
      { name: "Pineda", flag: "🇲🇽", x: 20, y: 72 },
      { name: "Torrado", flag: "🇲🇽", x: 50, y: 55 },
      { name: "Pardo", flag: "🇲🇽", x: 65, y: 50 },
      { name: "Méndez", flag: "🇲🇽", x: 35, y: 50 },
      { name: "Borgetti", flag: "🇲🇽", x: 50, y: 18 },
      { name: "Fonseca", flag: "🇲🇽", x: 75, y: 30 },
      { name: "???", flag: "🇲🇽", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Franco",
    optionB: "Bravo",
    optionC: "Guardado",
    optionD: "Zinha",
    correctAnswer: 'C',
    hint1: "Left winger from Atlas",
    hint2: "Young talented player",
    hint3: "Future Mexico star"
  },
  {
    id: 64,
    match: "Sweden 🇸🇪 vs Germany 🇩🇪 - 2006 World Cup Round of 16",
    year: 2006,
    team: "Sweden",
    teamFlag: "🇸🇪",
    positions: [
      { name: "Isaksson", flag: "🇸🇪", x: 50, y: 90 },
      { name: "Mellberg", flag: "🇸🇪", x: 65, y: 75 },
      { name: "Edman", flag: "🇸🇪", x: 35, y: 75 },
      { name: "Lucic", flag: "🇸🇪", x: 20, y: 72 },
      { name: "Linderoth", flag: "🇸🇪", x: 50, y: 55 },
      { name: "Andersson", flag: "🇸🇪", x: 65, y: 50 },
      { name: "Ljungberg", flag: "🇸🇪", x: 50, y: 42 },
      { name: "Wilhelmsson", flag: "🇸🇪", x: 75, y: 30 },
      { name: "Ibrahimović", flag: "🇸🇪", x: 50, y: 18 },
      { name: "Larsson", flag: "🇸🇪", x: 25, y: 30 },
      { name: "???", flag: "🇸🇪", x: 80, y: 72 },
    ],
    missingIndex: 10,
    optionA: "Stenman",
    optionB: "Nilsson",
    optionC: "Alexandersson",
    optionD: "Källström",
    correctAnswer: 'A',
    hint1: "Right-back from Djurgården",
    hint2: "Defensive player",
    hint3: "Provided defensive cover"
  },
  {
    id: 65,
    match: "Ecuador 🇪🇨 vs England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 - 2006 World Cup Group Stage",
    year: 2006,
    team: "Ecuador",
    teamFlag: "🇪🇨",
    positions: [
      { name: "Mora", flag: "🇪🇨", x: 50, y: 90 },
      { name: "de la Cruz", flag: "🇪🇨", x: 80, y: 72 },
      { name: "Erazo", flag: "🇪🇨", x: 65, y: 75 },
      { name: "Achilier", flag: "🇪🇨", x: 35, y: 75 },
      { name: "Reasco", flag: "🇪🇨", x: 20, y: 72 },
      { name: "Valencia", flag: "🇪🇨", x: 50, y: 55 },
      { name: "Méndez", flag: "🇪🇨", x: 65, y: 50 },
      { name: "Ayoví", flag: "🇪🇨", x: 35, y: 50 },
      { name: "Kaviedes", flag: "🇪🇨", x: 75, y: 30 },
      { name: "Delgado", flag: "🇪🇨", x: 50, y: 18 },
      { name: "???", flag: "🇪🇨", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Tenorio",
    optionB: "Borja",
    optionC: "Urrutia",
    optionD: "Guagua",
    correctAnswer: 'A',
    hint1: "Striker from LDU Quito",
    hint2: "Clinical finisher",
    hint3: "Ecuador's top scorer"
  },
  {
    id: 66,
    match: "Croatia 🇭🇷 vs Australia 🇦🇺 - 2006 World Cup Group Stage",
    year: 2006,
    team: "Croatia",
    teamFlag: "🇭🇷",
    positions: [
      { name: "Pletikosa", flag: "🇭🇷", x: 50, y: 90 },
      { name: "Srna", flag: "🇭🇷", x: 80, y: 72 },
      { name: "Simić", flag: "🇭🇷", x: 70, y: 75 },
      { name: "R. Kovač", flag: "🇭🇷", x: 50, y: 75 },
      { name: "Šimić", flag: "🇭🇷", x: 30, y: 75 },
      { name: "Babić", flag: "🇭🇷", x: 20, y: 72 },
      { name: "N. Kovač", flag: "🇭🇷", x: 50, y: 55 },
      { name: "Tudor", flag: "🇭🇷", x: 65, y: 50 },
      { name: "Kranjčar", flag: "🇭🇷", x: 50, y: 42 },
      { name: "Pršo", flag: "🇭🇷", x: 50, y: 18 },
      { name: "???", flag: "🇭🇷", x: 75, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Olić",
    optionB: "Klasnić",
    optionC: "Balaban",
    optionD: "Rakitić",
    correctAnswer: 'A',
    hint1: "Striker from CSKA Moscow",
    hint2: "Fast and direct player",
    hint3: "Clinical finisher"
  },
  {
    id: 67,
    match: "Japan 🇯🇵 vs Brazil 🇧🇷 - 2006 World Cup Group Stage",
    year: 2006,
    team: "Japan",
    teamFlag: "🇯🇵",
    positions: [
      { name: "Kawaguchi", flag: "🇯🇵", x: 50, y: 90 },
      { name: "Nakazawa", flag: "🇯🇵", x: 65, y: 75 },
      { name: "Tanaka", flag: "🇯🇵", x: 35, y: 75 },
      { name: "Komano", flag: "🇯🇵", x: 20, y: 72 },
      { name: "Hasebe", flag: "🇯🇵", x: 50, y: 55 },
      { name: "Nakata", flag: "🇯🇵", x: 50, y: 42 },
      { name: "Ono", flag: "🇯🇵", x: 65, y: 50 },
      { name: "Matsui", flag: "🇯🇵", x: 35, y: 50 },
      { name: "Tamada", flag: "🇯🇵", x: 75, y: 30 },
      { name: "Oguro", flag: "🇯🇵", x: 50, y: 18 },
      { name: "???", flag: "🇯🇵", x: 80, y: 72 },
    ],
    missingIndex: 10,
    optionA: "Tsuboi",
    optionB: "Miyamoto",
    optionC: "Suzuki",
    optionD: "Fukuda",
    correctAnswer: 'A',
    hint1: "Right-back from Urawa Reds",
    hint2: "Defensive player",
    hint3: "Provided defensive cover"
  },
  {
    id: 68,
    match: "South Korea 🇰🇷 vs France 🇫🇷 - 2006 World Cup Group Stage",
    year: 2006,
    team: "South Korea",
    teamFlag: "🇰🇷",
    positions: [
      { name: "Lee W.J.", flag: "🇰🇷", x: 50, y: 90 },
      { name: "Song C.G.", flag: "🇰🇷", x: 80, y: 72 },
      { name: "Kim D.J.", flag: "🇰🇷", x: 65, y: 75 },
      { name: "Choi J.C.", flag: "🇰🇷", x: 35, y: 75 },
      { name: "Lee Y.P.", flag: "🇰🇷", x: 20, y: 72 },
      { name: "Kim N.I.", flag: "🇰🇷", x: 50, y: 55 },
      { name: "Park J.S.", flag: "🇰🇷", x: 50, y: 42 },
      { name: "Lee C.S.", flag: "🇰🇷", x: 65, y: 50 },
      { name: "Park C.Y.", flag: "🇰🇷", x: 75, y: 30 },
      { name: "Ahn J.H.", flag: "🇰🇷", x: 50, y: 18 },
      { name: "???", flag: "🇰🇷", x: 35, y: 50 },
    ],
    missingIndex: 10,
    optionA: "Kim D.W.",
    optionB: "Lee H.",
    optionC: "Seol K.H.",
    optionD: "Chung K.H.",
    correctAnswer: 'A',
    hint1: "Central midfielder from Suwon",
    hint2: "Defensive midfielder",
    hint3: "Provided balance in midfield"
  },
  {
    id: 69,
    match: "Tunisia 🇹🇳 vs Spain 🇪🇸 - 2006 World Cup Group Stage",
    year: 2006,
    team: "Tunisia",
    teamFlag: "🇹🇳",
    positions: [
      { name: "Boumnijel", flag: "🇹🇳", x: 50, y: 90 },
      { name: "Haggui", flag: "🇹🇳", x: 70, y: 75 },
      { name: "Jaïdi", flag: "🇹🇳", x: 50, y: 75 },
      { name: "Trabelsi", flag: "🇹🇳", x: 30, y: 75 },
      { name: "Haggui", flag: "🇹🇳", x: 20, y: 72 },
      { name: "Namouchi", flag: "🇹🇳", x: 50, y: 55 },
      { name: "Mnari", flag: "🇹🇳", x: 65, y: 50 },
      { name: "Chedli", flag: "🇹🇳", x: 35, y: 50 },
      { name: "Jaziri", flag: "🇹🇳", x: 75, y: 30 },
      { name: "Santos", flag: "🇹🇳", x: 50, y: 18 },
      { name: "???", flag: "🇹🇳", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Ben Achour",
    optionB: "Ghodhbane",
    optionC: "Bouazizi",
    optionD: "Clayton",
    correctAnswer: 'A',
    hint1: "Left winger from Étoile du Sahel",
    hint2: "Fast and skillful player",
    hint3: "Provided width on the left"
  },
  {
    id: 70,
    match: "Saudi Arabia 🇸🇦 vs Spain 🇪🇸 - 2006 World Cup Group Stage",
    year: 2006,
    team: "Saudi Arabia",
    teamFlag: "🇸🇦",
    positions: [
      { name: "Zaid", flag: "🇸🇦", x: 50, y: 90 },
      { name: "Al-Montashari", flag: "🇸🇦", x: 65, y: 75 },
      { name: "Al-Qadi", flag: "🇸🇦", x: 35, y: 75 },
      { name: "Al-Dosari", flag: "🇸🇦", x: 20, y: 72 },
      { name: "Al-Ghamdi", flag: "🇸🇦", x: 50, y: 55 },
      { name: "Al-Shalhoub", flag: "🇸🇦", x: 65, y: 50 },
      { name: "Al-Jaber", flag: "🇸🇦", x: 50, y: 42 },
      { name: "Al-Kahtani", flag: "🇸🇦", x: 75, y: 30 },
      { name: "Al-Harthi", flag: "🇸🇦", x: 50, y: 18 },
      { name: "Al-Anazi", flag: "🇸🇦", x: 25, y: 30 },
      { name: "???", flag: "🇸🇦", x: 80, y: 72 },
    ],
    missingIndex: 10,
    optionA: "Al-Bishi",
    optionB: "Al-Temyat",
    optionC: "Al-Otaibi",
    optionD: "Al-Khathran",
    correctAnswer: 'A',
    hint1: "Right-back from Al-Hilal",
    hint2: "Defensive player",
    hint3: "Provided defensive cover"
  },
  // LEVEL 6: 2022 World Cup Different Matches (Questions 71-90)
  {
    id: 71,
    match: "Netherlands 🇳🇱 vs Argentina 🇦🇷 - 2022 World Cup Quarter-Final",
    year: 2022,
    team: "Netherlands",
    teamFlag: "🇳🇱",
    positions: [
      { name: "Noppert", flag: "🇳🇱", x: 50, y: 90 },
      { name: "Timber", flag: "🇳🇱", x: 72, y: 76 },
      { name: "Van Dijk", flag: "🇳🇱", x: 50, y: 76 },
      { name: "Aké", flag: "🇳🇱", x: 28, y: 76 },
      { name: "Dumfries", flag: "🇳🇱", x: 90, y: 48 },
      { name: "De Roon", flag: "🇳🇱", x: 38, y: 52 },
      { name: "F. de Jong", flag: "🇳🇱", x: 62, y: 52 },
      { name: "Blind", flag: "🇳🇱", x: 10, y: 48 },
      { name: "Gakpo", flag: "🇳🇱", x: 50, y: 30 },
      { name: "???", flag: "🇳🇱", x: 38, y: 12 },
      { name: "Depay", flag: "🇳🇱", x: 62, y: 12 },
    ],
    missingIndex: 9,
    optionA: "Bergwijn",
    optionB: "Weghorst",
    optionC: "Janssen",
    optionD: "Lang",
    correctAnswer: 'A',
    hint1: "Left striker in Van Gaal's 3-4-1-2",
    hint2: "Ajax forward alongside Depay",
    hint3: "Started the quarter-final vs Argentina"
  },
  {
    id: 72,
    match: "Japan 🇯🇵 vs Croatia 🇭🇷 - 2022 World Cup Round of 16",
    year: 2022,
    team: "Japan",
    teamFlag: "🇯🇵",
    positions: [
      { name: "Gonda", flag: "🇯🇵", x: 50, y: 90 },
      { name: "Tomiyasu", flag: "🇯🇵", x: 72, y: 78 },
      { name: "Yoshida", flag: "🇯🇵", x: 50, y: 72 },
      { name: "Taniguchi", flag: "🇯🇵", x: 28, y: 78 },
      { name: "Ito", flag: "🇯🇵", x: 88, y: 48 },
      { name: "Endo", flag: "🇯🇵", x: 60, y: 52 },
      { name: "Morita", flag: "🇯🇵", x: 40, y: 52 },
      { name: "Nagatomo", flag: "🇯🇵", x: 12, y: 48 },
      { name: "???", flag: "🇯🇵", x: 78, y: 28 },
      { name: "Maeda", flag: "🇯🇵", x: 50, y: 12 },
      { name: "Kamada", flag: "🇯🇵", x: 22, y: 28 },
    ],
    missingIndex: 8,
    optionA: "Mitoma",
    optionB: "Doan",
    optionC: "Minamino",
    optionD: "Asano",
    correctAnswer: 'B',
    hint1: "Right forward from Freiburg in Moriyasu's 3-4-2-1",
    hint2: "Started the Round of 16 in Al Wakrah",
    hint3: "Mitoma and Asano came on together at 64'"
  },
  {
    id: 73,
    match: "Saudi Arabia 🇸🇦 vs Argentina 🇦🇷 - 2022 World Cup Group Stage",
    year: 2022,
    team: "Saudi Arabia",
    teamFlag: "🇸🇦",
    positions: [
      { name: "Al-Owais", flag: "🇸🇦", x: 50, y: 90 },
      { name: "Al-Ghannam", flag: "🇸🇦", x: 80, y: 72 },
      { name: "Al-Boleahi", flag: "🇸🇦", x: 65, y: 75 },
      { name: "Al-Tambakti", flag: "🇸🇦", x: 35, y: 75 },
      { name: "Al-Shahrani", flag: "🇸🇦", x: 20, y: 72 },
      { name: "Al-Malki", flag: "🇸🇦", x: 50, y: 55 },
      { name: "Kanno", flag: "🇸🇦", x: 65, y: 50 },
      { name: "Al-Dawsari", flag: "🇸🇦", x: 50, y: 42 },
      { name: "Al-Buraikan", flag: "🇸🇦", x: 75, y: 30 },
      { name: "Al-Shehri", flag: "🇸🇦", x: 50, y: 18 },
      { name: "???", flag: "🇸🇦", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Al-Faraj",
    optionB: "Al-Abed",
    optionC: "Al-Harbi",
    optionD: "Al-Qahtani",
    correctAnswer: 'A',
    hint1: "Central midfielder and captain",
    hint2: "Played for Al-Hilal",
    hint3: "Key playmaker"
  },
  {
    id: 74,
    match: "South Korea 🇰🇷 vs Portugal 🇵🇹 - 2022 World Cup Group Stage",
    year: 2022,
    team: "South Korea",
    teamFlag: "🇰🇷",
    positions: [
      { name: "Kim S.G.", flag: "🇰🇷", x: 50, y: 90 },
      { name: "Kim M.J.", flag: "🇰🇷", x: 80, y: 72 },
      { name: "Kim Y.G.", flag: "🇰🇷", x: 65, y: 75 },
      { name: "Kim M.H.", flag: "🇰🇷", x: 35, y: 75 },
      { name: "Kim J.S.", flag: "🇰🇷", x: 20, y: 72 },
      { name: "Jung W.Y.", flag: "🇰🇷", x: 50, y: 55 },
      { name: "Hwang I.B.", flag: "🇰🇷", x: 65, y: 50 },
      { name: "Lee J.S.", flag: "🇰🇷", x: 50, y: 42 },
      { name: "Son", flag: "🇰🇷", x: 75, y: 30 },
      { name: "Cho G.S.", flag: "🇰🇷", x: 50, y: 18 },
      { name: "???", flag: "🇰🇷", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Hwang H.C.",
    optionB: "Paik S.H.",
    optionC: "Kwon K.W.",
    optionD: "Na S.H.",
    correctAnswer: 'A',
    hint1: "Right winger from Wolves",
    hint2: "Fast and direct player",
    hint3: "Attacking midfielder"
  },
  {
    id: 75,
    match: "Senegal 🇸🇳 vs Netherlands 🇳🇱 - 2022 World Cup Group Stage",
    year: 2022,
    team: "Senegal",
    teamFlag: "🇸🇳",
    positions: [
      { name: "E. Mendy", flag: "🇸🇳", x: 50, y: 90 },
      { name: "Sabaly", flag: "🇸🇳", x: 80, y: 72 },
      { name: "Koulibaly", flag: "🇸🇳", x: 65, y: 75 },
      { name: "Diallo", flag: "🇸🇳", x: 35, y: 75 },
      { name: "Jakobs", flag: "🇸🇳", x: 20, y: 72 },
      { name: "Gueye", flag: "🇸🇳", x: 50, y: 55 },
      { name: "Ciss", flag: "🇸🇳", x: 65, y: 50 },
      { name: "N. Mendy", flag: "🇸🇳", x: 35, y: 50 },
      { name: "Sarr", flag: "🇸🇳", x: 75, y: 30 },
      { name: "Dia", flag: "🇸🇳", x: 50, y: 18 },
      { name: "???", flag: "🇸🇳", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Mané",
    optionB: "Dieng",
    optionC: "Diedhiou",
    optionD: "Ndiaye",
    correctAnswer: 'A',
    hint1: "Left winger and Senegal's star player",
    hint2: "Bayern Munich and Liverpool legend",
    hint3: "African Player of the Year"
  },
  {
    id: 76,
    match: "Ecuador 🇪🇨 vs Netherlands 🇳🇱 - 2022 World Cup Group Stage",
    year: 2022,
    team: "Ecuador",
    teamFlag: "🇪🇨",
    positions: [
      { name: "Galíndez", flag: "🇪🇨", x: 50, y: 90 },
      { name: "Preciado", flag: "🇪🇨", x: 80, y: 72 },
      { name: "Torres", flag: "🇪🇨", x: 65, y: 75 },
      { name: "Hincapié", flag: "🇪🇨", x: 35, y: 75 },
      { name: "Estupiñán", flag: "🇪🇨", x: 20, y: 72 },
      { name: "Gruezo", flag: "🇪🇨", x: 50, y: 55 },
      { name: "Méndez", flag: "🇪🇨", x: 65, y: 50 },
      { name: "Caicedo", flag: "🇪🇨", x: 50, y: 42 },
      { name: "Plata", flag: "🇪🇨", x: 75, y: 30 },
      { name: "Valencia", flag: "🇪🇨", x: 50, y: 18 },
      { name: "???", flag: "🇪🇨", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Estrada",
    optionB: "Ibarra",
    optionC: "Sarmiento",
    optionD: "Reasco",
    correctAnswer: 'A',
    hint1: "Right winger from América",
    hint2: "Attacking midfielder",
    hint3: "Creative player"
  },
  {
    id: 77,
    match: "Canada 🇨🇦 vs Belgium 🇧🇪 - 2022 World Cup Group Stage",
    year: 2022,
    team: "Canada",
    teamFlag: "🇨🇦",
    positions: [
      { name: "Borjan", flag: "🇨🇦", x: 50, y: 90 },
      { name: "Johnston", flag: "🇨🇦", x: 80, y: 72 },
      { name: "Vitória", flag: "🇨🇦", x: 65, y: 75 },
      { name: "Miller", flag: "🇨🇦", x: 35, y: 75 },
      { name: "Adekugbe", flag: "🇨🇦", x: 20, y: 72 },
      { name: "Eustáquio", flag: "🇨🇦", x: 50, y: 55 },
      { name: "Hutchinson", flag: "🇨🇦", x: 65, y: 50 },
      { name: "Buchanan", flag: "🇨🇦", x: 75, y: 30 },
      { name: "David", flag: "🇨🇦", x: 50, y: 18 },
      { name: "Larin", flag: "🇨🇦", x: 25, y: 30 },
      { name: "???", flag: "🇨🇦", x: 35, y: 50 },
    ],
    missingIndex: 7,
    optionA: "Osorio",
    optionB: "Kaye",
    optionC: "Fraser",
    optionD: "Hoilett",
    correctAnswer: 'A',
    hint1: "Central midfielder from Toronto FC",
    hint2: "Playmaker and key player",
    hint3: "Creative midfielder"
  },
  {
    id: 78,
    match: "Australia 🇦🇺 vs France 🇫🇷 - 2022 World Cup Group Stage",
    year: 2022,
    team: "Australia",
    teamFlag: "🇦🇺",
    positions: [
      { name: "Ryan", flag: "🇦🇺", x: 50, y: 90 },
      { name: "Atkinson", flag: "🇦🇺", x: 80, y: 72 },
      { name: "Souttar", flag: "🇦🇺", x: 65, y: 75 },
      { name: "Rowles", flag: "🇦🇺", x: 35, y: 75 },
      { name: "Behich", flag: "🇦🇺", x: 20, y: 72 },
      { name: "Irvine", flag: "🇦🇺", x: 50, y: 55 },
      { name: "Mooy", flag: "🇦🇺", x: 65, y: 50 },
      { name: "Leckie", flag: "🇦🇺", x: 75, y: 30 },
      { name: "McGree", flag: "🇦🇺", x: 50, y: 42 },
      { name: "Duke", flag: "🇦🇺", x: 50, y: 18 },
      { name: "???", flag: "🇦🇺", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Goodwin",
    optionB: "Mabil",
    optionC: "Maclaren",
    optionD: "Tilio",
    correctAnswer: 'A',
    hint1: "Left winger from Adelaide United",
    hint2: "Set-piece specialist",
    hint3: "Attacking midfielder"
  },
  {
    id: 79,
    match: "Tunisia 🇹🇳 vs France 🇫🇷 - 2022 World Cup Group Stage",
    year: 2022,
    team: "Tunisia",
    teamFlag: "🇹🇳",
    positions: [
      { name: "Dahmen", flag: "🇹🇳", x: 50, y: 90 },
      { name: "Drager", flag: "🇹🇳", x: 80, y: 72 },
      { name: "Talbi", flag: "🇹🇳", x: 65, y: 75 },
      { name: "Meriah", flag: "🇹🇳", x: 35, y: 75 },
      { name: "Maâloul", flag: "🇹🇳", x: 20, y: 72 },
      { name: "Laïdouni", flag: "🇹🇳", x: 50, y: 55 },
      { name: "Skhiri", flag: "🇹🇳", x: 65, y: 50 },
      { name: "Abdi", flag: "🇹🇳", x: 50, y: 42 },
      { name: "Msakni", flag: "🇹🇳", x: 75, y: 30 },
      { name: "Jebali", flag: "🇹🇳", x: 50, y: 18 },
      { name: "???", flag: "🇹🇳", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Khenissi",
    optionB: "Sliti",
    optionC: "Ben Slimane",
    optionD: "Ben Romdhane",
    correctAnswer: 'A',
    hint1: "Striker from Kuwait SC",
    hint2: "Clinical finisher",
    hint3: "Target man"
  },
  {
    id: 80,
    match: "Costa Rica 🇨🇷 vs Germany 🇩🇪 - 2022 World Cup Group Stage",
    year: 2022,
    team: "Costa Rica",
    teamFlag: "🇨🇷",
    positions: [
      { name: "Navas", flag: "🇨🇷", x: 50, y: 90 },
      { name: "Fuller", flag: "🇨🇷", x: 80, y: 72 },
      { name: "Duarte", flag: "🇨🇷", x: 65, y: 75 },
      { name: "Calvo", flag: "🇨🇷", x: 35, y: 75 },
      { name: "Oviedo", flag: "🇨🇷", x: 20, y: 72 },
      { name: "Tejeda", flag: "🇨🇷", x: 50, y: 55 },
      { name: "Borges", flag: "🇨🇷", x: 65, y: 50 },
      { name: "Benítez", flag: "🇨🇷", x: 35, y: 50 },
      { name: "Torres", flag: "🇨🇷", x: 75, y: 30 },
      { name: "Contreras", flag: "🇨🇷", x: 50, y: 18 },
      { name: "???", flag: "🇨🇷", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Campbell",
    optionB: "Ruiz",
    optionC: "Venegas",
    optionD: "Brenes",
    correctAnswer: 'A',
    hint1: "Striker from León",
    hint2: "Former Arsenal player",
    hint3: "Key attacking player"
  },
  // LEVEL 7: 2018 World Cup Different Matches (Questions 91-110)
  {
    id: 62,
    match: "Sweden 🇸🇪 vs England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 - 2018 World Cup Quarter-Final",
    year: 2018,
    team: "Sweden",
    teamFlag: "🇸🇪",
    positions: [
      { name: "Olsen", flag: "🇸🇪", x: 50, y: 90 },
      { name: "Lustig", flag: "🇸🇪", x: 80, y: 72 },
      { name: "Lindelöf", flag: "🇸🇪", x: 65, y: 75 },
      { name: "Granqvist", flag: "🇸🇪", x: 35, y: 75 },
      { name: "Augustinsson", flag: "🇸🇪", x: 20, y: 72 },
      { name: "Larsson", flag: "🇸🇪", x: 50, y: 55 },
      { name: "Ekdal", flag: "🇸🇪", x: 65, y: 50 },
      { name: "Forsberg", flag: "🇸🇪", x: 50, y: 42 },
      { name: "Claesson", flag: "🇸🇪", x: 75, y: 30 },
      { name: "Berg", flag: "🇸🇪", x: 50, y: 18 },
      { name: "???", flag: "🇸🇪", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Toivonen",
    optionB: "Guidetti",
    optionC: "Thelin",
    optionD: "Quaison",
    correctAnswer: 'A',
    hint1: "Striker from Toulouse",
    hint2: "Target man",
    hint3: "Physical forward"
  },
  {
    id: 63,
    match: "Mexico 🇲🇽 vs Brazil 🇧🇷 - 2018 World Cup Round of 16",
    year: 2018,
    team: "Mexico",
    teamFlag: "🇲🇽",
    positions: [
      { name: "Ochoa", flag: "🇲🇽", x: 50, y: 90 },
      { name: "Salcedo", flag: "🇲🇽", x: 70, y: 75 },
      { name: "Ayala", flag: "🇲🇽", x: 50, y: 75 },
      { name: "Moreno", flag: "🇲🇽", x: 30, y: 75 },
      { name: "Gallardo", flag: "🇲🇽", x: 20, y: 72 },
      { name: "Herrera", flag: "🇲🇽", x: 50, y: 55 },
      { name: "Guardado", flag: "🇲🇽", x: 65, y: 50 },
      { name: "Layún", flag: "🇲🇽", x: 80, y: 72 },
      { name: "Vela", flag: "🇲🇽", x: 75, y: 30 },
      { name: "Chicharito", flag: "🇲🇽", x: 50, y: 18 },
      { name: "???", flag: "🇲🇽", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Lozano",
    optionB: "Dos Santos",
    optionC: "Jiménez",
    optionD: "Peralta",
    correctAnswer: 'A',
    hint1: "Left winger from PSV",
    hint2: "Fast and skillful player",
    hint3: "Attacking midfielder"
  },
  {
    id: 64,
    match: "Russia 🇷🇺 vs Spain 🇪🇸 - 2018 World Cup Group Stage",
    year: 2018,
    team: "Russia",
    teamFlag: "🇷🇺",
    positions: [
      { name: "Akinfeev", flag: "🇷🇺", x: 50, y: 90 },
      { name: "Fernandes", flag: "🇷🇺", x: 80, y: 72 },
      { name: "Kutepov", flag: "🇷🇺", x: 65, y: 75 },
      { name: "Ignashevich", flag: "🇷🇺", x: 35, y: 75 },
      { name: "Zhirkov", flag: "🇷🇺", x: 20, y: 72 },
      { name: "Zobnin", flag: "🇷🇺", x: 50, y: 55 },
      { name: "Gazinskiy", flag: "🇷🇺", x: 65, y: 50 },
      { name: "Samedov", flag: "🇷🇺", x: 75, y: 30 },
      { name: "Golovin", flag: "🇷🇺", x: 50, y: 42 },
      { name: "Dzyuba", flag: "🇷🇺", x: 50, y: 18 },
      { name: "???", flag: "🇷🇺", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Cheryshev",
    optionB: "Smolov",
    optionC: "Miranchuk",
    optionD: "Erokhin",
    correctAnswer: 'A',
    hint1: "Left winger from Villarreal",
    hint2: "Scored multiple goals in the tournament",
    hint3: "Attacking midfielder"
  },
  {
    id: 65,
    match: "France 🇫🇷 vs Denmark 🇩🇰 - 2018 World Cup Group Stage",
    year: 2018,
    team: "Switzerland",
    teamFlag: "🇨🇭",
    positions: [
      { name: "Sommer", flag: "🇨🇭", x: 50, y: 90 },
      { name: "Lichtsteiner", flag: "🇨🇭", x: 80, y: 72 },
      { name: "Schär", flag: "🇨🇭", x: 65, y: 75 },
      { name: "Akanji", flag: "🇨🇭", x: 35, y: 75 },
      { name: "Rodríguez", flag: "🇨🇭", x: 20, y: 72 },
      { name: "Behrami", flag: "🇨🇭", x: 50, y: 55 },
      { name: "Xhaka", flag: "🇨🇭", x: 65, y: 50 },
      { name: "Shaqiri", flag: "🇨🇭", x: 75, y: 30 },
      { name: "Džemaili", flag: "🇨🇭", x: 50, y: 42 },
      { name: "Seferović", flag: "🇨🇭", x: 50, y: 18 },
      { name: "???", flag: "🇨🇭", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Embolo",
    optionB: "Gavranović",
    optionC: "Drmić",
    optionD: "Mehmedi",
    correctAnswer: 'A',
    hint1: "Right winger from Schalke",
    hint2: "Fast and powerful player",
    hint3: "Attacking midfielder"
  },
  {
    id: 66,
    match: "France 🇫🇷 vs Denmark 🇩🇰 - 2018 World Cup Group Stage",
    year: 2018,
    team: "Denmark",
    teamFlag: "🇩🇰",
    positions: [
      { name: "Schmeichel", flag: "🇩🇰", x: 50, y: 90 },
      { name: "Dalsgaard", flag: "🇩🇰", x: 80, y: 72 },
      { name: "Kjaer", flag: "🇩🇰", x: 65, y: 75 },
      { name: "Christensen", flag: "🇩🇰", x: 35, y: 75 },
      { name: "Larsen", flag: "🇩🇰", x: 20, y: 72 },
      { name: "Delaney", flag: "🇩🇰", x: 50, y: 55 },
      { name: "Schöne", flag: "🇩🇰", x: 65, y: 50 },
      { name: "Eriksen", flag: "🇩🇰", x: 50, y: 42 },
      { name: "Poulsen", flag: "🇩🇰", x: 75, y: 30 },
      { name: "Jørgensen", flag: "🇩🇰", x: 50, y: 18 },
      { name: "???", flag: "🇩🇰", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Braithwaite",
    optionB: "Cornelius",
    optionC: "Sisto",
    optionD: "Krohn-Dehli",
    correctAnswer: 'A',
    hint1: "Right winger from Middlesbrough",
    hint2: "Versatile forward",
    hint3: "Attacking player"
  },
  {
    id: 67,
    match: "France 🇫🇷 vs Denmark 🇩🇰 - 2018 World Cup Group Stage",
    year: 2018,
    team: "Iceland",
    teamFlag: "🇮🇸",
    positions: [
      { name: "Halldórsson", flag: "🇮🇸", x: 50, y: 90 },
      { name: "Sævarsson", flag: "🇮🇸", x: 80, y: 72 },
      { name: "R. Sigurðsson", flag: "🇮🇸", x: 65, y: 75 },
      { name: "Á. Sigurðsson", flag: "🇮🇸", x: 35, y: 75 },
      { name: "Magnússon", flag: "🇮🇸", x: 20, y: 72 },
      { name: "Gunnarsson", flag: "🇮🇸", x: 50, y: 55 },
      { name: "Hallfreðsson", flag: "🇮🇸", x: 65, y: 50 },
      { name: "Bjarnason", flag: "🇮🇸", x: 50, y: 42 },
      { name: "G. Sigurðsson", flag: "🇮🇸", x: 75, y: 30 },
      { name: "Finnbogason", flag: "🇮🇸", x: 50, y: 18 },
      { name: "???", flag: "🇮🇸", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Böðvarsson",
    optionB: "Guðmundsson",
    optionC: "Traustason",
    optionD: "Skúlason",
    correctAnswer: 'A',
    hint1: "Striker from Reading",
    hint2: "Target man",
    hint3: "Physical forward"
  },
  {
    id: 68,
    match: "France 🇫🇷 vs Denmark 🇩🇰 - 2018 World Cup Group Stage",
    year: 2018,
    team: "Poland",
    teamFlag: "🇵🇱",
    positions: [
      { name: "Szczęsny", flag: "🇵🇱", x: 50, y: 90 },
      { name: "Piszczek", flag: "🇵🇱", x: 80, y: 72 },
      { name: "Glik", flag: "🇵🇱", x: 65, y: 75 },
      { name: "Pazdan", flag: "🇵🇱", x: 35, y: 75 },
      { name: "Rybus", flag: "🇵🇱", x: 20, y: 72 },
      { name: "Krychowiak", flag: "🇵🇱", x: 50, y: 55 },
      { name: "Zieliński", flag: "🇵🇱", x: 65, y: 50 },
      { name: "Grosicki", flag: "🇵🇱", x: 75, y: 30 },
      { name: "Lewandowski", flag: "🇵🇱", x: 50, y: 42 },
      { name: "Milik", flag: "🇵🇱", x: 50, y: 18 },
      { name: "???", flag: "🇵🇱", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Błaszczykowski",
    optionB: "Kownacki",
    optionC: "Kędziora",
    optionD: "Linety",
    correctAnswer: 'A',
    hint1: "Right winger from Wolfsburg",
    hint2: "Veteran Polish player",
    hint3: "Versatile midfielder"
  },
  {
    id: 69,
    match: "France 🇫🇷 vs Denmark 🇩🇰 - 2018 World Cup Group Stage",
    year: 2018,
    team: "Colombia",
    teamFlag: "🇨🇴",
    positions: [
      { name: "Ospina", flag: "🇨🇴", x: 50, y: 90 },
      { name: "Arias", flag: "🇨🇴", x: 80, y: 72 },
      { name: "D. Sánchez", flag: "🇨🇴", x: 65, y: 75 },
      { name: "Mina", flag: "🇨🇴", x: 35, y: 75 },
      { name: "Mojica", flag: "🇨🇴", x: 20, y: 72 },
      { name: "Barrios", flag: "🇨🇴", x: 50, y: 55 },
      { name: "C. Sánchez", flag: "🇨🇴", x: 65, y: 50 },
      { name: "Quintero", flag: "🇨🇴", x: 50, y: 42 },
      { name: "Cuadrado", flag: "🇨🇴", x: 75, y: 30 },
      { name: "Falcao", flag: "🇨🇴", x: 50, y: 18 },
      { name: "???", flag: "🇨🇴", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Muriel",
    optionB: "Bacca",
    optionC: "Rodríguez",
    optionD: "Uribe",
    correctAnswer: 'A',
    hint1: "Left winger from Sevilla",
    hint2: "Fast and skillful player",
    hint3: "Attacking midfielder"
  },
  {
    id: 70,
    match: "France 🇫🇷 vs Denmark 🇩🇰 - 2018 World Cup Group Stage",
    year: 2018,
    team: "Peru",
    teamFlag: "🇵🇪",
    positions: [
      { name: "Gallese", flag: "🇵🇪", x: 50, y: 90 },
      { name: "Advíncula", flag: "🇵🇪", x: 80, y: 72 },
      { name: "Ramos", flag: "🇵🇪", x: 65, y: 75 },
      { name: "Rodríguez", flag: "🇵🇪", x: 35, y: 75 },
      { name: "Trauco", flag: "🇵🇪", x: 20, y: 72 },
      { name: "Tapia", flag: "🇵🇪", x: 50, y: 55 },
      { name: "Yotún", flag: "🇵🇪", x: 65, y: 50 },
      { name: "Cueva", flag: "🇵🇪", x: 50, y: 42 },
      { name: "Carrillo", flag: "🇵🇪", x: 75, y: 30 },
      { name: "Guerrero", flag: "🇵🇪", x: 50, y: 18 },
      { name: "???", flag: "🇵🇪", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Farfán",
    optionB: "Flores",
    optionC: "Ruidíaz",
    optionD: "Polo",
    correctAnswer: 'A',
    hint1: "Right winger from Lokomotiv",
    hint2: "Veteran Peruvian player",
    hint3: "Creative attacking player"
  },
  // LEVEL 8: 2014 World Cup Different Matches (Questions 71-80)
  {
    id: 72,
    match: "Colombia 🇨🇴 vs Brazil 🇧🇷 - 2014 World Cup Quarter-Final",
    year: 2014,
    team: "Costa Rica",
    teamFlag: "🇨🇷",
    positions: [
      { name: "Navas", flag: "🇨🇷", x: 50, y: 90 },
      { name: "Gamboa", flag: "🇨🇷", x: 80, y: 72 },
      { name: "González", flag: "🇨🇷", x: 65, y: 75 },
      { name: "Umana", flag: "🇨🇷", x: 35, y: 75 },
      { name: "Díaz", flag: "🇨🇷", x: 20, y: 72 },
      { name: "Borges", flag: "🇨🇷", x: 50, y: 55 },
      { name: "Tejeda", flag: "🇨🇷", x: 65, y: 50 },
      { name: "Ruiz", flag: "🇨🇷", x: 50, y: 42 },
      { name: "Bolaños", flag: "🇨🇷", x: 75, y: 30 },
      { name: "Campbell", flag: "🇨🇷", x: 50, y: 18 },
      { name: "???", flag: "🇨🇷", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Brenes",
    optionB: "Ureña",
    optionC: "Myrie",
    optionD: "Acosta",
    correctAnswer: 'A',
    hint1: "Left winger from Cartaginés",
    hint2: "Attacking midfielder",
    hint3: "Creative player"
  },
  {
    id: 73,
    match: "France 🇫🇷 vs Nigeria 🇳🇬 - 2014 World Cup Round of 16",
    year: 2014,
    team: "Chile",
    teamFlag: "🇨🇱",
    positions: [
      { name: "Bravo", flag: "🇨🇱", x: 50, y: 90 },
      { name: "Isla", flag: "🇨🇱", x: 80, y: 72 },
      { name: "Medel", flag: "🇨🇱", x: 65, y: 75 },
      { name: "Jara", flag: "🇨🇱", x: 35, y: 75 },
      { name: "Mena", flag: "🇨🇱", x: 20, y: 72 },
      { name: "Díaz", flag: "🇨🇱", x: 50, y: 55 },
      { name: "Aránguiz", flag: "🇨🇱", x: 65, y: 50 },
      { name: "Vidal", flag: "🇨🇱", x: 50, y: 42 },
      { name: "Sánchez", flag: "🇨🇱", x: 75, y: 30 },
      { name: "Vargas", flag: "🇨🇱", x: 50, y: 18 },
      { name: "???", flag: "🇨🇱", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Valdivia",
    optionB: "Beausejour",
    optionC: "Gutiérrez",
    optionD: "Pinilla",
    correctAnswer: 'A',
    hint1: "Attacking midfielder from Palmeiras",
    hint2: "Creative playmaker",
    hint3: "Key playmaker"
  },
  {
    id: 74,
    match: "Spain 🇪🇸 vs Netherlands 🇳🇱 - 2014 World Cup Group Stage",
    year: 2014,
    team: "Mexico",
    teamFlag: "🇲🇽",
    positions: [
      { name: "Ochoa", flag: "🇲🇽", x: 50, y: 90 },
      { name: "Aguilar", flag: "🇲🇽", x: 80, y: 72 },
      { name: "Márquez", flag: "🇲🇽", x: 65, y: 75 },
      { name: "Moreno", flag: "🇲🇽", x: 35, y: 75 },
      { name: "Layún", flag: "🇲🇽", x: 20, y: 72 },
      { name: "Herrera", flag: "🇲🇽", x: 50, y: 55 },
      { name: "Guardado", flag: "🇲🇽", x: 65, y: 50 },
      { name: "Vázquez", flag: "🇲🇽", x: 35, y: 50 },
      { name: "Dos Santos", flag: "🇲🇽", x: 75, y: 30 },
      { name: "Peralta", flag: "🇲🇽", x: 50, y: 18 },
      { name: "???", flag: "🇲🇽", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Hernández",
    optionB: "Jiménez",
    optionC: "Aquino",
    optionD: "Fabian",
    correctAnswer: 'A',
    hint1: "Striker from Manchester United",
    hint2: "Known as 'Chicharito'",
    hint3: "Clinical finisher"
  },
  {
    id: 75,
    match: "Spain 🇪🇸 vs Netherlands 🇳🇱 - 2014 World Cup Group Stage",
    year: 2014,
    team: "Uruguay",
    teamFlag: "🇺🇾",
    positions: [
      { name: "Muslera", flag: "🇺🇾", x: 50, y: 90 },
      { name: "Pereira", flag: "🇺🇾", x: 80, y: 72 },
      { name: "Lugano", flag: "🇺🇾", x: 65, y: 75 },
      { name: "Godín", flag: "🇺🇾", x: 35, y: 75 },
      { name: "Cáceres", flag: "🇺🇾", x: 20, y: 72 },
      { name: "Pérez", flag: "🇺🇾", x: 50, y: 55 },
      { name: "Ríos", flag: "🇺🇾", x: 65, y: 50 },
      { name: "Rodríguez", flag: "🇺🇾", x: 50, y: 42 },
      { name: "Cavani", flag: "🇺🇾", x: 75, y: 30 },
      { name: "Suárez", flag: "🇺🇾", x: 50, y: 18 },
      { name: "???", flag: "🇺🇾", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Forlán",
    optionB: "Stuani",
    optionC: "Hernández",
    optionD: "Lodeiro",
    correctAnswer: 'A',
    hint1: "Attacking midfielder from Internacional",
    hint2: "2010 Golden Ball winner",
    hint3: "Creative playmaker"
  },
  {
    id: 76,
    match: "Spain 🇪🇸 vs Netherlands 🇳🇱 - 2014 World Cup Group Stage",
    year: 2014,
    team: "Ghana",
    teamFlag: "🇬🇭",
    positions: [
      { name: "Dauda", flag: "🇬🇭", x: 50, y: 90 },
      { name: "Opare", flag: "🇬🇭", x: 80, y: 72 },
      { name: "Boye", flag: "🇬🇭", x: 65, y: 75 },
      { name: "Mensah", flag: "🇬🇭", x: 35, y: 75 },
      { name: "Asamoah", flag: "🇬🇭", x: 20, y: 72 },
      { name: "Rabiu", flag: "🇬🇭", x: 50, y: 55 },
      { name: "Muntari", flag: "🇬🇭", x: 65, y: 50 },
      { name: "Atsu", flag: "🇬🇭", x: 75, y: 30 },
      { name: "A. Ayew", flag: "🇬🇭", x: 50, y: 42 },
      { name: "Gyan", flag: "🇬🇭", x: 50, y: 18 },
      { name: "???", flag: "🇬🇭", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Wakaso",
    optionB: "J. Ayew",
    optionC: "Boateng",
    optionD: "Essien",
    correctAnswer: 'A',
    hint1: "Left winger from Rubin Kazan",
    hint2: "Fast and direct player",
    hint3: "Attacking midfielder"
  },
  {
    id: 77,
    match: "Spain 🇪🇸 vs Netherlands 🇳🇱 - 2014 World Cup Group Stage",
    year: 2014,
    team: "Ivory Coast",
    teamFlag: "🇨🇮",
    positions: [
      { name: "Barry", flag: "🇨🇮", x: 50, y: 90 },
      { name: "Aurier", flag: "🇨🇮", x: 80, y: 72 },
      { name: "Bamba", flag: "🇨🇮", x: 65, y: 75 },
      { name: "Zokora", flag: "🇨🇮", x: 35, y: 75 },
      { name: "Boka", flag: "🇨🇮", x: 20, y: 72 },
      { name: "Tiote", flag: "🇨🇮", x: 50, y: 55 },
      { name: "Y. Touré", flag: "🇨🇮", x: 65, y: 50 },
      { name: "S. Bamba", flag: "🇨🇮", x: 50, y: 42 },
      { name: "Gervinho", flag: "🇨🇮", x: 75, y: 30 },
      { name: "Drogba", flag: "🇨🇮", x: 50, y: 18 },
      { name: "???", flag: "🇨🇮", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Kalou",
    optionB: "Bony",
    optionC: "Gradel",
    optionD: "Die",
    correctAnswer: 'A',
    hint1: "Right winger from Lille",
    hint2: "Former Chelsea player",
    hint3: "Versatile forward"
  },
  {
    id: 78,
    match: "Spain 🇪🇸 vs Netherlands 🇳🇱 - 2014 World Cup Group Stage",
    year: 2014,
    team: "Japan",
    teamFlag: "🇯🇵",
    positions: [
      { name: "Kawashima", flag: "🇯🇵", x: 50, y: 90 },
      { name: "Uchida", flag: "🇯🇵", x: 80, y: 72 },
      { name: "Yoshida", flag: "🇯🇵", x: 65, y: 75 },
      { name: "Konno", flag: "🇯🇵", x: 35, y: 75 },
      { name: "Nagatomo", flag: "🇯🇵", x: 20, y: 72 },
      { name: "Hasebe", flag: "🇯🇵", x: 50, y: 55 },
      { name: "Yamaguchi", flag: "🇯🇵", x: 65, y: 50 },
      { name: "Honda", flag: "🇯🇵", x: 50, y: 42 },
      { name: "Kagawa", flag: "🇯🇵", x: 75, y: 30 },
      { name: "Okazaki", flag: "🇯🇵", x: 50, y: 18 },
      { name: "???", flag: "🇯🇵", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Kakitani",
    optionB: "Osako",
    optionC: "Inui",
    optionD: "Endo",
    correctAnswer: 'A',
    hint1: "Striker from Cerezo Osaka",
    hint2: "Young attacking player",
    hint3: "Clinical finisher"
  },
  {
    id: 79,
    match: "Spain 🇪🇸 vs Netherlands 🇳🇱 - 2014 World Cup Group Stage",
    year: 2014,
    team: "Ecuador",
    teamFlag: "🇪🇨",
    positions: [
      { name: "Dominguez", flag: "🇪🇨", x: 50, y: 90 },
      { name: "Paredes", flag: "🇪🇨", x: 80, y: 72 },
      { name: "Erazo", flag: "🇪🇨", x: 65, y: 75 },
      { name: "Achilier", flag: "🇪🇨", x: 35, y: 75 },
      { name: "Ayoví", flag: "🇪🇨", x: 20, y: 72 },
      { name: "Noboa", flag: "🇪🇨", x: 50, y: 55 },
      { name: "Gruezo", flag: "🇪🇨", x: 65, y: 50 },
      { name: "Valencia", flag: "🇪🇨", x: 50, y: 42 },
      { name: "Montero", flag: "🇪🇨", x: 75, y: 30 },
      { name: "E. Valencia", flag: "🇪🇨", x: 50, y: 18 },
      { name: "???", flag: "🇪🇨", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Caicedo",
    optionB: "Ibarra",
    optionC: "Aroca",
    optionD: "Bone",
    correctAnswer: 'A',
    hint1: "Right winger from Al-Jazira",
    hint2: "Fast and skillful player",
    hint3: "Attacking midfielder"
  },
  {
    id: 80,
    match: "Spain 🇪🇸 vs Netherlands 🇳🇱 - 2014 World Cup Group Stage",
    year: 2014,
    team: "Honduras",
    teamFlag: "🇭🇳",
    positions: [
      { name: "Valladares", flag: "🇭🇳", x: 50, y: 90 },
      { name: "Beckeles", flag: "🇭🇳", x: 80, y: 72 },
      { name: "Bernárdez", flag: "🇭🇳", x: 65, y: 75 },
      { name: "Figueroa", flag: "🇭🇳", x: 35, y: 75 },
      { name: "Izaguirre", flag: "🇭🇳", x: 20, y: 72 },
      { name: "Garrido", flag: "🇭🇳", x: 50, y: 55 },
      { name: "Claros", flag: "🇭🇳", x: 65, y: 50 },
      { name: "Espinoza", flag: "🇭🇳", x: 50, y: 42 },
      { name: "García", flag: "🇭🇳", x: 75, y: 30 },
      { name: "Bengtson", flag: "🇭🇳", x: 50, y: 18 },
      { name: "???", flag: "🇭🇳", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Costly",
    optionB: "Palacios",
    optionC: "Najar",
    optionD: "Chávez",
    correctAnswer: 'A',
    hint1: "Striker from Real España",
    hint2: "Target man",
    hint3: "Physical forward"
  },
  // LEVEL 9: 2010 World Cup Different Matches (Questions 81-90)
  {
    id: 81,
    match: "Germany 🇩🇪 vs Spain 🇪🇸 - 2010 World Cup Semi-Final",
    year: 2010,
    team: "Uruguay",
    teamFlag: "🇺🇾",
    positions: [
      { name: "Muslera", flag: "🇺🇾", x: 50, y: 90 },
      { name: "Pereira", flag: "🇺🇾", x: 80, y: 72 },
      { name: "Lugano", flag: "🇺🇾", x: 65, y: 75 },
      { name: "Godín", flag: "🇺🇾", x: 35, y: 75 },
      { name: "Fucile", flag: "🇺🇾", x: 20, y: 72 },
      { name: "Pérez", flag: "🇺🇾", x: 50, y: 55 },
      { name: "Arévalo", flag: "🇺🇾", x: 65, y: 50 },
      { name: "Forlán", flag: "🇺🇾", x: 50, y: 42 },
      { name: "Cavani", flag: "🇺🇾", x: 75, y: 30 },
      { name: "Suárez", flag: "🇺🇾", x: 50, y: 18 },
      { name: "???", flag: "🇺🇾", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Rodríguez",
    optionB: "Fernández",
    optionC: "González",
    optionD: "Gargano",
    correctAnswer: 'A',
    hint1: "Right winger from Porto",
    hint2: "Provided width on the right",
    hint3: "Attacking midfielder"
  },
  {
    id: 82,
    match: "Uruguay 🇺🇾 vs Ghana 🇬🇭 - 2010 World Cup Quarter-Final",
    year: 2010,
    team: "Ghana",
    teamFlag: "🇬🇭",
    positions: [
      { name: "Kingson", flag: "🇬🇭", x: 50, y: 90 },
      { name: "Paintsil", flag: "🇬🇭", x: 80, y: 72 },
      { name: "Mensah", flag: "🇬🇭", x: 65, y: 75 },
      { name: "Vorsah", flag: "🇬🇭", x: 35, y: 75 },
      { name: "Sarpei", flag: "🇬🇭", x: 20, y: 72 },
      { name: "Annan", flag: "🇬🇭", x: 50, y: 55 },
      { name: "Inkoom", flag: "🇬🇭", x: 65, y: 50 },
      { name: "A. Ayew", flag: "🇬🇭", x: 50, y: 42 },
      { name: "Tagoe", flag: "🇬🇭", x: 75, y: 30 },
      { name: "Gyan", flag: "🇬🇭", x: 50, y: 18 },
      { name: "???", flag: "🇬🇭", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Muntari",
    optionB: "Essien",
    optionC: "Boateng",
    optionD: "Appiah",
    correctAnswer: 'A',
    hint1: "Central midfielder from Inter Milan",
    hint2: "Physical and combative player",
    hint3: "Defensive midfielder"
  },
  {
    id: 83,
    match: "Brazil 🇧🇷 vs Chile 🇨🇱 - 2010 World Cup Round of 16",
    year: 2010,
    team: "South Korea",
    teamFlag: "🇰🇷",
    positions: [
      { name: "Jung S.R.", flag: "🇰🇷", x: 50, y: 90 },
      { name: "Cha D.R.", flag: "🇰🇷", x: 80, y: 72 },
      { name: "Lee J.S.", flag: "🇰🇷", x: 65, y: 75 },
      { name: "Cho Y.H.", flag: "🇰🇷", x: 35, y: 75 },
      { name: "Lee Y.P.", flag: "🇰🇷", x: 20, y: 72 },
      { name: "Ki S.Y.", flag: "🇰🇷", x: 50, y: 55 },
      { name: "Kim J.W.", flag: "🇰🇷", x: 65, y: 50 },
      { name: "Park J.S.", flag: "🇰🇷", x: 50, y: 42 },
      { name: "Lee D.G.", flag: "🇰🇷", x: 75, y: 30 },
      { name: "Park C.Y.", flag: "🇰🇷", x: 50, y: 18 },
      { name: "???", flag: "🇰🇷", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Yeom K.H.",
    optionB: "Kim N.I.",
    optionC: "Lee K.H.",
    optionD: "Kim S.W.",
    correctAnswer: 'A',
    hint1: "Right winger from Suwon",
    hint2: "Fast and direct player",
    hint3: "Attacking midfielder"
  },
  {
    id: 84,
    match: "Argentina 🇦🇷 vs Germany 🇩🇪 - 2010 World Cup Group Stage",
    year: 2010,
    team: "Japan",
    teamFlag: "🇯🇵",
    positions: [
      { name: "Kawashima", flag: "🇯🇵", x: 50, y: 90 },
      { name: "Uchida", flag: "🇯🇵", x: 80, y: 72 },
      { name: "Nakazawa", flag: "🇯🇵", x: 65, y: 75 },
      { name: "Tanaka", flag: "🇯🇵", x: 35, y: 75 },
      { name: "Nagatomo", flag: "🇯🇵", x: 20, y: 72 },
      { name: "Abe", flag: "🇯🇵", x: 50, y: 55 },
      { name: "Hasebe", flag: "🇯🇵", x: 65, y: 50 },
      { name: "Honda", flag: "🇯🇵", x: 50, y: 42 },
      { name: "Matsui", flag: "🇯🇵", x: 75, y: 30 },
      { name: "Okazaki", flag: "🇯🇵", x: 50, y: 18 },
      { name: "???", flag: "🇯🇵", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Kagawa",
    optionB: "Endo",
    optionC: "Inamoto",
    optionD: "Nakamura",
    correctAnswer: 'A',
    hint1: "Attacking midfielder from Dortmund",
    hint2: "Creative playmaker",
    hint3: "Key playmaker"
  },
  {
    id: 85,
    match: "Argentina 🇦🇷 vs Germany 🇩🇪 - 2010 World Cup Group Stage",
    year: 2010,
    team: "Australia",
    teamFlag: "🇦🇺",
    positions: [
      { name: "Schwarzer", flag: "🇦🇺", x: 50, y: 90 },
      { name: "Wilkshire", flag: "🇦🇺", x: 80, y: 72 },
      { name: "Moore", flag: "🇦🇺", x: 65, y: 75 },
      { name: "Neill", flag: "🇦🇺", x: 35, y: 75 },
      { name: "Chipperfield", flag: "🇦🇺", x: 20, y: 72 },
      { name: "Valeri", flag: "🇦🇺", x: 50, y: 55 },
      { name: "Grella", flag: "🇦🇺", x: 65, y: 50 },
      { name: "Culina", flag: "🇦🇺", x: 35, y: 50 },
      { name: "Bresciano", flag: "🇦🇺", x: 75, y: 30 },
      { name: "Kewell", flag: "🇦🇺", x: 50, y: 18 },
      { name: "???", flag: "🇦🇺", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Cahill",
    optionB: "Kennedy",
    optionC: "Rukavytsya",
    optionD: "Holman",
    correctAnswer: 'A',
    hint1: "Attacking midfielder from Everton",
    hint2: "Australia's all-time top scorer",
    hint3: "Box-to-box midfielder"
  },
  {
    id: 86,
    match: "Argentina 🇦🇷 vs Germany 🇩🇪 - 2010 World Cup Group Stage",
    year: 2010,
    team: "South Africa",
    teamFlag: "🇿🇦",
    positions: [
      { name: "Josephs", flag: "🇿🇦", x: 50, y: 90 },
      { name: "Gaxa", flag: "🇿🇦", x: 80, y: 72 },
      { name: "Mokoena", flag: "🇿🇦", x: 65, y: 75 },
      { name: "Khumalo", flag: "🇿🇦", x: 35, y: 75 },
      { name: "Masilela", flag: "🇿🇦", x: 20, y: 72 },
      { name: "Dikgacoi", flag: "🇿🇦", x: 50, y: 55 },
      { name: "Letsholonyane", flag: "🇿🇦", x: 65, y: 50 },
      { name: "Tshabalala", flag: "🇿🇦", x: 50, y: 42 },
      { name: "Modise", flag: "🇿🇦", x: 75, y: 30 },
      { name: "Parker", flag: "🇿🇦", x: 50, y: 18 },
      { name: "???", flag: "🇿🇦", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Mphela",
    optionB: "Nomvethe",
    optionC: "Pienaar",
    optionD: "Khumalo",
    correctAnswer: 'A',
    hint1: "Striker from Mamelodi Sundowns",
    hint2: "Clinical finisher",
    hint3: "Target man"
  },
  {
    id: 87,
    match: "Argentina 🇦🇷 vs Germany 🇩🇪 - 2010 World Cup Group Stage",
    year: 2010,
    team: "Nigeria",
    teamFlag: "🇳🇬",
    positions: [
      { name: "Enyeama", flag: "🇳🇬", x: 50, y: 90 },
      { name: "Odiah", flag: "🇳🇬", x: 80, y: 72 },
      { name: "Yobo", flag: "🇳🇬", x: 65, y: 75 },
      { name: "Shittu", flag: "🇳🇬", x: 35, y: 75 },
      { name: "Taiwo", flag: "🇳🇬", x: 20, y: 72 },
      { name: "Etuhu", flag: "🇳🇬", x: 50, y: 55 },
      { name: "Haruna", flag: "🇳🇬", x: 65, y: 50 },
      { name: "Yakubu", flag: "🇳🇬", x: 50, y: 18 },
      { name: "Obasi", flag: "🇳🇬", x: 75, y: 30 },
      { name: "Martins", flag: "🇳🇬", x: 25, y: 30 },
      { name: "???", flag: "🇳🇬", x: 50, y: 42 },
    ],
    missingIndex: 7,
    optionA: "Kanu",
    optionB: "Uche",
    optionC: "Odemwingie",
    optionD: "Aiyegbeni",
    correctAnswer: 'A',
    hint1: "Attacking midfielder and Nigeria legend",
    hint2: "Former Arsenal player",
    hint3: "Creative playmaker"
  },
  {
    id: 88,
    match: "Argentina 🇦🇷 vs Germany 🇩🇪 - 2010 World Cup Group Stage",
    year: 2010,
    team: "Cameroon",
    teamFlag: "🇨🇲",
    positions: [
      { name: "Souleymanou", flag: "🇨🇲", x: 50, y: 90 },
      { name: "Assou-Ekotto", flag: "🇨🇲", x: 80, y: 72 },
      { name: "Bassong", flag: "🇨🇲", x: 65, y: 75 },
      { name: "N'Koulou", flag: "🇨🇲", x: 35, y: 75 },
      { name: "Eto'o", flag: "🇨🇲", x: 50, y: 42 },
      { name: "Mbia", flag: "🇨🇲", x: 50, y: 55 },
      { name: "Makoun", flag: "🇨🇲", x: 65, y: 50 },
      { name: "Matip", flag: "🇨🇲", x: 35, y: 50 },
      { name: "Emana", flag: "🇨🇲", x: 75, y: 30 },
      { name: "Wébo", flag: "🇨🇲", x: 50, y: 18 },
      { name: "???", flag: "🇨🇲", x: 20, y: 72 },
    ],
    missingIndex: 10,
    optionA: "Biya",
    optionB: "N'Djeng",
    optionC: "Idrissou",
    optionD: "Choupo-Moting",
    correctAnswer: 'A',
    hint1: "Left-back from Valenciennes",
    hint2: "Defensive full-back",
    hint3: "Versatile defender"
  },
  {
    id: 89,
    match: "Argentina 🇦🇷 vs Germany 🇩🇪 - 2010 World Cup Group Stage",
    year: 2010,
    team: "Algeria",
    teamFlag: "🇩🇿",
    positions: [
      { name: "Chaouchi", flag: "🇩🇿", x: 50, y: 90 },
      { name: "Bougherra", flag: "🇩🇿", x: 70, y: 75 },
      { name: "Halliche", flag: "🇩🇿", x: 50, y: 75 },
      { name: "Yahia", flag: "🇩🇿", x: 30, y: 75 },
      { name: "Belhadj", flag: "🇩🇿", x: 20, y: 72 },
      { name: "Lacen", flag: "🇩🇿", x: 50, y: 55 },
      { name: "Yebda", flag: "🇩🇿", x: 65, y: 50 },
      { name: "Ziani", flag: "🇩🇿", x: 50, y: 42 },
      { name: "Kadir", flag: "🇩🇿", x: 75, y: 30 },
      { name: "Djebbour", flag: "🇩🇿", x: 50, y: 18 },
      { name: "???", flag: "🇩🇿", x: 80, y: 72 },
    ],
    missingIndex: 10,
    optionA: "Kadri",
    optionB: "Guedioura",
    optionC: "Matmour",
    optionD: "Saifi",
    correctAnswer: 'A',
    hint1: "Right-back from Setif",
    hint2: "Defensive full-back",
    hint3: "Versatile defender"
  },
  {
    id: 90,
    match: "Argentina 🇦🇷 vs Germany 🇩🇪 - 2010 World Cup Group Stage",
    year: 2010,
    team: "Slovenia",
    teamFlag: "🇸🇮",
    positions: [
      { name: "Handanovič", flag: "🇸🇮", x: 50, y: 90 },
      { name: "Brečko", flag: "🇸🇮", x: 80, y: 72 },
      { name: "Šuler", flag: "🇸🇮", x: 65, y: 75 },
      { name: "Cesar", flag: "🇸🇮", x: 35, y: 75 },
      { name: "Jokić", flag: "🇸🇮", x: 20, y: 72 },
      { name: "Radosavljevič", flag: "🇸🇮", x: 50, y: 55 },
      { name: "Koren", flag: "🇸🇮", x: 65, y: 50 },
      { name: "Birsa", flag: "🇸🇮", x: 50, y: 42 },
      { name: "Kirm", flag: "🇸🇮", x: 75, y: 30 },
      { name: "Dedič", flag: "🇸🇮", x: 50, y: 18 },
      { name: "???", flag: "🇸🇮", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Novakovič",
    optionB: "Ljubijankič",
    optionC: "Matavž",
    optionD: "Pecnik",
    correctAnswer: 'A',
    hint1: "Striker from Köln",
    hint2: "Slovenia's all-time top scorer",
    hint3: "Clinical finisher"
  },
  // LEVEL 10: 2006 World Cup Different Matches (Questions 91-100)
  {
    id: 91,
    match: "Germany 🇩🇪 vs Italy 🇮🇹 - 2006 World Cup Semi-Final",
    year: 2006,
    team: "Portugal",
    teamFlag: "🇵🇹",
    positions: [
      { name: "Ricardo", flag: "🇵🇹", x: 50, y: 90 },
      { name: "Miguel", flag: "🇵🇹", x: 80, y: 72 },
      { name: "Carvalho", flag: "🇵🇹", x: 65, y: 75 },
      { name: "Meira", flag: "🇵🇹", x: 35, y: 75 },
      { name: "Valente", flag: "🇵🇹", x: 20, y: 72 },
      { name: "Costinha", flag: "🇵🇹", x: 50, y: 55 },
      { name: "Maniche", flag: "🇵🇹", x: 65, y: 50 },
      { name: "Deco", flag: "🇵🇹", x: 50, y: 42 },
      { name: "Ronaldo", flag: "🇵🇹", x: 75, y: 30 },
      { name: "Pauleta", flag: "🇵🇹", x: 50, y: 18 },
      { name: "???", flag: "🇵🇹", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Figo",
    optionB: "Simão",
    optionC: "Nani",
    optionD: "Postiga",
    correctAnswer: 'A',
    hint1: "Right winger and Portugal legend",
    hint2: "Real Madrid and Barcelona player",
    hint3: "2000 Ballon d'Or winner"
  },
  {
    id: 92,
    match: "Brazil 🇧🇷 vs France 🇫🇷 - 2006 World Cup Quarter-Final",
    year: 2006,
    team: "Ukraine",
    teamFlag: "🇺🇦",
    positions: [
      { name: "Shovkovskiy", flag: "🇺🇦", x: 50, y: 90 },
      { name: "Nesmachniy", flag: "🇺🇦", x: 80, y: 72 },
      { name: "Rusol", flag: "🇺🇦", x: 65, y: 75 },
      { name: "Sviderskiy", flag: "🇺🇦", x: 35, y: 75 },
      { name: "Shelayev", flag: "🇺🇦", x: 20, y: 72 },
      { name: "Tymoshchuk", flag: "🇺🇦", x: 50, y: 55 },
      { name: "Shelayev", flag: "🇺🇦", x: 65, y: 50 },
      { name: "Gusin", flag: "🇺🇦", x: 50, y: 42 },
      { name: "Rotan", flag: "🇺🇦", x: 75, y: 30 },
      { name: "Shevchenko", flag: "🇺🇦", x: 50, y: 18 },
      { name: "???", flag: "🇺🇦", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Voronin",
    optionB: "Rebrov",
    optionC: "Nazarenko",
    optionD: "Milevskiy",
    correctAnswer: 'A',
    hint1: "Striker from Bayer Leverkusen",
    hint2: "Target man",
    hint3: "Physical forward"
  },
  {
    id: 93,
    match: "Spain 🇪🇸 vs France 🇫🇷 - 2006 World Cup Round of 16",
    year: 2006,
    team: "Sweden",
    teamFlag: "🇸🇪",
    positions: [
      { name: "Isaksson", flag: "🇸🇪", x: 50, y: 90 },
      { name: "Lucid", flag: "🇸🇪", x: 80, y: 72 },
      { name: "Mellberg", flag: "🇸🇪", x: 65, y: 75 },
      { name: "Edman", flag: "🇸🇪", x: 35, y: 75 },
      { name: "Nilsson", flag: "🇸🇪", x: 20, y: 72 },
      { name: "Linderoth", flag: "🇸🇪", x: 50, y: 55 },
      { name: "Ljungberg", flag: "🇸🇪", x: 65, y: 50 },
      { name: "Källström", flag: "🇸🇪", x: 50, y: 42 },
      { name: "Wilhelmsson", flag: "🇸🇪", x: 75, y: 30 },
      { name: "Ibrahimović", flag: "🇸🇪", x: 50, y: 18 },
      { name: "???", flag: "🇸🇪", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Larsson",
    optionB: "Allbäck",
    optionC: "Rosenberg",
    optionD: "Elmander",
    correctAnswer: 'A',
    hint1: "Striker from Barcelona",
    hint2: "Sweden's all-time top scorer",
    hint3: "Veteran forward"
  },
  {
    id: 94,
    match: "Argentina 🇦🇷 vs Mexico 🇲🇽 - 2006 World Cup Group Stage",
    year: 2006,
    team: "Croatia",
    teamFlag: "🇭🇷",
    positions: [
      { name: "Pletikosa", flag: "🇭🇷", x: 50, y: 90 },
      { name: "Simić", flag: "🇭🇷", x: 70, y: 75 },
      { name: "R. Kovač", flag: "🇭🇷", x: 50, y: 75 },
      { name: "Šimić", flag: "🇭🇷", x: 30, y: 75 },
      { name: "Babić", flag: "🇭🇷", x: 20, y: 72 },
      { name: "N. Kovač", flag: "🇭🇷", x: 50, y: 55 },
      { name: "Tudor", flag: "🇭🇷", x: 65, y: 50 },
      { name: "Srna", flag: "🇭🇷", x: 80, y: 72 },
      { name: "Kranjčar", flag: "🇭🇷", x: 50, y: 42 },
      { name: "Pršo", flag: "🇭🇷", x: 50, y: 18 },
      { name: "???", flag: "🇭🇷", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Olić",
    optionB: "Klasnić",
    optionC: "Balaban",
    optionD: "Petrić",
    correctAnswer: 'A',
    hint1: "Left winger from CSKA Moscow",
    hint2: "Fast and direct player",
    hint3: "Attacking midfielder"
  },
  {
    id: 95,
    match: "Argentina 🇦🇷 vs Mexico 🇲🇽 - 2006 World Cup Group Stage",
    year: 2006,
    team: "Serbia & Montenegro",
    teamFlag: "🇷🇸",
    positions: [
      { name: "Jevrić", flag: "🇷🇸", x: 50, y: 90 },
      { name: "Duljaj", flag: "🇷🇸", x: 80, y: 72 },
      { name: "Gavrančić", flag: "🇷🇸", x: 65, y: 75 },
      { name: "Krstičić", flag: "🇷🇸", x: 35, y: 75 },
      { name: "Dragutinović", flag: "🇷🇸", x: 20, y: 72 },
      { name: "Stanković", flag: "🇷🇸", x: 50, y: 55 },
      { name: "Koroman", flag: "🇷🇸", x: 65, y: 50 },
      { name: "Nadoveza", flag: "🇷🇸", x: 50, y: 42 },
      { name: "Janković", flag: "🇷🇸", x: 75, y: 30 },
      { name: "Kežman", flag: "🇷🇸", x: 50, y: 18 },
      { name: "???", flag: "🇷🇸", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Ilić",
    optionB: "Vidić",
    optionC: "Žigić",
    optionD: "Lazović",
    correctAnswer: 'A',
    hint1: "Right winger from Galatasaray",
    hint2: "Fast and skillful player",
    hint3: "Attacking midfielder"
  },
  {
    id: 96,
    match: "Argentina 🇦🇷 vs Mexico 🇲🇽 - 2006 World Cup Group Stage",
    year: 2006,
    team: "Tunisia",
    teamFlag: "🇹🇳",
    positions: [
      { name: "Boumnijel", flag: "🇹🇳", x: 50, y: 90 },
      { name: "Haggui", flag: "🇹🇳", x: 70, y: 75 },
      { name: "Jaïdi", flag: "🇹🇳", x: 50, y: 75 },
      { name: "Trabelsi", flag: "🇹🇳", x: 30, y: 75 },
      { name: "Haggui", flag: "🇹🇳", x: 20, y: 72 },
      { name: "Namouchi", flag: "🇹🇳", x: 50, y: 55 },
      { name: "Mnari", flag: "🇹🇳", x: 65, y: 50 },
      { name: "Bouazizi", flag: "🇹🇳", x: 50, y: 42 },
      { name: "Chedli", flag: "🇹🇳", x: 75, y: 30 },
      { name: "Jaziri", flag: "🇹🇳", x: 50, y: 18 },
      { name: "???", flag: "🇹🇳", x: 80, y: 72 },
    ],
    missingIndex: 10,
    optionA: "Jemâa",
    optionB: "Santos",
    optionC: "Ben Saada",
    optionD: "Essediri",
    correctAnswer: 'A',
    hint1: "Right-back from Lens",
    hint2: "Defensive full-back",
    hint3: "Versatile defender"
  },
  {
    id: 97,
    match: "Argentina 🇦🇷 vs Mexico 🇲🇽 - 2006 World Cup Group Stage",
    year: 2006,
    team: "Iran",
    teamFlag: "🇮🇷",
    positions: [
      { name: "Mirzapour", flag: "🇮🇷", x: 50, y: 90 },
      { name: "Mahdavikia", flag: "🇮🇷", x: 80, y: 72 },
      { name: "Rezaei", flag: "🇮🇷", x: 65, y: 75 },
      { name: "Nosrati", flag: "🇮🇷", x: 35, y: 75 },
      { name: "Zareh", flag: "🇮🇷", x: 20, y: 72 },
      { name: "Nekounam", flag: "🇮🇷", x: 50, y: 55 },
      { name: "Teymourian", flag: "🇮🇷", x: 65, y: 50 },
      { name: "Karimi", flag: "🇮🇷", x: 50, y: 42 },
      { name: "Zandi", flag: "🇮🇷", x: 75, y: 30 },
      { name: "Hashemian", flag: "🇮🇷", x: 50, y: 18 },
      { name: "???", flag: "🇮🇷", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Daei",
    optionB: "Enayati",
    optionC: "Khatibi",
    optionD: "Boroumand",
    correctAnswer: 'A',
    hint1: "Striker and Iran's all-time top scorer",
    hint2: "Veteran forward",
    hint3: "Clinical finisher"
  },
  {
    id: 98,
    match: "Argentina 🇦🇷 vs Mexico 🇲🇽 - 2006 World Cup Group Stage",
    year: 2006,
    team: "Saudi Arabia",
    teamFlag: "🇸🇦",
    positions: [
      { name: "Zaid", flag: "🇸🇦", x: 50, y: 90 },
      { name: "Al-Khathran", flag: "🇸🇦", x: 80, y: 72 },
      { name: "Al-Montashari", flag: "🇸🇦", x: 65, y: 75 },
      { name: "Al-Qadi", flag: "🇸🇦", x: 35, y: 75 },
      { name: "Al-Dosari", flag: "🇸🇦", x: 20, y: 72 },
      { name: "Al-Ghamdi", flag: "🇸🇦", x: 50, y: 55 },
      { name: "Al-Shalhoub", flag: "🇸🇦", x: 65, y: 50 },
      { name: "Al-Jaber", flag: "🇸🇦", x: 50, y: 42 },
      { name: "Al-Harbi", flag: "🇸🇦", x: 75, y: 30 },
      { name: "Al-Kahtani", flag: "🇸🇦", x: 50, y: 18 },
      { name: "???", flag: "🇸🇦", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Al-Mutairi",
    optionB: "Al-Fraidi",
    optionC: "Al-Mousa",
    optionD: "Al-Shehri",
    correctAnswer: 'A',
    hint1: "Right winger from Al-Ittihad",
    hint2: "Fast and direct player",
    hint3: "Attacking midfielder"
  },
  {
    id: 99,
    match: "Argentina 🇦🇷 vs Mexico 🇲🇽 - 2006 World Cup Group Stage",
    year: 2006,
    team: "Togo",
    teamFlag: "🇹🇬",
    positions: [
      { name: "Agassa", flag: "🇹🇬", x: 50, y: 90 },
      { name: "Nibombé", flag: "🇹🇬", x: 80, y: 72 },
      { name: "Adebayor", flag: "🇹🇬", x: 50, y: 42 },
      { name: "Assemoassa", flag: "🇹🇬", x: 65, y: 75 },
      { name: "Tchangai", flag: "🇹🇬", x: 35, y: 75 },
      { name: "Dossevi", flag: "🇹🇬", x: 20, y: 72 },
      { name: "Salifou", flag: "🇹🇬", x: 50, y: 55 },
      { name: "Adekor", flag: "🇹🇬", x: 65, y: 50 },
      { name: "Mamah", flag: "🇹🇬", x: 50, y: 18 },
      { name: "Kader", flag: "🇹🇬", x: 75, y: 30 },
      { name: "???", flag: "🇹🇬", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Senaya",
    optionB: "Forson",
    optionC: "Olufade",
    optionD: "Coubadja",
    correctAnswer: 'A',
    hint1: "Left winger from Mons",
    hint2: "Fast and skillful player",
    hint3: "Attacking midfielder"
  },
  {
    id: 100,
    match: "Argentina 🇦🇷 vs Mexico 🇲🇽 - 2006 World Cup Group Stage",
    year: 2006,
    team: "Trinidad & Tobago",
    teamFlag: "🇹🇹",
    positions: [
      { name: "Hislop", flag: "🇹🇹", x: 50, y: 90 },
      { name: "Gray", flag: "🇹🇹", x: 80, y: 72 },
      { name: "Lawrence", flag: "🇹🇹", x: 65, y: 75 },
      { name: "Sancho", flag: "🇹🇹", x: 35, y: 75 },
      { name: "A. John", flag: "🇹🇹", x: 20, y: 72 },
      { name: "Birchall", flag: "🇹🇹", x: 50, y: 55 },
      { name: "Whitley", flag: "🇹🇹", x: 65, y: 50 },
      { name: "Yorke", flag: "🇹🇹", x: 50, y: 42 },
      { name: "Edwards", flag: "🇹🇹", x: 75, y: 30 },
      { name: "Stern John", flag: "🇹🇹", x: 50, y: 18 },
      { name: "???", flag: "🇹🇹", x: 25, y: 30 },
    ],
    missingIndex: 10,
    optionA: "Jones",
    optionB: "Glen",
    optionC: "Samuel",
    optionD: "Theobald",
    correctAnswer: 'A',
    hint1: "Right winger from Southampton",
    hint2: "Fast and direct player",
    hint3: "Attacking midfielder"
  },
  // LEVEL 11-17: Medium Mode - Single Missing Player (Questions 101-170)
  // (Add more questions here as needed)
  
  // LEVEL 18-20: Medium Mode - Two Missing Players (3 questions per level)
  // Starting from level 18, 3 questions per level have TWO missing players
  // Level 18: Questions 171-173 (3 two-missing-player questions)
  {
    id: 171,
    match: "Morocco 🇲🇦 vs Portugal 🇵🇹 - 2022 World Cup Quarter-Final",
    year: 2022,
    team: "Morocco",
    teamFlag: "🇲🇦",
    positions: [
      { name: "Bounou", flag: "🇲🇦", x: 50, y: 90 },
      { name: "Hakimi", flag: "🇲🇦", x: 80, y: 72 },
      { name: "Saïss", flag: "🇲🇦", x: 65, y: 75 },
      { name: "Aguerd", flag: "🇲🇦", x: 35, y: 75 },
      { name: "Mazraoui", flag: "🇲🇦", x: 20, y: 72 },
      { name: "Amrabat", flag: "🇲🇦", x: 50, y: 55 },
      { name: "Amallah", flag: "🇲🇦", x: 65, y: 50 },
      { name: "???", flag: "🇲🇦", x: 35, y: 50 },
      { name: "Ziyech", flag: "🇲🇦", x: 75, y: 30 },
      { name: "En-Nesyri", flag: "🇲🇦", x: 50, y: 18 },
      { name: "???", flag: "🇲🇦", x: 25, y: 30 },
    ],
    missingIndex: 7,
    missingIndex2: 10,
    optionA: "Ounahi & Boufal",
    optionB: "Ounahi & Sabiri",
    optionC: "Boufal & Sabiri",
    optionD: "Ounahi & El Yamiq",
    correctAnswer: 'A',
    hint1: "Angers midfielder and Angers winger",
    hint2: "Both key in Morocco's historic run",
    hint3: "Important creative players"
  },
  {
    id: 172,
    match: "Senegal 🇸🇳 vs England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 - 2022 World Cup Round of 16",
    year: 2022,
    team: "Senegal",
    teamFlag: "🇸🇳",
    positions: [
      { name: "E. Mendy", flag: "🇸🇳", x: 50, y: 90 },
      { name: "Sabaly", flag: "🇸🇳", x: 80, y: 72 },
      { name: "Koulibaly", flag: "🇸🇳", x: 65, y: 75 },
      { name: "Diallo", flag: "🇸🇳", x: 35, y: 75 },
      { name: "Jakobs", flag: "🇸🇳", x: 20, y: 72 },
      { name: "Gueye", flag: "🇸🇳", x: 50, y: 55 },
      { name: "Ciss", flag: "🇸🇳", x: 65, y: 50 },
      { name: "???", flag: "🇸🇳", x: 35, y: 50 },
      { name: "???", flag: "🇸🇳", x: 75, y: 30 },
      { name: "Sarr", flag: "🇸🇳", x: 50, y: 18 },
      { name: "Dieng", flag: "🇸🇳", x: 25, y: 30 },
    ],
    missingIndex: 7,
    missingIndex2: 8,
    optionA: "Ndiaye & Dia",
    optionB: "Ndiaye & Diedhiou",
    optionC: "Dia & Diedhiou",
    optionD: "Ndiaye & Diatta",
    correctAnswer: 'A',
    hint1: "Marseille forward and Salernitana striker",
    hint2: "Both key attacking players",
    hint3: "Senegal's main threats"
  },
  {
    id: 173,
    match: "South Korea 🇰🇷 vs Brazil 🇧🇷 - 2022 World Cup Round of 16",
    year: 2022,
    team: "South Korea",
    teamFlag: "🇰🇷",
    positions: [
      { name: "Kim Seung-gyu", flag: "🇰🇷", x: 50, y: 90 },
      { name: "Kim Moon-hwan", flag: "🇰🇷", x: 80, y: 72 },
      { name: "Kim Young-gwon", flag: "🇰🇷", x: 65, y: 75 },
      { name: "Kim Min-jae", flag: "🇰🇷", x: 35, y: 75 },
      { name: "Kim Jin-su", flag: "🇰🇷", x: 20, y: 72 },
      { name: "Jung Woo-young", flag: "🇰🇷", x: 50, y: 55 },
      { name: "Hwang In-beom", flag: "🇰🇷", x: 65, y: 50 },
      { name: "???", flag: "🇰🇷", x: 35, y: 50 },
      { name: "???", flag: "🇰🇷", x: 75, y: 30 },
      { name: "Cho Gue-sung", flag: "🇰🇷", x: 50, y: 18 },
      { name: "Lee Jae-sung", flag: "🇰🇷", x: 25, y: 30 },
    ],
    missingIndex: 7,
    missingIndex2: 8,
    optionA: "Son & Hwang Hee-chan",
    optionB: "Son & Na",
    optionC: "Hwang Hee-chan & Na",
    optionD: "Son & Paik",
    correctAnswer: 'A',
    hint1: "Tottenham forward and Wolves winger",
    hint2: "Both key attacking players",
    hint3: "South Korea's main threats"
  },
  // Level 19: Questions 174-176 (3 two-missing-player questions)
  {
    id: 174,
    match: "Colombia 🇨🇴 vs England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 - 2018 World Cup Round of 16",
    year: 2018,
    team: "Colombia",
    teamFlag: "🇨🇴",
    positions: [
      { name: "Ospina", flag: "🇨🇴", x: 50, y: 90 },
      { name: "Arias", flag: "🇨🇴", x: 80, y: 72 },
      { name: "D. Sánchez", flag: "🇨🇴", x: 65, y: 75 },
      { name: "Mina", flag: "🇨🇴", x: 35, y: 75 },
      { name: "Mojica", flag: "🇨🇴", x: 20, y: 72 },
      { name: "Barrios", flag: "🇨🇴", x: 50, y: 55 },
      { name: "Lerma", flag: "🇨🇴", x: 65, y: 50 },
      { name: "???", flag: "🇨🇴", x: 35, y: 50 },
      { name: "???", flag: "🇨🇴", x: 75, y: 30 },
      { name: "Falcao", flag: "🇨🇴", x: 50, y: 18 },
      { name: "Cuadrado", flag: "🇨🇴", x: 25, y: 30 },
    ],
    missingIndex: 7,
    missingIndex2: 8,
    optionA: "Quintero & Rodríguez",
    optionB: "Quintero & Bacca",
    optionC: "Rodríguez & Bacca",
    optionD: "Quintero & Muriel",
    correctAnswer: 'A',
    hint1: "River Plate playmaker and Bayern midfielder",
    hint2: "Both creative attacking players",
    hint3: "Colombia's key playmakers"
  },
  {
    id: 175,
    match: "Russia 🇷🇺 vs Croatia 🇭🇷 - 2018 World Cup Quarter-Final",
    year: 2018,
    team: "Russia",
    teamFlag: "🇷🇺",
    positions: [
      { name: "Akinfeev", flag: "🇷🇺", x: 50, y: 90 },
      { name: "Fernandes", flag: "🇷🇺", x: 80, y: 72 },
      { name: "Kutepov", flag: "🇷🇺", x: 65, y: 75 },
      { name: "Ignashevich", flag: "🇷🇺", x: 35, y: 75 },
      { name: "Zhirkov", flag: "🇷🇺", x: 20, y: 72 },
      { name: "Zobnin", flag: "🇷🇺", x: 50, y: 55 },
      { name: "Kuziaev", flag: "🇷🇺", x: 65, y: 50 },
      { name: "???", flag: "🇷🇺", x: 35, y: 50 },
      { name: "???", flag: "🇷🇺", x: 75, y: 30 },
      { name: "Dzyuba", flag: "🇷🇺", x: 50, y: 18 },
      { name: "Smolov", flag: "🇷🇺", x: 25, y: 30 },
    ],
    missingIndex: 7,
    missingIndex2: 8,
    optionA: "Golovin & Cheryshev",
    optionB: "Golovin & Samedov",
    optionC: "Cheryshev & Samedov",
    optionD: "Golovin & Miranchuk",
    correctAnswer: 'A',
    hint1: "Monaco midfielder and Villarreal winger",
    hint2: "Both key attacking players",
    hint3: "Russia's main creative threats"
  },
  {
    id: 176,
    match: "Brazil 🇧🇷 vs France 🇫🇷 - 1998 World Cup Final",
    year: 1998,
    team: "Brazil",
    teamFlag: "🇧🇷",
    positions: [
      { name: "Taffarel", flag: "🇧🇷", x: 50, y: 90 },
      { name: "Cafu", flag: "🇧🇷", x: 80, y: 72 },
      { name: "Aldair", flag: "🇧🇷", x: 65, y: 75 },
      { name: "Baiano", flag: "🇧🇷", x: 35, y: 75 },
      { name: "Roberto Carlos", flag: "🇧🇷", x: 20, y: 72 },
      { name: "César Sampaio", flag: "🇧🇷", x: 50, y: 55 },
      { name: "Dunga", flag: "🇧🇷", x: 65, y: 50 },
      { name: "???", flag: "🇧🇷", x: 35, y: 50 },
      { name: "???", flag: "🇧🇷", x: 75, y: 30 },
      { name: "Bebeto", flag: "🇧🇷", x: 50, y: 18 },
      { name: "Ronaldo", flag: "🇧🇷", x: 25, y: 30 },
    ],
    missingIndex: 7,
    missingIndex2: 8,
    optionA: "Leonardo & Rivaldo",
    optionB: "Denílson & Emerson",
    optionC: "Emerson & Juninho Paulista",
    optionD: "Leonardo & Juninho Paulista",
    correctAnswer: 'A',
    hint1: "Attacking pair behind Ronaldo in the 4-4-2",
    hint2: "Barcelona playmaker and Valencia/Brazil star",
    hint3: "Both started under Zagallo"
  },
  // Level 20: Questions 177-179 (3 two-missing-player questions)
  {
    id: 177,
    match: "Mexico 🇲🇽 vs Netherlands 🇳🇱 - 2014 World Cup Round of 16",
    year: 2014,
    team: "Mexico",
    teamFlag: "🇲🇽",
    positions: [
      { name: "Ochoa", flag: "🇲🇽", x: 50, y: 90 },
      { name: "Aguilar", flag: "🇲🇽", x: 80, y: 72 },
      { name: "Márquez", flag: "🇲🇽", x: 65, y: 75 },
      { name: "Moreno", flag: "🇲🇽", x: 35, y: 75 },
      { name: "Layún", flag: "🇲🇽", x: 20, y: 72 },
      { name: "Herrera", flag: "🇲🇽", x: 50, y: 55 },
      { name: "Guardado", flag: "🇲🇽", x: 65, y: 50 },
      { name: "???", flag: "🇲🇽", x: 35, y: 50 },
      { name: "???", flag: "🇲🇽", x: 75, y: 30 },
      { name: "Peralta", flag: "🇲🇽", x: 50, y: 18 },
      { name: "Dos Santos", flag: "🇲🇽", x: 25, y: 30 },
    ],
    missingIndex: 7,
    missingIndex2: 8,
    optionA: "Vázquez & Hernández",
    optionB: "Vázquez & Jiménez",
    optionC: "Hernández & Jiménez",
    optionD: "Vázquez & Aquino",
    correctAnswer: 'A',
    hint1: "León midfielder and Manchester United striker",
    hint2: "Both key attacking players",
    hint3: "Mexico's main threats"
  },
  {
    id: 178,
    match: "France 🇫🇷 vs Italy 🇮🇹 - 2006 World Cup Final",
    year: 2006,
    team: "France",
    teamFlag: "🇫🇷",
    positions: [
      { name: "Barthez", flag: "🇫🇷", x: 50, y: 90 },
      { name: "Sagnol", flag: "🇫🇷", x: 80, y: 72 },
      { name: "Thuram", flag: "🇫🇷", x: 65, y: 75 },
      { name: "Gallas", flag: "🇫🇷", x: 35, y: 75 },
      { name: "Abidal", flag: "🇫🇷", x: 20, y: 72 },
      { name: "Vieira", flag: "🇫🇷", x: 50, y: 55 },
      { name: "Makelele", flag: "🇫🇷", x: 65, y: 50 },
      { name: "Ribery", flag: "🇫🇷", x: 35, y: 50 },
      { name: "???", flag: "🇫🇷", x: 75, y: 30 },
      { name: "Henry", flag: "🇫🇷", x: 50, y: 18 },
      { name: "???", flag: "🇫🇷", x: 25, y: 30 },
    ],
    missingIndex: 8,
    missingIndex2: 10,
    optionA: "Malouda & Zidane",
    optionB: "Malouda & Trezeguet",
    optionC: "Zidane & Trezeguet",
    optionD: "Malouda & Wiltord",
    correctAnswer: 'A',
    hint1: "Lyon winger and Real Madrid playmaker",
    hint2: "Both creative players",
    hint3: "Zidane's headbutt incident"
  },
  {
    id: 179,
    match: "Spain 🇪🇸 vs Germany 🇩🇪 - 2010 World Cup Semi-Final",
    year: 2010,
    team: "Spain",
    teamFlag: "🇪🇸",
    positions: [
      { name: "Casillas", flag: "🇪🇸", x: 50, y: 90 },
      { name: "Ramos", flag: "🇪🇸", x: 80, y: 72 },
      { name: "Piqué", flag: "🇪🇸", x: 65, y: 75 },
      { name: "Puyol", flag: "🇪🇸", x: 35, y: 75 },
      { name: "Capdevila", flag: "🇪🇸", x: 20, y: 72 },
      { name: "Busquets", flag: "🇪🇸", x: 50, y: 55 },
      { name: "Xabi Alonso", flag: "🇪🇸", x: 65, y: 50 },
      { name: "Xavi", flag: "🇪🇸", x: 35, y: 50 },
      { name: "???", flag: "🇪🇸", x: 75, y: 30 },
      { name: "Villa", flag: "🇪🇸", x: 50, y: 18 },
      { name: "???", flag: "🇪🇸", x: 25, y: 30 },
    ],
    missingIndex: 8,
    missingIndex2: 10,
    optionA: "Pedro & Iniesta",
    optionB: "Pedro & Navas",
    optionC: "Torres & Navas",
    optionD: "Pedro & Silva",
    correctAnswer: 'A',
    hint1: "Barcelona starters wide of Villa in the semi-final",
    hint2: "Pedro right, Iniesta left of the front four",
    hint3: "Torres did not start this match"
  },
];

// Get questions for a specific level (10 questions per level for levels 1-10, 10 questions per level for 11-30)
const getQuestionsForLevel = (level: number): LineupQuestion[] => {
  if (level >= 1 && level <= 6) {
    return getMissingPlayerLineupQuestionsForLevel1to6(level) as LineupQuestion[];
  }
  if (level >= 7 && level <= 30) {
    return getMissingPlayerLineupQuestionsForLevel(level) as LineupQuestion[];
  }
  return [];
};

const MissingPlayerGame = () => {
  const navigate = useNavigate();
  const goBack = useSafeBack('/missing-player');
  const { level } = useParams<{ level: string }>();
  const parsedLevel = parseInt(level || '1', 10);
  const currentLevel = Number.isFinite(parsedLevel) ? Math.min(Math.max(1, parsedLevel), 30) : 1;
  const { saveLevelStats, recordGameCompletion } = useLocalProfile();

  const levelQuestions = getQuestionsForLevel(currentLevel);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState<string>('');
  const [showHint, setShowHint] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const completionSavedKeyRef = useRef<string | null>(null);
  const scoredQuestionIndicesRef = useRef<Set<number>>(new Set());

  const totalQuestions = levelQuestions.length;
  /** In-bounds index for the question array */
  const safeIndex =
    totalQuestions > 0 ? Math.min(Math.max(0, currentIndex), totalQuestions - 1) : 0;
  const currentQuestion = totalQuestions > 0 ? levelQuestions[safeIndex] : undefined;

  useEffect(() => {
    setCurrentIndex(0);
    scoredQuestionIndicesRef.current = new Set();
  }, [currentLevel]);

  const resetQuestionState = useCallback(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setHintsUsed(0);
    setCurrentHint('');
    setShowHint(false);
    setDisabledOptions([]);
    setWrongAttempts(0);
  }, []);

  useEffect(() => {
    resetQuestionState();
  }, [currentLevel, currentIndex, resetQuestionState]);

  const handleAnswer = (answer: string) => {
    if (showResult || !currentQuestion) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      const { score: nextScore, pointsAwarded } = applyQuizCorrectScore(
        safeIndex,
        score,
        scoredQuestionIndicesRef.current,
      );
      setScore(nextScore);
      toast.success(pointsAwarded > 0 ? `Correct! +${pointsAwarded} points` : 'Correct!');
      setTimeout(() => {
        if (safeIndex < totalQuestions - 1) {
          setCurrentIndex(safeIndex + 1);
        } else if (meetsPerfectQuizLevelCompletion(totalQuestions, nextScore)) {
          setGameComplete(true);
        }
      }, 1000);
    } else {
      const nextAttempts = wrongAttempts + 1;
      setWrongAttempts(nextAttempts);
      if (shouldFailQuizLevelAfterWrong(nextAttempts)) {
        toast.error('Wrong answer!');
        setTimeout(() => setShowGameOver(true), 1000);
      } else {
        toast.error('Wrong answer! One more try.');
        setTimeout(() => {
          setSelectedAnswer(null);
          setShowResult(false);
        }, 1000);
      }
    }
  };

  const useHint = () => {
    if (hintsUsed >= 3 || !currentQuestion) return;

    const hints = [currentQuestion.hint1, currentQuestion.hint2, currentQuestion.hint3];
    setCurrentHint(hints[hintsUsed]);
    setShowHint(true);
    
    const options = ['A', 'B', 'C', 'D'];
    const wrongOptions = options.filter(o => o !== currentQuestion.correctAnswer && !disabledOptions.includes(o));
    if (wrongOptions.length > 0) {
      const randomWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      setDisabledOptions([...disabledOptions, randomWrong]);
    }
    
    setHintsUsed(hintsUsed + 1);
  };

  const restartLevel = () => {
    setCurrentIndex(0);
    setScore(0);
    scoredQuestionIndicesRef.current = new Set();
    setShowGameOver(false);
    resetQuestionState();
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    scoredQuestionIndicesRef.current = new Set();
    setGameComplete(false);
    resetQuestionState();
  };

  useEffect(() => {
    if (!gameComplete) {
      completionSavedKeyRef.current = null;
    }
  }, [gameComplete]);

  // Save stats when level is completed
  useEffect(() => {
    if (!gameComplete) return;
    if (!meetsPerfectQuizLevelCompletion(totalQuestions, score)) return;
    const key = `missing-player:${currentLevel}`;
    if (completionSavedKeyRef.current === key) return;
    completionSavedKeyRef.current = key;
    saveLevelStats('missing-player' as Category, currentLevel, score, true);
    recordGameCompletion({
      title: `Missing player — Level ${currentLevel}`,
      score,
      detail: 'Missing player',
    });
    toast.success('Results saved to profile');
  }, [gameComplete, currentLevel, score, totalQuestions, saveLevelStats, recordGameCompletion]);

  const getOptionStyle = (option: string) => {
    if (!currentQuestion) return '';
    if (disabledOptions.includes(option)) {
      return 'opacity-30 cursor-not-allowed';
    }
    if (!showResult) {
      return 'hover:border-primary/50 hover:bg-card/80';
    }
    if (option === currentQuestion.correctAnswer) {
      return 'border-green-500 bg-green-500/20';
    }
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
      return 'border-red-500 bg-red-500/20';
    }
    return '';
  };

  if (!levelQuestions || totalQuestions === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground text-center">No questions for this level.</p>
        <Button variant="outline" onClick={goBack}>
          Back
        </Button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground text-center">Could not load this question.</p>
        <Button variant="outline" onClick={goBack}>
          Back
        </Button>
      </div>
    );
  }

  if (gameComplete) {
    const nextLevel = currentLevel + 1;
    // Show next level button if next level is valid (1-10)
    const hasNextLevel = nextLevel >= 1 && nextLevel <= 30;
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center border-border rounded-2xl">
          <Trophy className="w-20 h-20 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-2">Level Complete!</h2>
          <p className="text-muted-foreground mb-6">Missing Players</p>
          <div className="bg-muted rounded-xl p-6 mb-6">
            <p className="text-5xl font-bold text-primary">{score}</p>
            <p className="text-muted-foreground">Total Points</p>
          </div>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4">Results saved to your profile</p>
          <div className="space-y-3">
            {hasNextLevel ? (
              <Button 
                onClick={() => navigate(`/level/missing-player/${nextLevel}`)} 
                className="w-full premium-button rounded-xl" 
                size="lg"
              >
                Next Level ({nextLevel})
              </Button>
            ) : null}
            <Button onClick={restartGame} className="w-full premium-button rounded-xl" size="lg">
              <RotateCcw className="mr-2 h-5 w-5" />
              Play Again
            </Button>
            <Button 
              onClick={goBack} 
              variant="outline" 
              className="w-full rounded-xl border-border"
              size="lg"
            >
              Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GameOverModal
        isOpen={showGameOver}
        onRestart={restartLevel}
        questionNumber={safeIndex + 1}
        totalQuestions={totalQuestions}
        onBack={goBack}
      />

      {/* Progress bar at top */}
      <div className="h-2 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((safeIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      <div className="p-4 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            className="text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1 px-2 flex flex-col items-center justify-center">
            <h1 className="text-sm font-black uppercase tracking-[0.2em] text-[#FFD700] drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
              MISSING PLAYER
            </h1>
            <span className="text-primary font-bold text-xs tabular-nums mt-1">
              Level {currentLevel} · {score} pts
            </span>
          </div>
          <div className="w-10" />
        </div>

        {/* Match Info Card */}
        <Card className="p-4 mb-4 border-border text-center bg-card/50">
          {(() => {
            const matchParts = currentQuestion.match.split(' - ');
            const eventPart = matchParts[1] || '';
            const eventParts = eventPart.split(' ');
            const year = eventParts[0] || '';
            const restOfEvent = eventParts.slice(1).join(' ');

            if (currentQuestion.team1 && currentQuestion.team2) {
              return (
                <>
                  <h2 className="text-xl font-bold text-primary tracking-wide space-y-2">
                    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                      <span className="inline-flex items-center gap-1.5">
                        <span>{currentQuestion.team1}</span>
                        <MissingPlayerFlagIcon
                          flag={currentQuestion.team1Flag ?? currentQuestion.teamFlag}
                          imageClassName="h-5 w-8 object-contain rounded-sm"
                        />
                      </span>
                      <span className="text-sm font-black uppercase tracking-wider text-muted-foreground">
                        vs
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span>{currentQuestion.team2}</span>
                        <MissingPlayerFlagIcon
                          flag={currentQuestion.team2Flag ?? '⚽'}
                          imageClassName="h-5 w-8 object-contain rounded-sm"
                        />
                      </span>
                    </div>
                    <div className="block">{year}</div>
                    <div className="block">{restOfEvent}</div>
                  </h2>
                  <p className="text-foreground font-semibold mt-2">{currentQuestion.team} Starting XI</p>
                </>
              );
            }

            const teamsPart = matchParts[0] || '';
            return (
              <>
                <h2 className="text-xl font-bold text-primary tracking-wide space-y-1">
                  <div className="block">{teamsPart}</div>
                  <div className="block">{year}</div>
                  <div className="block">{restOfEvent}</div>
                </h2>
                <p className="text-foreground font-semibold mt-2">{currentQuestion.team} Starting XI</p>
              </>
            );
          })()}
        </Card>

        {/* Football pitch: chess-style turf grid + markings */}
        <Card className="relative aspect-[4/5] mb-4 overflow-hidden border-border bg-[#2d6b3f] shadow-inner">
          {/* Checkerboard “chess turf” — reads like squares behind the XI */}
          <div
            className="absolute inset-0 z-0 pointer-events-none opacity-90"
            style={{
              backgroundColor: '#2f6d42',
              backgroundImage: `
                linear-gradient(45deg, rgba(0,0,0,0.14) 25%, transparent 25%),
                linear-gradient(-45deg, rgba(0,0,0,0.14) 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.14) 75%),
                linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.14) 75%)
              `,
              backgroundSize: '28px 28px',
              backgroundPosition: '0 0, 0 14px, 14px -14px, -14px 0px',
            }}
          />
          <div className="absolute inset-0 z-[1]">
            <div className="absolute inset-2 border-2 border-white/30 rounded-sm" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/30 rounded-full" />
            <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-white/30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/30 rounded-full" />
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-40 h-16 border-2 border-t-0 border-white/30" />
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-8 border-2 border-t-0 border-white/30" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-40 h-16 border-2 border-b-0 border-white/30" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-8 border-2 border-b-0 border-white/30" />
          </div>

          {currentQuestion.positions.map((position, index) => {
            const isMissing = position.name === '???';
            const isMissing2 =
              currentQuestion.missingIndex2 !== undefined &&
              (index === currentQuestion.missingIndex || index === currentQuestion.missingIndex2);
            const isMissing3 =
              currentQuestion.missingIndex3 !== undefined &&
              (index === currentQuestion.missingIndex ||
                index === currentQuestion.missingIndex2 ||
                index === currentQuestion.missingIndex3);
            const showBlank = isMissing || isMissing2 || isMissing3;
            return (
              <div
                key={index}
                className="absolute z-[2] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: `${position.x}%`, top: `${position.y}%` }}
              >
                <div
                  className={`rounded-full flex items-center justify-center text-lg transition-all duration-200 ${
                    showBlank
                      ? 'relative z-[3] w-11 h-11 md:w-14 md:h-14 scale-[1.06] border-2 border-amber-400/95 bg-gradient-to-b from-amber-950/90 via-amber-950/75 to-black/80 shadow-[0_0_20px_rgba(251,191,36,0.55),inset_0_1px_0_rgba(255,255,255,0.18)] ring-2 ring-amber-300/45'
                      : 'z-[2] w-10 h-10 md:w-12 md:h-12 bg-card/90 border border-border shadow-md'
                  }`}
                >
                  {showBlank ? (
                    <span
                      className="font-black tabular-nums text-[17px] md:text-xl leading-none text-amber-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                      aria-hidden
                    >
                      ?
                    </span>
                  ) : (
                    <MissingPlayerFlagIcon flag={position.flag} />
                  )}
                </div>
                <span
                  className={`text-[10px] md:text-xs font-semibold mt-1 px-1.5 py-0.5 rounded-md text-center leading-tight max-w-[4.5rem] ${
                    showBlank
                      ? 'text-amber-100 bg-black/65 border border-amber-500/40 shadow-sm'
                      : 'text-white bg-black/50'
                  }`}
                >
                  {showBlank ? '?' : position.name}
                </span>
              </div>
            );
          })}
        </Card>

        <p className="text-center text-sm text-muted-foreground tabular-nums mb-2 mt-2">
          Question {safeIndex + 1} of {totalQuestions}
        </p>

        <h3 className="text-lg font-bold text-center text-foreground mb-4 tracking-wide uppercase">
          {currentQuestion.missingIndex3
            ? 'Who are the three missing players?'
            : currentQuestion.missingIndex2
              ? 'Who are the missing players?'
              : 'Who is the missing player?'}
        </h3>

        {/* Options */}
        <div
          className={`grid gap-3 mb-4 ${
            currentQuestion.missingIndex3 !== undefined ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2'
          }`}
        >
          {['A', 'B', 'C', 'D'].map((option) => {
            const optionText = currentQuestion[`option${option}` as keyof LineupQuestion] as string;
            const tripleNames =
              currentQuestion.missingIndex3 !== undefined
                ? optionText.split(/\s*·\s*/).map((s) => s.trim()).filter(Boolean)
                : null;
            return (
              <Button
                key={option}
                variant="outline"
                className={`h-auto py-3 px-4 justify-start border-border bg-card/50 transition-all rounded-lg text-left whitespace-normal ${getOptionStyle(option)} ${
                  tripleNames ? 'min-h-[5rem] items-start' : ''
                }`}
                onClick={() => !disabledOptions.includes(option) && handleAnswer(option)}
                disabled={disabledOptions.includes(option) || showResult}
              >
                <span className="font-bold text-primary mr-2 shrink-0">{option}.</span>
                {tripleNames ? (
                  <span className="text-foreground text-xs sm:text-sm leading-snug flex flex-col gap-0.5 min-w-0">
                    {tripleNames.map((name) => (
                      <span key={name} className="block truncate">
                        {name}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="text-foreground text-sm">{optionText}</span>
                )}
              </Button>
            );
          })}
        </div>

        {/* Hint Button */}
        <Button
          variant="outline"
          onClick={useHint}
          disabled={hintsUsed >= 3 || showResult}
          className="w-full gap-2 border-primary text-primary hover:bg-primary/10 rounded-full py-5"
        >
          <Lightbulb className="w-4 h-4" />
          Need a Hint? ({3 - hintsUsed} remaining)
        </Button>

        {showHint && (
          <Card className="mt-4 p-4 bg-primary/10 border-primary/30 rounded-xl">
            <p className="text-sm flex items-start gap-2">
              <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">{currentHint}</span>
            </p>
          </Card>
        )}

        <SafeDevQuestionNav
          currentIndex={safeIndex}
          totalCount={totalQuestions}
          onPrevious={() => {
            if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
          }}
          onNext={() => {
            if (currentIndex < totalQuestions - 1) setCurrentIndex(currentIndex + 1);
          }}
        />
      </div>
    </div>
  );
};

export default MissingPlayerGame;
