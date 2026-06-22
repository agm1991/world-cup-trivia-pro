/**
 * Select a Legend — countries outside the CAF/AFC block (`cafAfcLegendCountries.ts`).
 * Composed with CAF/AFC in `selectLegendCountries.ts` for the full country grid.
 */
import type { Country } from './cafAfcLegendCountries';
import peleImg from '@/assets/kickoff-portraits/pele-wc1958.jpg';
import messiImg from '@/assets/players/Argentina/Lionel_Messi.webp';
import zidaneImg from '@/assets/zidane-new.jpg';
import ronaldoR9Img from '@/assets/ronaldo-r9.jpg';
import cristianoImg from '@/assets/players/Portugal/Cristiano_Ronaldo.jpg';
import beckenbauerImg from '@/assets/beckenbauer.jpg';
import maradonaImg from '@/assets/players/Argentina/Diego_Maradona.jpg';
import xaviImg from '@/assets/players/Spain/Xavi_Hernandez_Spain_2009.jpg';
import iniestaImg from '@/assets/players/Spain/iniesta.jpg';
import cruyffImg from '@/assets/players/cruyff.jpg';

import cafuImg from '@/assets/players/Brazil/Cafu.webp';
import neymarImg from '@/assets/players/Brazil/Neymar .jpg';
import garrinchaImg from '@/assets/players/Brazil/Garrincha.jpg';
import jairzinhoImg from '@/assets/players/Brazil/Jairzinho.jpg';
import zicoImg from '@/assets/players/Brazil/Zico.jpg';
import robertoCarlosImg from '@/assets/players/Brazil/Roberto Carlos .jpg';
import rivaldoImg from '@/assets/players/Brazil/Rivaldo.webp';
import ronaldinhoImg from '@/assets/players/Brazil/ronaldinho.avif';

import ikerCasillasImg from '@/assets/players/Spain/Iker Casillas .jpg';
import davidVillaImg from '@/assets/players/Spain/David Villa.avif';
import fernandoTorresImg from '@/assets/players/Spain/Fernando Torres.jpeg';
import xabiAlonsoImg from '@/assets/players/Spain/Xabi Alonso .jpg';
import carlesPuyolImg from '@/assets/players/Spain/Carles Puyol.jpg';
import cescFabregasImg from '@/assets/players/Spain/Fabregas.jpg';
import gerardPiqueImg from '@/assets/players/Spain/Gerard Pique.jpg';
import sergioRamosImg from '@/assets/players/Spain/Sergio Ramos.jpg';

import thierryHenryImg from '@/assets/players/France/Thierry Henry.jpg';
import lilianThuramImg from '@/assets/players/France/Lillian Thuram.jpeg';
import nGoloKanteImg from '@/assets/players/France/N\'Golo Kante.webp';
import fabienBarthezImg from '@/assets/players/France/Fabien Barthez.jpg';
import patrickVieiraImg from '@/assets/players/France/Patrick Vieira.jpg';
import kylianMbappeImg from '@/assets/players/France/Kylian Mbappe.avif';
import marcelDesaillyImg from '@/assets/players/France/Marcel Desailly .jpg';
import michelPlatiniImg from '@/assets/players/France/Michel Platini.jpeg';
import antoineGriezmannImg from '@/assets/players/France/Antoine Griezmannn.jpg';

import gerdMullerImg from '@/assets/players/Germany/Gerd Muller.webp';
import jurgenKlinsmannImg from '@/assets/players/Germany/Jurgen Klinsmann.jpg';
import karlHeinzRummeniggeImg from '@/assets/players/Germany/Karl-Heinz Rummenigge .jpg';
import lotharMatthausImg from '@/assets/players/Germany/lothar-matthaus.jpg';
import manuelNeuerImg from '@/assets/players/Germany/manuel neuer.jpg';
import matsHummelsImg from '@/assets/players/Germany/Mats Hummels.jpg';
import philippLahmImg from '@/assets/players/Germany/philipp lahm.jpg';
import bastianSchweinsteigerImg from '@/assets/players/Germany/bastian schweinsteiger.webp';
import toniKroosImg from '@/assets/players/Germany/Toni Kroos.jpeg';

import angelDiMariaImg from '@/assets/players/Argentina/Angel_Di_Maria.png';
import marioKempesImg from '@/assets/players/Argentina/Mario_Kempes.png';
import gabrielBatistutaImg from '@/assets/players/Argentina/Gabriel_Batistuta.png';
import javierMascheranoImg from '@/assets/players/Argentina/Javier_Mascherano.jpg';
import javierZanettiImg from '@/assets/players/Argentina/Javier_Zanetti.png';
import emilianoMartinezImg from '@/assets/players/Argentina/Emiliano_Martinez.jpg';
import hernanCrespoImg from '@/assets/players/Argentina/Hernan_Crespo.png';
import gonzaloHiguainImg from '@/assets/players/Argentina/Gonzalo_Higuain.jpg';
import nicolasOtamendiImg from '@/assets/players/Argentina/Nicolas_Otamendi.png';

import eusebioImg from '@/assets/players/Portugal/Eusébio.webp';
import luisFigoImg from '@/assets/players/Portugal/Luis Figo.jpg';
import ruiCostaImg from '@/assets/players/Portugal/Rui Costa .webp';
import pepeImg from '@/assets/players/Portugal/Pepe.jpg';
import decoImg from '@/assets/players/Portugal/Deco.jpeg';
import luisNaniImg from '@/assets/players/Portugal/Luis Nani .jpeg';
import pauloFutreImg from '@/assets/players/Portugal/Paulo Futre.jpg';
import ricardoCarvalhoImg from '@/assets/players/Portugal/Ricardo Carvalho.webp';
import vitorBaiaImg from '@/assets/players/Portugal/Vitor Baia.jpg';

import arjenRobbenImg from '@/assets/players/Holland/Arjen Robben .jpg';
import wesleySneijderImg from '@/assets/players/Holland/Wesley_Sneijder.jpg';
import robinVanPersieImg from '@/assets/players/Holland/Robin_van_Persie.jpg';
import clarenceSeedorfImg from '@/assets/players/Holland/Clarence Seedorf .webp';
import dennisBergkampImg from '@/assets/players/Holland/Dennis Bergkamp.jpg';
import edwinVanDerSarImg from '@/assets/players/Holland/Edwin Van der Sar.jpg';
import frankRijkaardImg from '@/assets/players/Holland/frank rijkaard.jpeg';
import johanNeeskensImg from '@/assets/players/Holland/Johan Neeskens.jpg';
import marcoVanBastenImg from '@/assets/players/Holland/Marco Van Basten.jpeg';
import ronaldKoemanImg from '@/assets/players/Holland/Ronald Koeman.jpg';
import ruudGullitImg from '@/assets/players/Holland/Ruud Gullit .jpeg';

import engKaneImg from '@/assets/players/England/Harry_Kane.jpg';
import engLinekerImg from '@/assets/players/England/Gary_Lineker.jpg';
import engOwenImg from '@/assets/players/England/Michael_Owen.jpg';
import engBeckhamImg from '@/assets/players/England/David_Beckham.jpg';
import engCharltonImg from '@/assets/players/England/Bobby_Charlton.png';
import engHurstImg from '@/assets/players/England/Geoff_Hurst.png';
import engRooneyImg from '@/assets/players/England/Wayne_Rooney.jpg';
import engGascoigneImg from '@/assets/players/England/Paul_Gascoigne.jpg';
import engGerrardImg from '@/assets/players/England/Steven_Gerrard.jpg';
import engMooreImg from '@/assets/players/England/Bobby_Moore.jpg';
import engBanksImg from '@/assets/players/England/Gordon_Banks.jpg';

import itaMaldiniImg from '@/assets/players/Italy/Paolo_Maldini.jpg';
import itaBaggioImg from '@/assets/players/Italy/Roberto_Baggio.jpg';
import itaBuffonImg from '@/assets/players/Italy/Gianluigi_Buffon.jpg';
import itaTottiImg from '@/assets/players/Italy/Francesco_Totti.png';
import itaPirloImg from '@/assets/players/Italy/Andrea_Pirlo.png';
import itaCannavaroImg from '@/assets/players/Italy/Fabio_Cannavaro.jpg';
import itaPiolaImg from '@/assets/players/Italy/Silvio_Piola.jpg';
import itaDelPieroImg from '@/assets/players/Italy/Alessandro_Del_Piero.jpg';
import itaZoffImg from '@/assets/players/Italy/Dino_Zoff.jpg';
import itaRossiImg from '@/assets/players/Italy/Paolo_Rossi.jpg';
import itaTardelliImg from '@/assets/players/Italy/Marco_Tardelli.png';
import itaMeazzaImg from '@/assets/players/Italy/Giuseppe_Meazza.jpg';

import croModricImg from '@/assets/players/Croatia/Luka_Modric.jpg';
import croSukerImg from '@/assets/players/Croatia/Davor_Suker.jpg';
import croRakiticImg from '@/assets/players/Croatia/Ivan_Rakitic.jpg';

import suiShaqiriImg from '@/assets/players/Switzerland/Xherdan_Shaqiri.jpg';
import suiSommerImg from '@/assets/players/Switzerland/Yann_Sommer.jpg';
import suiXhakaImg from '@/assets/players/Switzerland/Granit_Xhaka.jpg';

import czeNedvedImg from '@/assets/players/CzechRepublic/Pavel_Nedved.jpg';
import czeCechImg from '@/assets/players/CzechRepublic/Petr_Cech.jpg';
import czeRosickyImg from '@/assets/players/CzechRepublic/Tomas_Rosicky.jpg';

import colJamesImg from '@/assets/players/Colombia/James_Rodriguez.jpg';
import colValderramaImg from '@/assets/players/Colombia/Carlos_Valderrama.jpg';
import colFalcaoImg from '@/assets/players/Colombia/Radamel_Falcao.jpg';

import mexHugoImg from '@/assets/players/Mexico/Hugo_Sanchez.jpg';
import mexRafaImg from '@/assets/players/Mexico/Rafa_Marquez.jpg';
import mexChicharitoImg from '@/assets/players/Mexico/Javier_Hernandez.jpg';
import mexBlancoImg from '@/assets/players/Mexico/Cuauhtemoc_Blanco.jpg';
import mexGuardadoImg from '@/assets/players/Mexico/Andres_Guardado.jpg';
import mexOchoaImg from '@/assets/players/placeholder-player.svg?url';

import denMlaudrupImg from '@/assets/players/Denmark/Michael_Laudrup.jpg';
import denSchmeichelImg from '@/assets/players/Denmark/Peter_Schmeichel.jpg';
import denEriksenImg from '@/assets/players/Denmark/Christian_Eriksen.jpg';

import sweZlatanImg from '@/assets/players/Sweden/Zlatan_Ibrahimovic.jpg';
import sweLarssonImg from '@/assets/players/Sweden/Henrik_Larsson.jpg';
import sweLjungbergImg from '@/assets/players/Sweden/Fredrik_Ljungberg.jpg';

import uruSuarezImg from '@/assets/players/Uruguay/Luis_Suarez.jpg';
import uruForlanImg from '@/assets/players/Uruguay/Diego_Forlan.jpg';
import uruCavaniImg from '@/assets/players/Uruguay/Edinson_Cavani.jpg';

import hunPuskasImg from '@/assets/players/Hungary/Ferenc_Puskas.jpg';
import hunKocsisImg from '@/assets/players/Hungary/Sandor_Kocsis.jpg';
import hunAlbertImg from '@/assets/players/Hungary/Florian_Albert.jpg';

import turSukurImg from '@/assets/players/Turkey/Hakan_Sukur.jpg';
import turHasanImg from '@/assets/players/Turkey/Hasan_Sas.jpg';
import turRustuImg from '@/assets/players/Turkey/Rustu_Recber.jpg';
import turNihatImg from '@/assets/players/Turkey/Nihat_Kahveci.jpg';
import turEmreImg from '@/assets/players/Turkey/Emre_Belozoglu.jpg';

import ecuEnnerImg from '@/assets/players/Ecuador/Enner_Valencia.jpg';
import ecuAntonioImg from '@/assets/players/Ecuador/Antonio_Valencia.jpg';
import ecuDelgadoImg from '@/assets/players/Ecuador/Agustin_Delgado.jpg';

import rusAkinfeevImg from '@/assets/players/Russia/Igor_Akinfeev.jpg';
import rusDzyubaImg from '@/assets/players/Russia/Artem_Dzyuba.jpg';
import rusYashinImg from '@/assets/players/Russia/Lev_Yashin.jpg';
import rusSalenkoImg from '@/assets/players/Russia/Oleg_Salenko.jpg';

import norSolskjaerImg from '@/assets/players/Norway/Ole_Gunnar_Solskjaer.jpg';
import norFloImg from '@/assets/players/Norway/Tore_Andre_Flo.jpg';
import norBratsethImg from '@/assets/players/Norway/Rune_Bratseth.jpg';

import chiAlexisImg from '@/assets/players/Chile/Alexis_Sanchez.jpg';
import chiVidalImg from '@/assets/players/Chile/Arturo_Vidal.jpg';
import chiBravoImg from '@/assets/players/Chile/Claudio_Bravo.jpg';

import belKdbImg from '@/assets/players/Belgium/Kevin_De_Bruyne.jpg';
import belHazardImg from '@/assets/players/Belgium/Eden_Hazard.jpg';
import belCourtoisImg from '@/assets/players/Belgium/Thibaut_Courtois.jpg';

import polLewaImg from '@/assets/players/Poland/Robert_Lewandowski.jpg';
import polBoniekImg from '@/assets/players/Poland/Zbigniew_Boniek.jpg';
import polZielinskiImg from '@/assets/players/Poland/Piotr_Zielinski.jpg';

import ausCahillImg from '@/assets/players/Australia/Tim_Cahill.jpg';
import ausKewellImg from '@/assets/players/Australia/Harry_Kewell.jpg';
import ausVidukaImg from '@/assets/players/Australia/Mark_Viduka.jpg';

import algMadjerImg from '@/assets/players/Algeria/Rabah_Madjer.jpg';
import algSlimaniImg from '@/assets/players/Algeria/Islam_Slimani.jpg';
import algFeghouliImg from '@/assets/players/Algeria/Sofiane_Feghouli.jpg';

import greKaragounisImg from '@/assets/players/Greece/Giorgos_Karagounis.jpg';
import greCharisteasImg from '@/assets/players/Greece/Angelos_Charisteas.jpg';
import greSamarasImg from '@/assets/players/Greece/Georgios_Samaras.jpg';

export const coreLegendCountries: Country[] = [
  {
    name: 'Brazil',
    flag: '🇧🇷',
    players: [
      { id: 'pele', name: 'Pelé', image: peleImg, achievement: 'World Cup 1958, 1962, 1970', isWorldCupWinner: true, worldCupNumber: 1 },
      { id: 'ronaldo-r9', name: 'Ronaldo', image: ronaldoR9Img, achievement: 'World Cup 1998, 2002, 2006', isWorldCupWinner: true, worldCupNumber: 2 },
      { id: 'cafu', name: 'Cafu', image: cafuImg, achievement: 'World Cup 1994, 2002', isWorldCupWinner: true, worldCupNumber: 3 },
      { id: 'garrincha', name: 'Garrincha', image: garrinchaImg, achievement: 'World Cup 1958, 1962', isWorldCupWinner: true, worldCupNumber: 4 },
      { id: 'jairzinho', name: 'Jairzinho', image: jairzinhoImg, achievement: 'World Cup 1970', isWorldCupWinner: true, worldCupNumber: 5 },
      { id: 'roberto-carlos', name: 'Roberto Carlos', image: robertoCarlosImg, achievement: 'World Cup 2002', isWorldCupWinner: true, worldCupNumber: 6 },
      { id: 'rivaldo', name: 'Rivaldo', image: rivaldoImg, achievement: 'World Cup 2002', isWorldCupWinner: true, worldCupNumber: 7 },
      { id: 'ronaldinho', name: 'Ronaldinho', image: ronaldinhoImg, achievement: 'World Cup 2002', isWorldCupWinner: true, worldCupNumber: 8 },
      { id: 'neymar', name: 'Neymar', image: neymarImg, achievement: '4th Place 2014' },
      { id: 'zico', name: 'Zico', image: zicoImg, achievement: 'Quarter-finals 1982, 1986' },
    ],
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
      { id: 'javier-zanetti', name: 'Javier Zanetti', image: javierZanettiImg, achievement: 'World Cup 1998, 2002' },
      { id: 'gonzalo-higuain', name: 'Gonzalo Higuaín', image: gonzaloHiguainImg, achievement: 'Final 2014' },
      { id: 'emiliano-martinez', name: 'Emiliano Martínez', image: emilianoMartinezImg, achievement: 'World Cup 2022', isWorldCupWinner: true, worldCupNumber: 5 },
      { id: 'hernan-crespo', name: 'Hernán Crespo', image: hernanCrespoImg, achievement: 'World Cup 1998, 2002, 2006' },
      { id: 'nicolas-otamendi', name: 'Nicolás Otamendi', image: nicolasOtamendiImg, achievement: 'World Cup 2022' },
    ],
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
      { id: 'luis-nani', name: 'Luís Nani', image: luisNaniImg, achievement: '2014 World Cup' },
      { id: 'paulo-futre', name: 'Paulo Futre', image: pauloFutreImg, achievement: 'Group stage 1986' },
      { id: 'ricardo-carvalho', name: 'Ricardo Carvalho', image: ricardoCarvalhoImg, achievement: 'Semi-finals 2006' },
      { id: 'vitor-baia', name: 'Vítor Baía', image: vitorBaiaImg, achievement: 'Group stage 2002' },
    ],
  },
  {
    name: 'France',
    flag: '🇫🇷',
    players: [
      { id: 'zidane', name: 'Zinedine Zidane', image: zidaneImg, achievement: 'World Cup 1998', isWorldCupWinner: true, worldCupNumber: 1 },
      { id: 'thierry-henry', name: 'Thierry Henry', image: thierryHenryImg, achievement: 'World Cup 1998', isWorldCupWinner: true, worldCupNumber: 2 },
      { id: 'lilian-thuram', name: 'Lilian Thuram', image: lilianThuramImg, achievement: 'World Cup 1998', isWorldCupWinner: true, worldCupNumber: 3 },
      { id: 'n-golo-kante', name: "N'Golo Kanté", image: nGoloKanteImg, achievement: 'World Cup 2018', isWorldCupWinner: true, worldCupNumber: 4 },
      { id: 'fabien-barthez', name: 'Fabien Barthez', image: fabienBarthezImg, achievement: 'World Cup 1998', isWorldCupWinner: true, worldCupNumber: 5 },
      { id: 'patrick-vieira', name: 'Patrick Vieira', image: patrickVieiraImg, achievement: 'World Cup 1998', isWorldCupWinner: true, worldCupNumber: 6 },
      { id: 'kylian-mbappe', name: 'Kylian Mbappé', image: kylianMbappeImg, achievement: 'World Cup 2018', isWorldCupWinner: true, worldCupNumber: 7 },
      { id: 'marcel-desailly', name: 'Marcel Desailly', image: marcelDesaillyImg, achievement: 'World Cup 1998', isWorldCupWinner: true, worldCupNumber: 8 },
      { id: 'michel-platini', name: 'Michel Platini', image: michelPlatiniImg, achievement: 'Semi-finals 1982, 1986' },
      { id: 'antoine-griezmann', name: 'Antoine Griezmann', image: antoineGriezmannImg, achievement: 'World Cup 2018', isWorldCupWinner: true, worldCupNumber: 9 },
    ],
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
    ],
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
    ],
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
      { id: 'edwin-van-der-sar', name: 'Edwin van der Sar', image: edwinVanDerSarImg, achievement: 'World Cup 1998, 2006' },
      { id: 'clarence-seedorf', name: 'Clarence Seedorf', image: clarenceSeedorfImg, achievement: 'World Cup 1998' },
      { id: 'arjen-robben', name: 'Arjen Robben', image: arjenRobbenImg, achievement: 'Final 2010' },
      { id: 'wesley-sneijder', name: 'Wesley Sneijder', image: wesleySneijderImg, achievement: 'Round of 16 2006, Final 2010, Third place 2014' },
      { id: 'robin-van-persie', name: 'Robin van Persie', image: robinVanPersieImg, achievement: 'Round of 16 2006, Final 2010, Third place 2014' },
    ],
  },
  {
    name: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    players: [
      { id: 'bobby-moore', name: 'Bobby Moore', image: engMooreImg, achievement: 'World Cup 1966', isWorldCupWinner: true, worldCupNumber: 1 },
      { id: 'bobby-charlton', name: 'Bobby Charlton', image: engCharltonImg, achievement: 'World Cup 1966', isWorldCupWinner: true, worldCupNumber: 2 },
      { id: 'geoff-hurst', name: 'Geoff Hurst', image: engHurstImg, achievement: 'World Cup 1966', isWorldCupWinner: true, worldCupNumber: 3 },
      { id: 'gordon-banks', name: 'Gordon Banks', image: engBanksImg, achievement: 'World Cup 1966', isWorldCupWinner: true, worldCupNumber: 4 },
      { id: 'gary-lineker', name: 'Gary Lineker', image: engLinekerImg, achievement: 'Quarter-finals 1986' },
      { id: 'michael-owen', name: 'Michael Owen', image: engOwenImg, achievement: 'Quarter-finals 2002; World Cup 1998 & 2006' },
      { id: 'paul-gascoigne', name: 'Paul Gascoigne', image: engGascoigneImg, achievement: 'Semi-finals 1990' },
      { id: 'david-beckham', name: 'David Beckham', image: engBeckhamImg, achievement: 'Quarter-finals 2002' },
      { id: 'steven-gerrard', name: 'Steven Gerrard', image: engGerrardImg, achievement: 'Quarter-finals 2002, 2006' },
      { id: 'wayne-rooney', name: 'Wayne Rooney', image: engRooneyImg, achievement: 'Quarter-finals 2006' },
      { id: 'harry-kane', name: 'Harry Kane', image: engKaneImg, achievement: 'Semi-finals 2018 • QF 2022' },
    ],
  },
  {
    name: 'Italy',
    flag: '🇮🇹',
    players: [
      { id: 'paolo-maldini', name: 'Paolo Maldini', image: itaMaldiniImg, achievement: 'Final 1994' },
      { id: 'roberto-baggio', name: 'Roberto Baggio', image: itaBaggioImg, achievement: 'Final 1994' },
      { id: 'gianluigi-buffon', name: 'Gianluigi Buffon', image: itaBuffonImg, achievement: 'World Cup 2006', isWorldCupWinner: true, worldCupNumber: 1 },
      { id: 'francesco-totti', name: 'Francesco Totti', image: itaTottiImg, achievement: 'World Cup 2006', isWorldCupWinner: true, worldCupNumber: 2 },
      { id: 'andrea-pirlo', name: 'Andrea Pirlo', image: itaPirloImg, achievement: 'World Cup 2006', isWorldCupWinner: true, worldCupNumber: 3 },
      { id: 'fabio-cannavaro', name: 'Fabio Cannavaro', image: itaCannavaroImg, achievement: 'World Cup 2006', isWorldCupWinner: true, worldCupNumber: 4 },
      { id: 'silvio-piola', name: 'Silvio Piola', image: itaPiolaImg, achievement: 'World Cup 1938', isWorldCupWinner: true, worldCupNumber: 5 },
      { id: 'alessandro-del-piero', name: 'Alessandro Del Piero', image: itaDelPieroImg, achievement: 'World Cup 2006', isWorldCupWinner: true, worldCupNumber: 6 },
      { id: 'paolo-rossi', name: 'Paolo Rossi', image: itaRossiImg, achievement: 'World Cup 1982', isWorldCupWinner: true, worldCupNumber: 7 },
      { id: 'dino-zoff', name: 'Dino Zoff', image: itaZoffImg, achievement: 'World Cup 1982', isWorldCupWinner: true, worldCupNumber: 8 },
      { id: 'marco-tardelli', name: 'Marco Tardelli', image: itaTardelliImg, achievement: 'World Cup 1978, 1982; squad 1986', isWorldCupWinner: true, worldCupNumber: 9 },
      { id: 'giuseppe-meazza', name: 'Giuseppe Meazza', image: itaMeazzaImg, achievement: 'World Cup 1934, 1938', isWorldCupWinner: true, worldCupNumber: 10 },
    ],
  },
  {
    name: 'Croatia',
    flag: '🇭🇷',
    players: [
      { id: 'luka-modric', name: 'Luka Modrić', image: croModricImg, achievement: 'Final 2018' },
      { id: 'davor-suker', name: 'Davor Šuker', image: croSukerImg, achievement: 'Semi-finals 1998' },
      { id: 'ivan-rakitic', name: 'Ivan Rakitić', image: croRakiticImg, achievement: 'Final 2018' },
    ],
  },
  {
    name: 'Switzerland',
    flag: '🇨🇭',
    players: [
      { id: 'xherdan-shaqiri', name: 'Xherdan Shaqiri', image: suiShaqiriImg, achievement: 'Group stage 2010; Round of 16 2014, 2018, 2022' },
      { id: 'yann-sommer', name: 'Yann Sommer', image: suiSommerImg, achievement: 'Round of 16 2018 & 2022' },
      { id: 'granit-xhaka', name: 'Granit Xhaka', image: suiXhakaImg, achievement: 'Round of 16 2014, 2018, 2022' },
    ],
  },
  {
    name: 'Czech Republic',
    flag: '🇨🇿',
    players: [
      { id: 'pavel-nedved', name: 'Pavel Nedvěd', image: czeNedvedImg, achievement: 'Semi-finals 2004 (Euro); World Cup 2006' },
      { id: 'petr-cech', name: 'Petr Čech', image: czeCechImg, achievement: 'World Cup 2006' },
      { id: 'tomas-rosicky', name: 'Tomáš Rosický', image: czeRosickyImg, achievement: 'World Cup 2006' },
    ],
  },
  {
    name: 'Colombia',
    flag: '🇨🇴',
    players: [
      { id: 'james-rodriguez', name: 'James Rodríguez', image: colJamesImg, achievement: 'Quarter-finals 2014' },
      { id: 'carlos-valderrama', name: 'Carlos Valderrama', image: colValderramaImg, achievement: 'Round of 16 1990' },
      { id: 'radamel-falcao', name: 'Radamel Falcao', image: colFalcaoImg, achievement: 'World Cup 2018' },
    ],
  },
  {
    name: 'Mexico',
    flag: '🇲🇽',
    players: [
      { id: 'hugo-sanchez', name: 'Hugo Sánchez', image: mexHugoImg, achievement: 'Quarter-finals 1986' },
      { id: 'javier-hernandez', name: 'Javier Hernández', image: mexChicharitoImg, achievement: 'Round of 16 2010, 2014' },
      { id: 'cuauhtemoc-blanco', name: 'Cuauhtémoc Blanco', image: mexBlancoImg, achievement: 'Three World Cups; Cuauhtemiña at France 98' },
      { id: 'guillermo-ochoa', name: 'Guillermo Ochoa', image: mexOchoaImg, achievement: 'World Cups 2014, 2018 & 2022; heroic vs Germany & Lewandowski' },
      { id: 'andres-guardado', name: 'Andrés Guardado', image: mexGuardadoImg, achievement: 'Five World Cups 2006–2022' },
      { id: 'rafa-marquez', name: 'Rafa Márquez', image: mexRafaImg, achievement: 'Five World Cups; iconic captain' },
    ],
  },
  {
    name: 'Denmark',
    flag: '🇩🇰',
    players: [
      { id: 'michael-laudrup', name: 'Michael Laudrup', image: denMlaudrupImg, achievement: 'Round of 16 1986' },
      { id: 'peter-schmeichel', name: 'Peter Schmeichel', image: denSchmeichelImg, achievement: 'Quarter-finals 1998' },
      { id: 'christian-eriksen', name: 'Christian Eriksen', image: denEriksenImg, achievement: 'Semi-finals 2020 (Euro); World Cup 2018, 2022' },
    ],
  },
  {
    name: 'Sweden',
    flag: '🇸🇪',
    players: [
      { id: 'zlatan-ibrahimovic', name: 'Zlatan Ibrahimović', image: sweZlatanImg, achievement: 'Round of 16 2002, 2006' },
      { id: 'henrik-larsson', name: 'Henrik Larsson', image: sweLarssonImg, achievement: 'Third place 1994; Round of 16 2002, 2006' },
      { id: 'fredrik-ljungberg', name: 'Fredrik Ljungberg', image: sweLjungbergImg, achievement: 'Round of 16 2002, 2006' },
    ],
  },
  {
    name: 'Uruguay',
    flag: '🇺🇾',
    players: [
      { id: 'luis-suarez', name: 'Luis Suárez', image: uruSuarezImg, achievement: 'Semi-finals 2010' },
      { id: 'diego-forlan', name: 'Diego Forlán', image: uruForlanImg, achievement: 'Semi-finals 2010' },
      { id: 'edinson-cavani', name: 'Edinson Cavani', image: uruCavaniImg, achievement: 'Quarter-finals 2010, 2018' },
    ],
  },
  {
    name: 'Hungary',
    flag: '🇭🇺',
    players: [
      { id: 'ferenc-puskas', name: 'Ferenc Puskás', image: hunPuskasImg, achievement: 'Final 1954' },
      { id: 'sandor-kocsis', name: 'Sándor Kocsis', image: hunKocsisImg, achievement: 'Final 1954' },
      { id: 'florian-albert', name: 'Flórián Albert', image: hunAlbertImg, achievement: 'Quarter-finals 1962, 1966' },
    ],
  },
  {
    name: 'Turkey',
    flag: '🇹🇷',
    players: [
      { id: 'hakan-sukur', name: 'Hakan Şükür', image: turSukurImg, achievement: 'Semi-finals 2002' },
      { id: 'hasan-sas', name: 'Hasan Şaş', image: turHasanImg, achievement: 'Semi-finals 2002' },
      { id: 'nihat-kahveci', name: 'Nihat Kahveci', image: turNihatImg, achievement: 'Semi-finals 2002' },
      { id: 'rustu-recber', name: 'Rüştü Reçber', image: turRustuImg, achievement: 'Semi-finals 2002' },
      { id: 'emre-belozoglu', name: 'Emre Belözoğlu', image: turEmreImg, achievement: 'Semi-finals 2002' },
    ],
  },
  {
    name: 'Ecuador',
    flag: '🇪🇨',
    players: [
      { id: 'enner-valencia', name: 'Enner Valencia', image: ecuEnnerImg, achievement: 'Round of 16 2022' },
      { id: 'antonio-valencia', name: 'Antonio Valencia', image: ecuAntonioImg, achievement: 'Round of 16 2006' },
      { id: 'agustin-delgado', name: 'Agustín Delgado', image: ecuDelgadoImg, achievement: 'Round of 16 2006' },
    ],
  },
  {
    name: 'Russia',
    flag: '🇷🇺',
    players: [
      { id: 'igor-akinfeev', name: 'Igor Akinfeev', image: rusAkinfeevImg, achievement: 'Quarter-finals 2018' },
      { id: 'artem-dzyuba', name: 'Artem Dzyuba', image: rusDzyubaImg, achievement: 'Quarter-finals 2018; 2014 squad' },
      { id: 'lev-yashin', name: 'Lev Yashin', image: rusYashinImg, achievement: 'Semi-finals 1966 as USSR (world goalkeeper icon)' },
      { id: 'oleg-salenko', name: 'Oleg Salenko', image: rusSalenkoImg, achievement: 'Golden Boot 1994; 5 goals vs Cameroon' },
    ],
  },
  {
    name: 'Norway',
    flag: '🇳🇴',
    players: [
      { id: 'ole-gunnar-solskjaer', name: 'Ole Gunnar Solskjær', image: norSolskjaerImg, achievement: 'Round of 16 1998' },
      { id: 'tore-andre-flo', name: 'Tore André Flo', image: norFloImg, achievement: 'Round of 16 1998' },
      { id: 'rune-bratseth', name: 'Rune Bratseth', image: norBratsethImg, achievement: 'Group stage 1994' },
    ],
  },
  {
    name: 'Chile',
    flag: '🇨🇱',
    players: [
      { id: 'alexis-sanchez', name: 'Alexis Sánchez', image: chiAlexisImg, achievement: 'Round of 16 2010, 2014' },
      { id: 'arturo-vidal', name: 'Arturo Vidal', image: chiVidalImg, achievement: 'Round of 16 2010, 2014' },
      { id: 'claudio-bravo', name: 'Claudio Bravo', image: chiBravoImg, achievement: 'Round of 16 2010, 2014' },
    ],
  },
  {
    name: 'Belgium',
    flag: '🇧🇪',
    players: [
      { id: 'kevin-de-bruyne', name: 'Kevin De Bruyne', image: belKdbImg, achievement: 'Third place 2018' },
      { id: 'eden-hazard', name: 'Eden Hazard', image: belHazardImg, achievement: 'Third place 2018' },
      { id: 'thibaut-courtois', name: 'Thibaut Courtois', image: belCourtoisImg, achievement: 'Third place 2018' },
    ],
  },
  {
    name: 'Poland',
    flag: '🇵🇱',
    players: [
      { id: 'robert-lewandowski', name: 'Robert Lewandowski', image: polLewaImg, achievement: 'Round of 16 2018, 2022' },
      { id: 'zbigniew-boniek', name: 'Zbigniew Boniek', image: polBoniekImg, achievement: 'Third place 1982' },
      { id: 'piotr-zielinski', name: 'Piotr Zieliński', image: polZielinskiImg, achievement: 'Round of 16 2022' },
    ],
  },
  {
    name: 'Australia',
    flag: '🇦🇺',
    players: [
      { id: 'tim-cahill', name: 'Tim Cahill', image: ausCahillImg, achievement: 'Round of 16 2006' },
      { id: 'harry-kewell', name: 'Harry Kewell', image: ausKewellImg, achievement: 'Round of 16 2006' },
      { id: 'mark-viduka', name: 'Mark Viduka', image: ausVidukaImg, achievement: 'Round of 16 2006' },
    ],
  },
  {
    name: 'Algeria',
    flag: '🇩🇿',
    players: [
      { id: 'rabah-madjer', name: 'Rabah Madjer', image: algMadjerImg, achievement: 'Group stage 1982 & 1986' },
      { id: 'islam-slimani', name: 'Islam Slimani', image: algSlimaniImg, achievement: 'Round of 16 2014' },
      { id: 'sofiane-feghouli', name: 'Sofiane Feghouli', image: algFeghouliImg, achievement: 'Round of 16 2014' },
    ],
  },
  {
    name: 'Greece',
    flag: '🇬🇷',
    players: [
      { id: 'giorgos-karagounis', name: 'Giorgos Karagounis', image: greKaragounisImg, achievement: 'World Cup 2010 & 2014; Round of 16 2014' },
      { id: 'angelos-charisteas', name: 'Angelos Charisteas', image: greCharisteasImg, achievement: 'World Cup 2010 only; group stage' },
      { id: 'georgios-samaras', name: 'Georgios Samaras', image: greSamarasImg, achievement: 'World Cup 2010 & 2014; Round of 16 2014' },
    ],
  },
];
