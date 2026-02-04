export const COLOR_SHAPES: number[] = [
  require('../assets/images/colors/shape1.png'),
  require('../assets/images/colors/shape2.png'),
  require('../assets/images/colors/shape3.png'),
  require('../assets/images/colors/shape4.png'),
];

export function getRandomShape(): number {
  return COLOR_SHAPES[
    Math.floor(Math.random() * COLOR_SHAPES.length)
  ];
}

export type RawColor = {
  name: string;
  alpha: string;
  bravo: string;
  charlie: string;
  neutral: string;
};

export const RAW_COLORS: RawColor[] = [
  {
    name: 'Amiibo_Idol01',
    alpha: '#ffff61b7',
    bravo: '#ff7ed748',
    charlie: '#ff0000ff',
    neutral: '#ff000000',
  },
  {
    name: 'Amiibo_Idol02',
    alpha: '#ffc6387d',
    bravo: '#ff00a48e',
    charlie: '#ff0000ff',
    neutral: '#ff000000',
  },
  {
    name: 'Amiibo_Idol06',
    alpha: '#ff19197f',
    bravo: '#ffb01d35',
    charlie: '#ff0000ff',
    neutral: '#ff000000',
  },
  {
    name: 'Amiibo_Idol07',
    alpha: '#ffe9f109',
    bravo: '#ffffffff',
    charlie: '#ff0000ff',
    neutral: '#ff000000',
  },
  {
    name: 'Amiibo_Idol08',
    alpha: '#ff816619',
    bravo: '#ff8c8c8c',
    charlie: '#ff0000ff',
    neutral: '#ff000000',
  },
  {
    name: 'Amiibo_Player01',
    alpha: '#ffff580c',
    bravo: '#ff1313bf',
    charlie: '#ff0000ff',
    neutral: '#ff86ce4a',
  },
  {
    name: 'Amiibo_Player01B',
    alpha: '#ff76d440',
    bravo: '#ff9354ab',
    charlie: '#ff0000ff',
    neutral: '#fff07005',
  },
  {
    name: 'Amiibo_Player02',
    alpha: '#ffed4454',
    bravo: '#ff54d128',
    charlie: '#ff0000ff',
    neutral: '#ff9958c4',
  },
  {
    name: 'Amiibo_Player02B',
    alpha: '#ffb01d35',
    bravo: '#ffd33030',
    charlie: '#ff0000ff',
    neutral: '#ffbd3047',
  },
  {
    name: 'BankaraIdol_DefaultColor',
    alpha: '#ff0c00ff',
    bravo: '#ffffe900',
    charlie: '#ff0000ff',
    neutral: '#ff19197f',
  },
  {
    name: 'BlueYellow',
    alpha: '#ff1a1aae',
    bravo: '#ffe38d24',
    charlie: '#ff0000ff',
    neutral: '#ffcd43a6',
  },
  {
    name: 'CoopBlue',
    alpha: '#ff435bf3',
    bravo: '#ff067e63',
    charlie: '#ff0000ff',
    neutral: '#ffe9dd14',
  },
  {
    name: 'CoopDefault',
    alpha: '#ffc95431',
    bravo: '#ff03644b',
    charlie: '#ff0000ff',
    neutral: '#ffe7e710',
  },
  {
    name: 'CoopOrange',
    alpha: '#ffc44b21',
    bravo: '#ff098264',
    charlie: '#ff0000ff',
    neutral: '#ffdce317',
  },
  {
    name: 'CoopPink',
    alpha: '#ffc64184',
    bravo: '#ff0d6e74',
    charlie: '#ff0000ff',
    neutral: '#ffe3d704',
  },
  {
    name: 'CoopPurple',
    alpha: '#ff9361ea',
    bravo: '#ff0a7a5e',
    charlie: '#ff0000ff',
    neutral: '#ffd3dd1e',
  },
  {
    name: 'CoopSunYellow',
    alpha: '#ffdda024',
    bravo: '#ff098264',
    charlie: '#ff0000ff',
    neutral: '#ffe114c3',
  },
  {
    name: 'CoopYellow',
    alpha: '#ffb4d933',
    bravo: '#ff098a71',
    charlie: '#ff0000ff',
    neutral: '#ffd611e0',
  },
  {
    name: 'GreenPurple',
    alpha: '#ffa0c937',
    bravo: '#ffba30b0',
    charlie: '#ff0000ff',
    neutral: '#ffe1820d',
  },
  {
    name: 'HeroBlue',
    alpha: '#ff1b18d7',
    bravo: '#ffdd0dd3',
    charlie: '#ff0000ff',
    neutral: '#ffc6d314',
  },
  {
    name: 'HeroBossFuuka',
    alpha: '#ffbad421',
    bravo: '#ff1021be',
    charlie: '#ff0000ff',
    neutral: '#ffa714d4',
  },
  {
    name: 'HeroBossManta',
    alpha: '#ffe1772b',
    bravo: '#ff2dd9b6',
    charlie: '#ff0000ff',
    neutral: '#ff2e14d4',
  },
  {
    name: 'HeroBossUtsuho',
    alpha: '#ff373dbb',
    bravo: '#ffcece28',
    charlie: '#ff0000ff',
    neutral: '#ffc920b7',
  },
  {
    name: 'HeroGreen',
    alpha: '#ff51c71b',
    bravo: '#ff2120cc',
    charlie: '#ff0000ff',
    neutral: '#ffc920b7',
  },
  {
    name: 'HeroLightBlue',
    alpha: '#ff14bbe7',
    bravo: '#ff285eea',
    charlie: '#ff0000ff',
    neutral: '#ffc920b7',
  },
  {
    name: 'HeroOrange',
    alpha: '#ffee8711',
    bravo: '#ff0943f0',
    charlie: '#ff0000ff',
    neutral: '#ff81de17',
  },
  {
    name: 'HeroSoda',
    alpha: '#ffaef4f0',
    bravo: '#ffdd0dd3',
    charlie: '#ff0000ff',
    neutral: '#ffc6d314',
  },
  {
    name: 'HeroYellow',
    alpha: '#ffdec109',
    bravo: '#ff531bba',
    charlie: '#ff0000ff',
    neutral: '#ffc920b7',
  },
  {
    name: 'JUEA-SAND',
    alpha: '#ffbb3660',
    bravo: '#ff6b4bcc',
    charlie: '#ff86d136',
    neutral: '#ffffb62c',
  },
  {
    name: 'LimegreenPurple',
    alpha: '#ffbecd41',
    bravo: '#ff6325cd',
    charlie: '#ff0000ff',
    neutral: '#ff31c4a9',
  },
  {
    name: 'OrangeBlue',
    alpha: '#ffde6624',
    bravo: '#ff343bc4',
    charlie: '#ff0000ff',
    neutral: '#ffcdcd34',
  },
  {
    name: 'OrangePurple',
    alpha: '#ffcd510a',
    bravo: '#ff6e04b6',
    charlie: '#ff0000ff',
    neutral: '#ff94c921',
  },
  {
    name: 'PinkGreen',
    alpha: '#ffc12d74',
    bravo: '#ff2cb721',
    charlie: '#ff0000ff',
    neutral: '#ff3a28c4',
  },
  {
    name: 'Support_CoopYellow',
    alpha: '#ffddd112',
    bravo: '#ff047b8b',
    charlie: '#ff0000ff',
    neutral: '#ffed12e4',
  },
  {
    name: 'Support_HeroBlue',
    alpha: '#ffd6cd25',
    bravo: '#ff531bba',
    charlie: '#ff0000ff',
    neutral: '#ffc920b7',
  },
  {
    name: 'Support_OrangeBlue',
    alpha: '#ffd89115',
    bravo: '#ff1654be',
    charlie: '#ff536e99',
    neutral: '#ff96c722',
  },
  {
    name: 'Support_OrangeBlue_Night',
    alpha: '#ffb97b12',
    bravo: '#ff1750a5',
    charlie: '#ff536e99',
    neutral: '#ff7da71e',
  },
  {
    name: 'Support_TriColor',
    alpha: '#ffbdb913',
    bravo: '#ffc741ac',
    charlie: '#ff4728ac',
    neutral: '#ffb0c444',
  },
  {
    name: 'Support_TriColor2',
    alpha: '#ffba5e1d',
    bravo: '#ff5777ab',
    charlie: '#ff2a3891',
    neutral: '#ffffff00',
  },
  {
    name: 'Support_YellowBlue',
    alpha: '#ffcaba20',
    bravo: '#ff502eba',
    charlie: '#ff536e99',
    neutral: '#ffb62aa7',
  },
  {
    name: 'Support_YellowBlue_Night',
    alpha: '#ffbaab1d',
    bravo: '#ff4428a3',
    charlie: '#ff536e99',
    neutral: '#ffb62aa7',
  },
  {
    name: 'TriColorDefault',
    alpha: '#ff10b780',
    bravo: '#ffa316b0',
    charlie: '#ffb45a1e',
    neutral: '#ffc70864',
  },
  {
    name: 'TriColorSameTeamMatch',
    alpha: '#ff10b780',
    bravo: '#ffa316b0',
    charlie: '#ffb45a1e',
    neutral: '#ffc70864',
  },
  {
    name: 'TurquoisePink',
    alpha: '#ff1bbeab',
    bravo: '#ffc43a6e',
    charlie: '#ff0000ff',
    neutral: '#ff4e4edd',
  },
  {
    name: 'TurquoiseRed',
    alpha: '#ff1ec0ad',
    bravo: '#ffd74b31',
    charlie: '#ff0000ff',
    neutral: '#ff0d0ddc',
  },
  {
    name: 'WarmingUpYellowBlue',
    alpha: '#ffdacd12',
    bravo: '#ff4b25c9',
    charlie: '#ff0000ff',
    neutral: '#ffb62ea7',
  },
  {
    name: 'YellowBlue',
    alpha: '#ffd0be08',
    bravo: '#ff3a0ccd',
    charlie: '#ff0000ff',
    neutral: '#ffb62ea7',
  },
  {
    name: 'YellowPurple',
    alpha: '#ffceb121',
    bravo: '#ff9025c6',
    charlie: '#ff0000ff',
    neutral: '#ff5dab21',
  },
];

// Raccourcit une couleur hex à ses 6 derniers caractères
function trimColorHex(color: string) {
  return color.slice(-6);
}

// Applique trim sur toutes les propriétés de couleur
function trimAllColors(obj: RawColor): RawColor {
  return {
    ...obj,
    alpha: trimColorHex(obj.alpha),
    bravo: trimColorHex(obj.bravo),
    charlie: trimColorHex(obj.charlie),
    neutral: trimColorHex(obj.neutral),
  };
}

export const colors: RawColor[] = RAW_COLORS.map(trimAllColors);