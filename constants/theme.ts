import { Platform } from 'react-native';

const weaponsColors = {
  shooter: '#a5b4fc',
  blaster: '#e66f6fff',
  roller: '#dd9b87',
  brush: '#ba76f1',
  charger: '#8d9cee',
  slosher: '#90ec98',
  spinner: '#eed261',
  maneuver: '#da74af',
  shelter: '#b4b3af',
  stringer: '#4c6d52',
  saber: '#ecece8',
};

const categoriesColors = {
  story: '#b47165',
  dlc: '#dfdfdfff',
  spending: '#ff9284ff',
  others: '#f3f576ff',
  splatfest: '#e76ee1ff',
  challenge: '#F03481',
  rank: '#4ade80',
  gears: '#e66f6fff',
  tableturf: '#b85cf6',
  salmon: '#eb3919ff',
  specialWeapons: '#7288f1ff',
  weapons: '#a5b4fc',
  codeqr: '#a79191',
  news: '#fca5a5',
  heads: '#a5b4fc',
  clothes: '#4ade80',
  shoes: '#e66f6fff',
  figures: '#a5b4fc',
  stickers: '#4ade80',
  lockers: '#e66f6fff',
};

export const lightTheme = {
  colors: {
    background: '#f2f2f2',
    surface: '#ffffff',
    text: '#111827',
    textMuted: '#6b7280',
    border: '#e5e7eb',
    primary: '#e92626ff',
    icon: '#374151',
    header: '#ffffff',
    progressBar: '#1870d4',
    rowChecked: '#2dbd62',
    white: '#fff',
    black: '#000',
  },
  weapons: weaponsColors,
  categories: categoriesColors,
};

export const darkTheme = {
  colors: {
    background: '#000000',
    surface: '#363232ff',
    text: '#f9fafb',
    textMuted: '#9ca3af',
    border: '#575a5f',
    primary: '#e92626ff',
    icon: '#e5e7eb',
    header: '#000000',
    progressBar: '#1ea851',
    rowChecked: '#2dbd62',
    white: '#fff',
    black: '#000',
  },
  weapons: weaponsColors,
  categories: categoriesColors,
};

export type AppTheme = typeof lightTheme;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
