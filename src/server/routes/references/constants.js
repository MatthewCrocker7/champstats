const champions = {
  1: {
    id: 1,
    name: 'Annie'
  },
  2: {
    id: 2,
    name: 'Olaf'
  },
  3: {
    id: 3,
    name: 'Galio'
  },
  4: {
    id: 4,
    name: 'Twisted Fate'
  },
  5: {
    id: 5,
    name: 'Xin Zhao'
  },
  6: {
    id: 6,
    name: 'Urgot'
  },
  7: {
    id: 7,
    name: 'LeBlanc'
  },
  8: {
    id: 8,
    name: 'Vladimir'
  },
  9: {
    id: 8,
    name: 'Fiddlesticks'
  },
  10: {
    id: 10,
    name: 'Kayle'
  },
  11: {
    id: 11,
    name: 'Master Yi'
  },
  12: {
    id: 12,
    name: 'Alistar'
  },
  13: {
    id: 13,
    name: 'Ryze'
  },
  14: {
    id: 14,
    name: 'Sion'
  },
  15: {
    id: 15,
    name: 'Sivir'
  },
  16: {
    id: 16,
    name: 'Soraka'
  },
  17: {
    id: 17,
    name: 'Teemo'
  },
  18: {
    id: 18,
    name: 'Tristana'
  },
  19: {
    id: 19,
    name: 'Warwick'
  },
  21: {
    id: 21,
    name: 'Miss Fortune'
  },
  22: {
    id: 22,
    name: 'Ashe'
  },
  23: {
    id: 23,
    name: 'Tryndamere'
  },
  24: {
    id: 24,
    name: 'Jax'
  },
  25: {
    id: 25,
    name: 'Morgana'
  },
  26: {
    id: 26,
    name: 'Zilean'
  },
  27: {
    id: 27,
    name: 'Singed'
  },
  28: {
    id: 28,
    name: 'Evelynn'
  },
  29: {
    id: 29,
    name: 'Twitch'
  },
  30: {
    id: 30,
    name: 'Karthus'
  },
  31: {
    id: 31,
    name: "Cho'Gath"
  },
  32: {
    id: 32,
    name: 'Amumu'
  },
  33: {
    id: 33,
    name: 'Rammus'
  },
  34: {
    id: 34,
    name: 'Anivia'
  },
  35: {
    id: 35,
    name: 'Shaco'
  },
  36: {
    id: 36,
    name: 'Dr. Mundo'
  },
  37: {
    id: 37,
    name: 'Sona'
  },
  38: {
    id: 38,
    name: 'Kassadin'
  },
  39: {
    id: 39,
    name: 'Irelia'
  },
  40: {
    id: 40,
    name: 'Janna'
  },
  41: {
    id: 41,
    name: 'Gangplank'
  },
  42: {
    id: 42,
    name: 'Corki'
  },
  43: {
    id: 43,
    name: 'Karma'
  },
  44: {
    id: 44,
    name: 'Taric'
  },
  45: {
    id: 45,
    name: 'Veigar'
  },
  48: {
    id: 48,
    name: 'Trundle'
  },
  50: {
    id: 50,
    name: 'Swain'
  },
  51: {
    id: 51,
    name: 'Caitlyn'
  },
  53: {
    id: 53,
    name: 'Blitzcrank'
  },
  54: {
    id: 54,
    name: 'Malphite'
  },
  55: {
    id: 55,
    name: 'Katarina'
  },
  56: {
    id: 56,
    name: 'Nocturne'
  },
  57: {
    id: 57,
    name: 'Maokai'
  },
  58: {
    id: 58,
    name: 'Renekton'
  },
  59: {
    id: 59,
    name: 'Jarvan IV'
  },
  60: {
    id: 60,
    name: 'Elise'
  },
  61: {
    id: 61,
    name: 'Orianna'
  },
  62: {
    id: 62,
    name: 'Wukong'
  },
  63: {
    id: 63,
    name: 'Brand'
  },
  64: {
    id: 64,
    name: 'Lee Sin'
  },
  67: {
    id: 67,
    name: 'Vayne'
  },
  68: {
    id: 68,
    name: 'Rumble'
  },
  69: {
    id: 69,
    name: 'Cassiopeia'
  },
  72: {
    id: 72,
    name: 'Skarner'
  },
  74: {
    id: 74,
    name: 'Heimerdinger'
  },
  75: {
    id: 75,
    name: 'Nasus'
  },
  76: {
    id: 76,
    name: 'Nidalee'
  },
  77: {
    id: 77,
    name: 'Udyr'
  },
  78: {
    id: 78,
    name: 'Poppy'
  },
  79: {
    id: 79,
    name: 'Gragas'
  },
  80: {
    id: 80,
    name: 'Pantheon'
  },
  81: {
    id: 81,
    name: 'Ezreal'
  },
  82: {
    id: 82,
    name: 'Mordekaiser'
  },
  83: {
    id: 83,
    name: 'Yorick'
  },
  84: {
    id: 84,
    name: 'Akali'
  },
  85: {
    id: 85,
    name: 'Kennen'
  },
  86: {
    id: 86,
    name: 'Garen'
  },
  89: {
    id: 89,
    name: 'Leona'
  },
  90: {
    id: 90,
    name: 'Malzahar'
  },
  91: {
    id: 91,
    name: 'Talon'
  },
  92: {
    id: 92,
    name: 'Riven'
  },
  96: {
    id: 96,
    name: "Kog'Maw"
  },
  98: {
    id: 98,
    name: 'Shen'
  },
  99: {
    id: 99,
    name: 'Lux'
  },
  101: {
    id: 101,
    name: 'Xerath'
  },
  102: {
    id: 102,
    name: 'Shyvana'
  },
  103: {
    id: 103,
    name: 'Ahri'
  },
  104: {
    id: 104,
    name: 'Graves'
  },
  105: {
    id: 105,
    name: 'Fizz'
  },
  106: {
    id: 106,
    name: 'Volibear'
  },
  107: {
    id: 107,
    name: 'Rengar'
  },
  110: {
    id: 110,
    name: 'Varus'
  },
  111: {
    id: 111,
    name: 'Nautilus'
  },
  112: {
    id: 112,
    name: 'Viktor'
  },
  113: {
    id: 113,
    name: 'Sejuani'
  },
  114: {
    id: 114,
    name: 'Fiora'
  },
  115: {
    id: 115,
    name: 'Ziggs'
  },
  117: {
    id: 117,
    name: 'Lulu'
  },
  119: {
    id: 119,
    name: 'Draven'
  },
  120: {
    id: 120,
    name: 'Hecarim'
  },
  121: {
    id: 121,
    name: "Kha'Zix"
  },
  122: {
    id: 122,
    name: 'Darius'
  },
  126: {
    id: 126,
    name: 'Jayce'
  },
  127: {
    id: 127,
    name: 'Lissandra'
  },
  131: {
    id: 131,
    name: 'Diana'
  },
  133: {
    id: 133,
    name: 'Quinn'
  },
  134: {
    id: 134,
    name: 'Syndra'
  },
  136: {
    id: 136,
    name: 'Aurelion Sol'
  },
  141: {
    id: 141,
    name: 'Kayn'
  },
  142: {
    id: 142,
    name: 'Zoe'
  },
  143: {
    id: 143,
    name: 'Zyra'
  },
  145: {
    id: 145,
    name: "Kai'Sa"
  },
  150: {
    id: 150,
    name: 'Gnar'
  },
  154: {
    id: 154,
    name: 'Zac'
  },
  157: {
    id: 157,
    name: 'Yasuo'
  },
  161: {
    id: 161,
    name: "Vel'Koz"
  },
  163: {
    id: 163,
    name: 'Taliyah'
  },
  164: {
    id: 164,
    name: 'Camille'
  },
  201: {
    id: 201,
    name: 'Braum'
  },
  202: {
    id: 202,
    name: 'Jhin'
  },
  203: {
    id: 203,
    name: 'Kindred'
  },
  222: {
    id: 222,
    name: 'Jinx'
  },
  223: {
    id: 223,
    name: 'Tahm Kench'
  },
  236: {
    id: 236,
    name: 'Lucian'
  },
  238: {
    id: 238,
    name: 'Zed'
  },
  240: {
    id: 240,
    name: 'Kled'
  },
  245: {
    id: 245,
    name: 'Ekko'
  },
  254: {
    id: 254,
    name: 'Vi'
  },
  266: {
    id: 266,
    name: 'Aatrox'
  },
  267: {
    id: 267,
    name: 'Nami'
  },
  268: {
    id: 268,
    name: 'Azir'
  },
  412: {
    id: 412,
    name: 'Thresh'
  },
  420: {
    id: 420,
    name: 'Illaoi'
  },
  421: {
    id: 421,
    name: "Rek'Sai"
  },
  427: {
    id: 427,
    name: 'Ivern'
  },
  429: {
    id: 429,
    name: 'Kalista'
  },
  432: {
    id: 432,
    name: 'Bard'
  },
  497: {
    id: 497,
    name: 'Rakan'
  },
  498: {
    id: 498,
    name: 'Xayah'
  },
  516: {
    id: 516,
    name: 'Ornn'
  },
  517: {
    id: 517,
    name: 'Sylas'
  },
  518: {
    id: 518,
    name: 'Neeko'
  },
  555: {
    id: 555,
    name: 'Pyke'
  },
};
const summonerSpells = {
  4: {
    name: 'Flash'
  }
};
const seasons = {
  7: {
    name: 'Season 6',
    season: 6
  },
  9: {
    name: 'Season 7',
    season: 7
  },
  11: {
    name: 'Season 2018',
    season: 8
  },
  12: {
    name: 'Pre-Season 2019',
  },
  13: {
    name: 'Season 2019',
    season: 9
  }
};

const getChampion = (id) => {
  return champions[id] ? champions[id].name : 'Not Found';
};

const getSummonerSpell = (id) => {
  return summonerSpells[id];
};

const getSeason = (id) => {
  return seasons[id];
};

module.exports = {
  getChampion,
  getSummonerSpell,
  getSeason,
};
