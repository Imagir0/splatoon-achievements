export const badgeFilters: Record<string, (b: any) => boolean> = {
  splatfest: (b) =>
    b.category.includes('Fest') ||
    b.category.includes('WinCount_Tcl'),

  tableturf: (b) =>
    b.category.includes('NawaBattler'),

  storyMode: (b) =>
    b.category.includes('Mission'),

  challenge: (b) =>
    b.category.includes('Event'),

  DLC: (b) =>
    b.category.includes('Sdodr') && !b.category.includes('SpendShop_Sdodr'),

  rankLevel: (b) =>
    b.category.includes('challenge') ||
    b.category.includes('Rank') && !b.category.includes('NawaBattlerRank') && !b.category.includes('FestRankMax') ||
    b.category.includes('ChallengeWinStreak') ||
    b.category.includes('Udemae') ||
    b.category.includes('XPower') ||
    b.category.includes('XRank'),

  equipement: (b) =>
    b.category.includes('Gear'),

  spending: (b) =>
    b.category.includes('Order') ||
    b.category.includes('Spend') ||
    b.category.includes('SpendShop_Sdodr'),

  gameModes: (b) =>
    b.category.includes('WinCount') && !b.category.includes('WinCount_Tcl') && !b.category.includes('WinCount_WeaponSp') && !b.category.includes('WinCount_HighXPower'),

  weapons: (b) =>
    b.category.includes('Weapon') && !b.category.includes('WinCount_WeaponSp') ||
    b.category.includes('VariousWeaponLevel'),

  specialWeapons: (b) =>
    b.category.includes('WinCount_WeaponSp'),

  others: (b) =>
    b.category.includes('Lottery') && !b.category.includes('SpendLottery') ||
    b.category.includes('Catalogue') ||
    b.category.includes('Hammer'),
};