import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Star } from 'lucide-react';
import peleImg from '@/assets/kickoff-portraits/pele-wc1958.jpg';
import messiImg from '@/assets/messi.webp';
import zidaneImg from '@/assets/zidane-new.jpg';
import ronaldoR9Img from '@/assets/ronaldo-r9.jpg';
import cristianoImg from '@/assets/players/Portugal/Cristiano_Ronaldo.jpg';
import beckenbauerImg from '@/assets/beckenbauer.jpg';
import maradonaImg from '@/assets/maradona.jpg';
import xaviImg from '@/assets/players/Spain/Xavi_Hernandez_Spain_2009.jpg';
import iniestaImg from '@/assets/players/Spain/iniesta.jpg';
import cruyffImg from '@/assets/players/cruyff.jpg';

// Brazilian players - using actual image files from assets/players/Brazil folder
import cafuImg from '@/assets/players/Brazil/Cafu.webp';
import neymarImg from '@/assets/players/Brazil/Neymar .jpg'; // Note: filename has a space before .jpg
import garrinchaImg from '@/assets/players/Brazil/Garrincha.jpg';
import jairzinhoImg from '@/assets/players/Brazil/Jairzinho.jpg';
import zicoImg from '@/assets/players/Brazil/Zico.jpg';
import robertoCarlosImg from '@/assets/players/Brazil/Roberto Carlos .jpg'; // Note: filename has spaces
import rivaldoImg from '@/assets/players/Brazil/Rivaldo.webp';
import ronaldinhoImg from '@/assets/players/Brazil/ronaldinho.avif';

// Spanish players - using actual image files from assets/players/Spain folder
import ikerCasillasImg from '@/assets/players/Spain/Iker Casillas .jpg'; // Note: filename has a space before .jpg
import davidVillaImg from '@/assets/players/Spain/David Villa.avif';
import fernandoTorresImg from '@/assets/players/Spain/Fernando Torres.jpeg';
import xabiAlonsoImg from '@/assets/players/Spain/Xabi Alonso .jpg'; // Note: filename has a space before .jpg
import carlesPuyolImg from '@/assets/players/Spain/Carles Puyol.jpg';
import cescFabregasImg from '@/assets/players/Spain/Fabregas.jpg';
import gerardPiqueImg from '@/assets/players/Spain/Gerard Pique.jpg';
import sergioRamosImg from '@/assets/players/Spain/Sergio Ramos.jpg';

// French players - using actual image files from assets/players/France folder
import thierryHenryImg from '@/assets/players/France/Thierry Henry.jpg';
import lilianThuramImg from '@/assets/players/France/Lillian Thuram.jpeg'; // Note: filename uses "Lillian"
import nGoloKanteImg from '@/assets/players/France/N\'Golo Kante.webp';
import fabienBarthezImg from '@/assets/players/France/Fabien Barthez.jpg';
import patrickVieiraImg from '@/assets/players/France/Patrick Vieira.jpg';
import kylianMbappeImg from '@/assets/players/France/Kylian Mbappe.avif';
import marcelDesaillyImg from '@/assets/players/France/Marcel Desailly .jpg'; // Note: filename has a space before .jpg
import michelPlatiniImg from '@/assets/players/France/Michel Platini.jpeg';
import antoineGriezmannImg from '@/assets/players/France/Antoine Griezmannn.jpg'; // Note: filename has double 'n'

// German players - using actual image files from assets/players/Germany folder
import gerdMullerImg from '@/assets/players/Germany/Gerd Muller.webp';
import jurgenKlinsmannImg from '@/assets/players/Germany/Jurgen Klinsmann.jpg';
import karlHeinzRummeniggeImg from '@/assets/players/Germany/Karl-Heinz Rummenigge .jpg'; // Note: filename has a space before .jpg
import lotharMatthausImg from '@/assets/players/Germany/lothar-matthaus.jpg';
import manuelNeuerImg from '@/assets/players/Germany/manuel neuer.jpg';
import matsHummelsImg from '@/assets/players/Germany/Mats Hummels.jpg';
import philippLahmImg from '@/assets/players/Germany/philipp lahm.jpg';
import bastianSchweinsteigerImg from '@/assets/players/Germany/bastian schweinsteiger.webp';
import toniKroosImg from '@/assets/players/Germany/Toni Kroos.jpeg';

// Argentine players - using placeholder images until user adds actual images
// Note: User will add images to assets/players/Agrentina folder, then update these imports
// For now, using existing images as placeholders (will be replaced when images are added)
import angelDiMariaImg from '@/assets/messi.webp'; // Placeholder - update when image is added
import marioKempesImg from '@/assets/maradona.jpg'; // Placeholder - update when image is added
import gabrielBatistutaImg from '@/assets/messi.webp'; // Placeholder - update when image is added
import javierMascheranoImg from '@/assets/maradona.jpg'; // Placeholder - update when image is added
import sergioAgueroImg from '@/assets/messi.webp'; // Placeholder - update when image is added
import emilianoMartinezImg from '@/assets/maradona.jpg'; // Placeholder - update when image is added
import hernanCrespoImg from '@/assets/messi.webp'; // Placeholder - update when image is added
import juanRomanRiquelmeImg from '@/assets/maradona.jpg'; // Placeholder - update when image is added

// Portuguese players - using actual image files from assets/players/Portugal folder
// Note: Folder is spelled "Portugal" (not "Portugal") in the directory
import eusebioImg from '@/assets/players/Portugal/Eusébio.webp';
import luisFigoImg from '@/assets/players/Portugal/Luis Figo.jpg';
import ruiCostaImg from '@/assets/players/Portugal/Rui Costa .webp'; // Note: filename has a space before .webp
import pepeImg from '@/assets/players/Portugal/Pepe.jpg';
import decoImg from '@/assets/players/Portugal/Deco.jpeg';
import luisNaniImg from '@/assets/players/Portugal/Luis Nani .jpeg'; // Note: filename has a space before .jpeg
import pauloFutreImg from '@/assets/players/Portugal/Paulo Futre.jpg';
import ricardoCarvalhoImg from '@/assets/players/Portugal/Ricardo Carvalho.webp';
import vitorBaiaImg from '@/assets/players/Portugal/Vitor Baia.jpg';

// Dutch players - using actual image files from assets/players/Holland folder
import arjenRobbenImg from '@/assets/players/Holland/Arjen Robben .jpg'; // Note: filename has a space before .jpg
import clarenceSeedorfImg from '@/assets/players/Holland/Clarence Seedorf .webp'; // Note: filename has a space before .webp
import dennisBergkampImg from '@/assets/players/Holland/Dennis Bergkamp.jpg';
import edwinVanDerSarImg from '@/assets/players/Holland/Edwin Van der Sar.jpg';
import frankRijkaardImg from '@/assets/players/Holland/frank rijkaard.jpeg';
import johanNeeskensImg from '@/assets/players/Holland/Johan Neeskens.jpg';
import marcoVanBastenImg from '@/assets/players/Holland/Marco Van Basten.jpeg';
import ronaldKoemanImg from '@/assets/players/Holland/Ronald Koeman.jpg';
import ruudGullitImg from '@/assets/players/Holland/Ruud Gullit .jpeg'; // Note: filename has a space before .jpeg

interface Player {
  id: string;
  name: string;
  image: string;
  achievement: string;
  isWorldCupWinner?: boolean;
  worldCupNumber?: number; // Which World Cup win (e.g., 4th for Lippi)
}

interface Country {
  name: string;
  flag: string;
  players: Player[];
}

const PlayerLevels = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const countries: Country[] = [
    {
      name: 'Brazil',
      flag: '🇧🇷',
      players: [
        { id: 'pele', name: 'Pelé', image: peleImg, achievement: 'World Cup 1958, 1962, 1970', isWorldCupWinner: true, worldCupNumber: 1 },
        { id: 'ronaldo-r9', name: 'Ronaldo', image: ronaldoR9Img, achievement: 'World Cup 1994, 2002', isWorldCupWinner: true, worldCupNumber: 2 },
        { id: 'cafu', name: 'Cafu', image: cafuImg, achievement: 'World Cup 1994, 2002', isWorldCupWinner: true, worldCupNumber: 3 },
        { id: 'garrincha', name: 'Garrincha', image: garrinchaImg, achievement: 'World Cup 1958, 1962', isWorldCupWinner: true, worldCupNumber: 4 },
        { id: 'jairzinho', name: 'Jairzinho', image: jairzinhoImg, achievement: 'World Cup 1970', isWorldCupWinner: true, worldCupNumber: 5 },
        { id: 'roberto-carlos', name: 'Roberto Carlos', image: robertoCarlosImg, achievement: 'World Cup 2002', isWorldCupWinner: true, worldCupNumber: 6 },
        { id: 'rivaldo', name: 'Rivaldo', image: rivaldoImg, achievement: 'World Cup 2002', isWorldCupWinner: true, worldCupNumber: 7 },
        { id: 'ronaldinho', name: 'Ronaldinho', image: ronaldinhoImg, achievement: 'World Cup 2002', isWorldCupWinner: true, worldCupNumber: 8 },
        { id: 'neymar', name: 'Neymar', image: neymarImg, achievement: '4th Place 2014' },
        { id: 'zico', name: 'Zico', image: zicoImg, achievement: 'Quarter-finals 1982, 1986' },
      ]
    },
    {
      name: 'Argentina',
      flag: '🇦🇷',
      players: [
        { id: 'messi', name: 'Lionel Messi', image: messiImg, achievement: 'World Cup 2022', isWorldCupWinner: true, worldCupNumber: 1 },
        { id: 'maradona', name: 'Diego Maradona', image: maradonaImg, achievement: 'World Cup 1986', isWorldCupWinner: true, worldCupNumber: 2 },
        { id: 'angel-di-maria', name: 'Ángel Di María', image: angelDiMariaImg, achievement: 'World Cup 2022', isWorldCupWinner: true, worldCupNumber: 3 },
        { id: 'mario-kempes', name: 'Mario Kempes', image: marioKempesImg, achievement: 'World Cup 1978', isWorldCupWinner: true, worldCupNumber: 4 },
        { id: 'gabriel-batistuta', name: 'Gabriel Batistuta', image: gabrielBatistutaImg, achievement: 'Final 1990' },
        { id: 'javier-mascherano', name: 'Javier Mascherano', image: javierMascheranoImg, achievement: 'Final 2014' },
        { id: 'sergio-aguero', name: 'Sergio Agüero', image: sergioAgueroImg, achievement: 'Final 2014' },
        { id: 'emiliano-martinez', name: 'Emiliano Martínez', image: emilianoMartinezImg, achievement: 'World Cup 2022', isWorldCupWinner: true, worldCupNumber: 5 },
        { id: 'hernan-crespo', name: 'Hernán Crespo', image: hernanCrespoImg, achievement: 'Final 1990' },
        { id: 'juan-roman-riquelme', name: 'Juan Román Riquelme', image: juanRomanRiquelmeImg, achievement: 'Quarter-finals 2006' },
      ]
    },
    {
      name: 'Portugal',
      flag: '🇵🇹',
      players: [
        { id: 'cristiano', name: 'Cristiano Ronaldo', image: cristianoImg, achievement: 'Semi-finals 2006' },
        { id: 'eusebio', name: 'Eusébio', image: eusebioImg, achievement: 'Third place 1966' },
        { id: 'luis-figo', name: 'Luís Figo', image: luisFigoImg, achievement: 'Semi-finals 2006' },
        { id: 'rui-costa', name: 'Rui Costa', image: ruiCostaImg, achievement: 'Semi-finals 2006' },
        { id: 'pepe', name: 'Pepe', image: pepeImg, achievement: 'Round of 16 2018' },
        { id: 'deco', name: 'Deco', image: decoImg, achievement: 'Semi-finals 2006' },
        { id: 'luis-nani', name: 'Luís Nani', image: luisNaniImg, achievement: 'Round of 16 2010' },
        { id: 'paulo-futre', name: 'Paulo Futre', image: pauloFutreImg, achievement: 'Group stage 1986' },
        { id: 'ricardo-carvalho', name: 'Ricardo Carvalho', image: ricardoCarvalhoImg, achievement: 'Semi-finals 2006' },
        { id: 'vitor-baia', name: 'Vítor Baía', image: vitorBaiaImg, achievement: 'Group stage 2002' },
      ]
    },
    {
      name: 'France',
      flag: '🇫🇷',
      players: [
        { id: 'zidane', name: 'Zinedine Zidane', image: zidaneImg, achievement: 'World Cup 1998', isWorldCupWinner: true, worldCupNumber: 1 },
        { id: 'thierry-henry', name: 'Thierry Henry', image: thierryHenryImg, achievement: 'World Cup 1998', isWorldCupWinner: true, worldCupNumber: 2 },
        { id: 'lilian-thuram', name: 'Lilian Thuram', image: lilianThuramImg, achievement: 'World Cup 1998', isWorldCupWinner: true, worldCupNumber: 3 },
        { id: 'n-golo-kante', name: 'N\'Golo Kanté', image: nGoloKanteImg, achievement: 'World Cup 2018', isWorldCupWinner: true, worldCupNumber: 4 },
        { id: 'fabien-barthez', name: 'Fabien Barthez', image: fabienBarthezImg, achievement: 'World Cup 1998', isWorldCupWinner: true, worldCupNumber: 5 },
        { id: 'patrick-vieira', name: 'Patrick Vieira', image: patrickVieiraImg, achievement: 'World Cup 1998', isWorldCupWinner: true, worldCupNumber: 6 },
        { id: 'kylian-mbappe', name: 'Kylian Mbappé', image: kylianMbappeImg, achievement: 'World Cup 2018', isWorldCupWinner: true, worldCupNumber: 7 },
        { id: 'marcel-desailly', name: 'Marcel Desailly', image: marcelDesaillyImg, achievement: 'World Cup 1998', isWorldCupWinner: true, worldCupNumber: 8 },
        { id: 'michel-platini', name: 'Michel Platini', image: michelPlatiniImg, achievement: 'Semi-finals 1982, 1986' },
        { id: 'antoine-griezmann', name: 'Antoine Griezmann', image: antoineGriezmannImg, achievement: 'World Cup 2018', isWorldCupWinner: true, worldCupNumber: 9 },
      ]
    },
    {
      name: 'Germany',
      flag: '🇩🇪',
      players: [
        { id: 'beckenbauer', name: 'Franz Beckenbauer', image: beckenbauerImg, achievement: 'World Cup 1974', isWorldCupWinner: true, worldCupNumber: 1 },
        { id: 'gerd-muller', name: 'Gerd Müller', image: gerdMullerImg, achievement: 'World Cup 1974', isWorldCupWinner: true, worldCupNumber: 2 },
        { id: 'jurgen-klinsmann', name: 'Jürgen Klinsmann', image: jurgenKlinsmannImg, achievement: 'World Cup 1990', isWorldCupWinner: true, worldCupNumber: 3 },
        { id: 'karl-heinz-rummenigge', name: 'Karl-Heinz Rummenigge', image: karlHeinzRummeniggeImg, achievement: 'Final 1982, 1986' },
        { id: 'lothar-matthaus', name: 'Lothar Matthäus', image: lotharMatthausImg, achievement: 'World Cup 1990', isWorldCupWinner: true, worldCupNumber: 4 },
        { id: 'manuel-neuer', name: 'Manuel Neuer', image: manuelNeuerImg, achievement: 'World Cup 2014', isWorldCupWinner: true, worldCupNumber: 5 },
        { id: 'mats-hummels', name: 'Mats Hummels', image: matsHummelsImg, achievement: 'World Cup 2014', isWorldCupWinner: true, worldCupNumber: 6 },
        { id: 'philipp-lahm', name: 'Philipp Lahm', image: philippLahmImg, achievement: 'World Cup 2014', isWorldCupWinner: true, worldCupNumber: 7 },
        { id: 'bastian-schweinsteiger', name: 'Bastian Schweinsteiger', image: bastianSchweinsteigerImg, achievement: 'World Cup 2014', isWorldCupWinner: true, worldCupNumber: 8 },
        { id: 'toni-kroos', name: 'Toni Kroos', image: toniKroosImg, achievement: 'World Cup 2014', isWorldCupWinner: true, worldCupNumber: 9 },
      ]
    },
    {
      name: 'Spain',
      flag: '🇪🇸',
      players: [
        { id: 'xavi', name: 'Xavi Hernández', image: xaviImg, achievement: 'World Cup 2010', isWorldCupWinner: true, worldCupNumber: 1 },
        { id: 'iniesta', name: 'Andrés Iniesta', image: iniestaImg, achievement: 'World Cup 2010', isWorldCupWinner: true, worldCupNumber: 2 },
        { id: 'iker-casillas', name: 'Iker Casillas', image: ikerCasillasImg, achievement: 'World Cup 2010', isWorldCupWinner: true, worldCupNumber: 3 },
        { id: 'david-villa', name: 'David Villa', image: davidVillaImg, achievement: 'World Cup 2010', isWorldCupWinner: true, worldCupNumber: 4 },
        { id: 'fernando-torres', name: 'Fernando Torres', image: fernandoTorresImg, achievement: 'World Cup 2010', isWorldCupWinner: true, worldCupNumber: 5 },
        { id: 'xabi-alonso', name: 'Xabi Alonso', image: xabiAlonsoImg, achievement: 'World Cup 2010', isWorldCupWinner: true, worldCupNumber: 6 },
        { id: 'carles-puyol', name: 'Carles Puyol', image: carlesPuyolImg, achievement: 'World Cup 2010', isWorldCupWinner: true, worldCupNumber: 7 },
        { id: 'cesc-fabregas', name: 'Cesc Fàbregas', image: cescFabregasImg, achievement: 'World Cup 2010', isWorldCupWinner: true, worldCupNumber: 8 },
        { id: 'gerard-pique', name: 'Gerard Piqué', image: gerardPiqueImg, achievement: 'World Cup 2010', isWorldCupWinner: true, worldCupNumber: 9 },
        { id: 'sergio-ramos', name: 'Sergio Ramos', image: sergioRamosImg, achievement: 'World Cup 2010', isWorldCupWinner: true, worldCupNumber: 10 },
      ]
    },
    {
      name: 'Netherlands',
      flag: '🇳🇱',
      players: [
        { id: 'cruyff', name: 'Johan Cruyff', image: cruyffImg, achievement: 'Final 1974' },
        { id: 'johan-neeskens', name: 'Johan Neeskens', image: johanNeeskensImg, achievement: 'Final 1974, 1978' },
        { id: 'ruud-gullit', name: 'Ruud Gullit', image: ruudGullitImg, achievement: 'Round of 16 1990' },
        { id: 'marco-van-basten', name: 'Marco van Basten', image: marcoVanBastenImg, achievement: 'Round of 16 1990' },
        { id: 'frank-rijkaard', name: 'Frank Rijkaard', image: frankRijkaardImg, achievement: 'Round of 16 1990, 1994' },
        { id: 'ronald-koeman', name: 'Ronald Koeman', image: ronaldKoemanImg, achievement: 'Round of 16 1990, 1994' },
        { id: 'dennis-bergkamp', name: 'Dennis Bergkamp', image: dennisBergkampImg, achievement: 'Semi-finals 1998' },
        { id: 'edwin-van-der-sar', name: 'Edwin van der Sar', image: edwinVanDerSarImg, achievement: 'Semi-finals 1998' },
        { id: 'clarence-seedorf', name: 'Clarence Seedorf', image: clarenceSeedorfImg, achievement: 'Semi-finals 1998' },
        { id: 'arjen-robben', name: 'Arjen Robben', image: arjenRobbenImg, achievement: 'Final 2010' },
      ]
    },
  ];

  const selectedCountryData = countries.find(c => c.name === selectedCountry);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/categories')}
              className="border-border hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Select a Legend</h1>
              <p className="text-muted-foreground mt-2">Choose a country to see their legendary players</p>
            </div>
          </div>

          {/* Country Flags Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {countries.map((country) => (
              <Card
                key={country.name}
                className={`p-6 cursor-pointer transition-all border ${
                  selectedCountry === country.name 
                    ? 'border-primary shadow-glow' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedCountry(selectedCountry === country.name ? null : country.name)}
              >
                <div className="text-center">
                  <span className="text-6xl block mb-3">{country.flag}</span>
                  <h3 className="text-lg font-bold text-foreground">{country.name}</h3>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="w-4 h-4 text-primary" />
                    <span className="text-primary font-semibold">{country.players.length} {country.players.length === 1 ? 'Legend' : 'Legends'}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Players Panel */}
          {selectedCountryData && (
            <Card className="p-6 border-border animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {selectedCountryData.flag} {selectedCountryData.name}'s Legendary Players
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {selectedCountryData.players.map((player) => (
                  <Card
                    key={player.id}
                    className="overflow-hidden cursor-pointer hover:border-primary transition-all border-border group"
                    onClick={() => navigate(`/player-levels/${player.id}`)}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img 
                        src={player.image} 
                        alt={player.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to Pelé image if player image fails to load
                          const target = e.target as HTMLImageElement;
                          if (target.src !== peleImg) {
                            target.src = peleImg;
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      {/* World Cup Winner Badge */}
                      {player.isWorldCupWinner && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-400 px-2 py-1 rounded-full shadow-lg">
                          <Star className="w-4 h-4 text-white fill-white" />
                          <span className="text-xs font-bold text-white">#{player.worldCupNumber}</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className={`text-lg font-bold ${player.isWorldCupWinner ? 'text-yellow-400' : 'text-white'}`}>
                          {player.name}
                        </h3>
                        <p className={`text-sm ${player.isWorldCupWinner ? 'text-yellow-300' : 'text-primary'}`}>
                          {player.achievement}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <p className="text-muted-foreground text-sm mt-4">
                Click on a player to test your knowledge about their career
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerLevels;
