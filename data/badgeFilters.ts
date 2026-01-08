export const badgeFilters: Record<string, (b: any) => boolean> = {
  splatfest: (b) =>
    b.category.includes('Fest') ||
    b.category.includes('WinCount_Tcl'),

  tableturf: (b) =>
    b.category.includes('Nawa'),

  storyMode: (b) =>
    b.category.includes('Mission'),

  challenge: (b) =>
    b.category.includes('Event'),

  DLC: (b) =>
    b.category.includes('Sdodr'),

  rankLevel: (b) =>
    b.category.includes('challenge') ||
    b.category.includes('Rank') ||
    b.category.includes('Udemae') ||
    b.category.includes('XRank'),

  equipement: (b) =>
    b.category.includes('Gear'),

  spending: (b) =>
    b.category.includes('Order') ||
    b.category.includes('Spend'),

  gameModes: (b) =>
    b.category.includes('WinCount'),

  weapons: (b) =>
    b.category.includes('Weapon'),

  specialWeapons: (b) =>
    b.category.includes('WinCount_WeaponSp'),
};