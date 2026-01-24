export const bannerFilters: Record<string, (b: any) => boolean> = {
  general: (b) =>
    b.id === 1 || (b.id > 1000 && b.id < 18002) &&
    b.howToGet.includes('Shop') ||
    b.howToGet.includes('Catalog'),

  salmonRun: (b) =>
    b.howToGet.includes('Uroko'),

  tableturf: (b) =>
    b.id === 1001 ||
    b.id === 1002 ||
    b.id === 1003,

  dlc: (b) =>
    b.id >= 800 && b.id < 900,

  codeQR: (b) =>
    b.id > 900 && b.id < 950,

  nSwitchNews: (b) =>
    b.id >= 951 && b.id <= 993,

  jackpots: (b) =>
    b.id >= 10001 && b.id < 10030,
};