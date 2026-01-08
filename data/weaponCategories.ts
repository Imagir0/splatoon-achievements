type Badge = {
  id: number;
  image: any;
  category: string;
  description: string;
};

export const weaponCategories: Record<
  string,
  {
    title: string;
    filter: (b: Badge) => boolean;
  }
> = {
  shooters: {
    title: 'Lanceurs',
    filter: (b: Badge) =>
      b.category.includes('WeaponLevel') &&
      (b.id.toString().startsWith('1000') || b.id.toString().startsWith('1001') || b.id.toString().startsWith('1003') || b.id.toString().startsWith('1004')),
  },

  rollers: {
    title: 'Rouleaux',
    filter: (b: Badge) =>
      b.category.includes('WeaponLevel') &&
      b.id.toString().startsWith('1010'),
  },

  chargers: {
    title: 'Fusils',
    filter: (b: Badge) =>
      b.category.includes('WeaponLevel') &&
      b.id.toString().startsWith('1020'),
  },

  sloshers: {
    title: 'Seaux',
    filter: (b: Badge) =>
      b.category.includes('WeaponLevel') &&
      b.id.toString().startsWith('1030'),
  },

  splatlings: {
    title: 'Badigeonneurs',
    filter: (b: Badge) =>
      b.category.includes('WeaponLevel') &&
      b.id.toString().startsWith('1040'),
  },

  dualies: {
    title: 'Doubles',
    filter: (b: Badge) =>
      b.category.includes('WeaponLevel') &&
      b.id.toString().startsWith('1050'),
  },

  brellas: {
    title: 'Para-encre',
    filter: (b: Badge) =>
      b.category.includes('WeaponLevel') &&
      b.id.toString().startsWith('1060'),
  },

  blasters: {
    title: 'Blasters',
    filter: (b: Badge) =>
      b.category.includes('WeaponLevel') &&
      b.id.toString().startsWith('1002'),
  },

  brushes: {
    title: 'Épinceaux',
    filter: (b: Badge) =>
      b.category.includes('WeaponLevel') &&
      b.id.toString().startsWith('1011'),
  },

  bows: {
    title: 'Arcs',
    filter: (b: Badge) =>
      b.category.includes('WeaponLevel') &&
      b.id.toString().startsWith('1070'),
  },

  splatanas: {
    title: 'Éclatanas',
    filter: (b: Badge) =>
      b.category.includes('WeaponLevel') &&
      b.id.toString().startsWith('1080'),
  },
} as const;

export type WeaponCategoryKey = keyof typeof weaponCategories;
