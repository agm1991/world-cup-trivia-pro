/**
 * Select a Legend — CAF & AFC nations (player-performance quiz focus).
 * Merged with global nations in `selectLegendCountries.ts` for the full grid.
 */
import jayJayOkochaImg from '@/assets/players/Nigeria/JayJay_Okocha.jpg';
import nwankwoKanuImg from '@/assets/players/Nigeria/Nwankwo_Kanu.jpg';
import ahmedMusaImg from '@/assets/players/Nigeria/Ahmed_Musa.jpg';
import shinjiKagawaImg from '@/assets/players/Japan/Shinji_Kagawa.jpg';
import keisukeHondaImg from '@/assets/players/Japan/Keisuke_Honda.jpg';
import hidetoshiNakataImg from '@/assets/players/Japan/Hidetoshi_Nakata.jpg';
import korSonImg from '@/assets/players/SouthKorea/Son_Heung-min.jpg';
import korParkImg from '@/assets/players/SouthKorea/Park_Ji-sung.jpg';
import korChaBumKunImg from '@/assets/players/SouthKorea/Cha_Bum-kun.jpg';
import saudiSalemImg from '@/assets/players/SaudiArabia/Salem_Al-Dawsari.jpg';
import saudiSamiAlJaberImg from '@/assets/players/SaudiArabia/Sami_Al-Jaber.jpg';
import saudiAlOwairanImg from '@/assets/players/SaudiArabia/Saeed_Al-Owairan.jpg';
import marHakimiImg from '@/assets/players/Morocco/Achraf_Hakimi.jpg';
import marZiyechImg from '@/assets/players/Morocco/Hakim_Ziyech.jpg';
import marBounouImg from '@/assets/players/Morocco/Yassine_Bounou.jpg';
import senManeImg from '@/assets/players/Senegal/Sadio_Mane.jpg';
import senDioufImg from '@/assets/players/Senegal/El_Hadji_Diouf.jpg';
import senKoulibalyImg from '@/assets/players/Senegal/Kalidou_Koulibaly.jpg';
import ghaEssienImg from '@/assets/players/Ghana/Michael_Essien.jpg';
import ghaGyanImg from '@/assets/players/Ghana/Asamoah_Gyan.jpg';
import ghaAyewImg from '@/assets/players/Ghana/Andre_Ayew.jpg';
import ghaBoatengImg from '@/assets/players/Ghana/KevinPrince_Boateng.jpg';
import cmrEtooImg from '@/assets/players/Cameroon/Samuel_Etoo.jpg';
import cmrMillaImg from '@/assets/players/Cameroon/Roger_Milla.jpg';
import cmrSongImg from '@/assets/players/Cameroon/Rigobert_Song.jpg';

export interface Player {
  id: string;
  name: string;
  image: string;
  achievement: string;
  isWorldCupWinner?: boolean;
  worldCupNumber?: number;
}

export interface Country {
  name: string;
  flag: string;
  players: Player[];
}

export const cafAfcLegendCountries: Country[] = [
  {
    name: 'Cameroon',
    flag: '🇨🇲',
    players: [
      { id: 'samuel-etoo', name: "Samuel Eto'o", image: cmrEtooImg, achievement: 'World Cup 2002, 2010, 2014' },
      { id: 'roger-milla', name: 'Roger Milla', image: cmrMillaImg, achievement: 'World Cup 1982, 1990, 1994; quarter-finals 1990' },
      { id: 'rigobert-song', name: 'Rigobert Song', image: cmrSongImg, achievement: 'World Cup 1994, 1998, 2002, 2010' },
    ],
  },
  {
    name: 'Senegal',
    flag: '🇸🇳',
    players: [
      { id: 'sadio-mane', name: 'Sadio Mané', image: senManeImg, achievement: 'Round of 16 2018' },
      { id: 'el-hadji-diouf', name: 'El Hadji Diouf', image: senDioufImg, achievement: 'Quarter-finals 2002' },
      { id: 'kalidou-koulibaly', name: 'Kalidou Koulibaly', image: senKoulibalyImg, achievement: 'Round of 16 2018, 2022' },
    ],
  },
  {
    name: 'Nigeria',
    flag: '🇳🇬',
    players: [
      { id: 'jay-jay-okocha', name: 'Jay-Jay Okocha', image: jayJayOkochaImg, achievement: 'Round of 16 1994, 1998' },
      { id: 'nwankwo-kanu', name: 'Nwankwo Kanu', image: nwankwoKanuImg, achievement: 'Round of 16 1998; Group stage 2002, 2010' },
      { id: 'ahmed-musa', name: 'Ahmed Musa', image: ahmedMusaImg, achievement: 'Round of 16 2014 & 2018' },
    ],
  },
  {
    name: 'Morocco',
    flag: '🇲🇦',
    players: [
      { id: 'achraf-hakimi', name: 'Achraf Hakimi', image: marHakimiImg, achievement: 'Semi-finals 2022' },
      { id: 'hakim-ziyech', name: 'Hakim Ziyech', image: marZiyechImg, achievement: 'Semi-finals 2022' },
      { id: 'yassine-bounou', name: 'Yassine Bounou', image: marBounouImg, achievement: 'Semi-finals 2022' },
    ],
  },
  {
    name: 'Ghana',
    flag: '🇬🇭',
    players: [
      { id: 'michael-essien', name: 'Michael Essien', image: ghaEssienImg, achievement: 'World Cup 2006 & 2014; round of 16 2006' },
      { id: 'asamoah-gyan', name: 'Asamoah Gyan', image: ghaGyanImg, achievement: 'World Cup 2006, 2010 & 2014; quarter-finals 2010' },
      { id: 'andre-ayew', name: 'André Ayew', image: ghaAyewImg, achievement: 'World Cup 2010, 2014 & 2022; quarter-finals 2010' },
      { id: 'kevin-prince-boateng', name: 'Kevin-Prince Boateng', image: ghaBoatengImg, achievement: 'World Cup 2010 & 2014; quarter-finals 2010' },
    ],
  },
  {
    name: 'Japan',
    flag: '🇯🇵',
    players: [
      { id: 'keisuke-honda', name: 'Keisuke Honda', image: keisukeHondaImg, achievement: 'Round of 16 2010, 2014, 2018' },
      { id: 'shinji-kagawa', name: 'Shinji Kagawa', image: shinjiKagawaImg, achievement: 'World Cup 2014 & 2018; Round of 16 2018' },
      { id: 'hidetoshi-nakata', name: 'Hidetoshi Nakata', image: hidetoshiNakataImg, achievement: 'Round of 16 2002' },
    ],
  },
  {
    name: 'South Korea',
    flag: '🇰🇷',
    players: [
      { id: 'park-ji-sung', name: 'Park Ji-sung', image: korParkImg, achievement: 'Semi-finals 2002' },
      { id: 'son-heung-min', name: 'Son Heung-min', image: korSonImg, achievement: 'Group stage 2014; Round of 16 2018 & 2022' },
      { id: 'cha-bum-kun', name: 'Cha Bum-kun', image: korChaBumKunImg, achievement: 'Group stage 1986' },
    ],
  },
  {
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    players: [
      { id: 'salem-al-dawsari', name: 'Salem Al-Dawsari', image: saudiSalemImg, achievement: 'Group stage 2018, 2022' },
      { id: 'sami-al-jaber', name: 'Sami Al-Jaber', image: saudiSamiAlJaberImg, achievement: 'Round of 16 1994' },
      { id: 'saeed-al-owairan', name: 'Saeed Al-Owairan', image: saudiAlOwairanImg, achievement: 'Round of 16 1994' },
    ],
  },
];
