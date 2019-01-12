const CHAMPIONS = {
  '1': {
    name: 'Annie'
  },
  '2': {
    name: 'Olaf'
  },
  '3': {
    name: 'Galio'
  },
  '4': {
    name: 'Twisted Fate'
  },
  '5': {
    name: 'Xin Zhao'
  },
  '6': {
    name: 'Urgot'
  },
  '7': {
    name: 'LeBlanc'
  },
  '8': {
    name: 'Vladimir'
  },
  '9': {
    name: 'Fiddlesticks'
  },
  '10': {
    name: 'Kayle'
  },
  '11': {
    name: 'Master Yi'
  },
  '12': {
    name: 'Alistar'
  },
  '13': {
    name: 'Ryze'
  },
  '14': {
    name: 'Sion'
  },
  '15': {
    name: 'Sivir'
  },
  '16': {
    name: 'Soraka'
  },
  '17': {
    name: 'Teemo'
  },
  '18': {
    name: 'Tristana'
  },
  '19': {
    name: 'Warwick'
  },
  '21': {
    name: 'Miss Fortune'
  },
  '22': {
    name: 'Ashe'
  },
  '23': {
    name: 'Tryndamere'
  },
  '24': {
    name: 'Jax'
  },
  '25': {
    name: 'Morgana'
  },
  '26': {
    name: 'Zilean'
  },
  '27': {
    name: 'Singed'
  },
  '28': {
    name: 'Evelynn'
  },
  '29': {
    name: 'Twitch'
  },
  '30': {
    name: 'Karthus'
  },
  '31': {
    name: "Cho'Gath"
  },
  '32': {
    name: 'Amumu'
  },
  '33': {
    name: 'Rammus'
  },
  '34': {
    name: 'Anivia'
  },
  '35': {
    name: 'Shaco'
  },
  '36': {
    name: 'Dr. Mundo'
  },
  '37': {
    name: 'Sona'
  },
  '38': {
    name: 'Kassadin'
  },
  '39': {
    name: 'Irelia'
  },
  '40': {
    name: 'Janna'
  },
  '41': {
    name: 'Gangplank'
  },
  '42': {
    name: 'Corki'
  },
  '43': {
    name: 'Karma'
  },
  '44': {
    name: 'Taric'
  },
  '45': {
    name: 'Veigar'
  },
  '48': {
    name: 'Trundle'
  },
  '50': {
    name: 'Swain'
  },
  '51': {
    name: 'Caitlyn'
  },
  '53': {
    name: 'Blitzcrank'
  },
  '54': {
    name: 'Malphite'
  },
  '55': {
    name: 'Katarina'
  },
  '56': {
    name: 'Nocturne'
  },
  '57': {
    name: 'Maokai'
  },
  '58': {
    name: 'Renekton'
  },
  '59': {
    name: 'Jarvan IV'
  },
  '60': {
    name: 'Elise'
  },
  '61': {
    name: 'Orianna'
  },
  '62': {
    name: 'Wukong'
  },
  '63': {
    name: 'Brand'
  },
  '64': {
    name: "Lee Sin"
  },
  '67': {
    name: 'Vayne'
  },
  '68': {
    name: 'Rumble'
  },
  '69': {
    name: 'Cassiopeia'
  },
  '72': {
    name: 'Skarner'
  },
  '74': {
    name: 'Heimerdinger'
  },
  '75': {
    name: 'Nasus'
  },
  '76': {
    name: 'Nidalee'
  },
  '77': {
    name: 'Udyr'
  },
  '78': {
    name: 'Poppy'
  },
  '79': {
    name: 'Gragas'
  },
  '80': {
    name: 'Pantheon'
  },
  '81': {
    name: 'Ezreal'
  },
  '82': {
    name: 'Mordekaiser'
  },
  '83': {
    name: 'Yorick'
  },
  '84': {
    name: 'Akali'
  },
  '85': {
    name: 'Kennen'
  },
  '86': {
    name: 'Garen'
  },
  '89': {
    name: 'Leona'
  },
  '90': {
    name: 'Malzahar'
  },
  '91': {
    name: 'Talon'
  },
  '92': {
    name: 'Riven'
  },
  '96': {
    name: "Kog'Maw"
  },
  '98': {
    name: 'Shen'
  },
  '99': {
    name: 'Lux'
  },
  '101': {
    name: 'Xerath'
  },
  '102': {
    name: 'Shyvana'
  },
  '103': {
    name: 'Ahri'
  },
  '104': {
    name: 'Graves'
  },
  '105': {
    name: 'Fizz'
  },
  '106': {
    name: 'Volibear'
  },
  '110': {
    name: 'Varus'
  },
  '111': {
    name: 'Nautilus'
  },
  '112': {
    name: 'Viktor'
  },
  '113': {
    name: 'Sejuani'
  },
  '114': {
    name: 'Fiora'
  },
  '115': {
    name: 'Ziggs'
  },
  '117': {
    name: 'Lulu'
  },
  '119': {
    name: 'Draven'
  },
  '120': {
    name: 'Hecarim'
  },
  '121': {
    name: "Kha'Zix"
  },
  '122': {
    name: 'Darius'
  },
  '126': {
    name: 'Jayce'
  },
  '127': {
    name: 'Lissandra'
  },
  '131': {
    name: 'Diana'
  },
  '133': {
    name: 'Quinn'
  },
  '134': {
    name: 'Syndra'
  },
  '136': {
    name: 'Aurelion Sol'
  },
  '141': {
    name: 'Kayn'
  },
  '142': {
    name: 'Zoe'
  },
  '143': {
    name: 'Zyra'
  },
  '145': {
    name: "Kai'Sa"
  },
  '150': {
    name: 'Gnar'
  },
  '154': {
    name: 'Zac'
  },
  '157': {
    name: 'Yasuo'
  },
  '161': {
    name: "Vel'Koz"
  },
  '163': {
    name: 'Taliyah'
  },
  '164': {
    name: 'Camille'
  },
  '201': {
    name: 'Braum'
  },
  '202': {
    name: 'Jhin'
  },
  '203': {
    name: 'Kindred'
  },
  '222': {
    name: 'Jinx'
  },
  '223': {
    name: 'Tahm Kench'
  },
  '236': {
    name: 'Lucian'
  },
  '238': {
    name: 'Zed'
  },
  '240': {
    name: 'Kled'
  },
  '245': {
    name: 'Ekko'
  },
  '254': {
    name: 'Vi'
  },
  '266': {
    name: 'Aatrox'
  },
  '267': {
    name: 'Nami'
  },
  '268': {
    name: 'Azir'
  },
  '412': {
    name: 'Thresh'
  },
  '420': {
    name: 'Illaoi'
  },
  '421': {
    name: "Rek'Sai"
  },
  '427': {
    name: 'Ivern'
  },
  '429': {
    name: 'Kalista'
  },
  '432': {
    name: 'Bard'
  },
  '497': {
    name: 'Rakan'
  },
  '498': {
    name: 'Xayah'
  },
  '516': {
    name: 'Ornn'
  },
  '518': {
    name: 'Neeko'
  },
  '555': {
    name: 'Pyke'
  },
}

module.exports = CHAMPIONS;