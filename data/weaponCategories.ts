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
      (b.id.toString().startsWith('1000') || b.id.toString().startsWith('1001') || b.id.toString().startsWith('1003') || b.id.toString().startsWith('1004')) &&
      b.description.toLowerCase().includes('4'),
  },

  rollers: {
    title: 'Rouleaux',
    filter: (b: Badge) =>
      b.category.includes('WeaponLevel') &&
      b.id.toString().startsWith('1010') &&
      b.description.toLowerCase().includes('4'),
  },

  chargers: {
    title: 'Fusils',
    filter: (b: Badge) =>
      b.category.includes('WeaponLevel') &&
      b.id.toString().startsWith('1020') &&
      b.description.toLowerCase().includes('4'),
  },

  sloshers: {
    title: 'Seaux',
    filter: (b: Badge) =>
      b.category.includes('WeaponLevel') &&
      b.id.toString().startsWith('1030') &&
      b.description.toLowerCase().includes('4'),
  },

  splatlings: {
    title: 'Badigeonneurs',
    filter: (b: Badge) =>
      b.category.includes('WeaponLevel') &&
      b.id.toString().startsWith('1040') &&
      b.description.toLowerCase().includes('4'),
  },

  dualies: {
    title: 'Doubles',
    filter: (b: Badge) =>
      b.category.includes('WeaponLevel') &&
      b.id.toString().startsWith('1050') &&
      b.description.toLowerCase().includes('4'),
  },

  brellas: {
    title: 'Para-encre',
    filter: (b: Badge) =>
      b.category.includes('WeaponLevel') &&
      b.id.toString().startsWith('1060') &&
      b.description.toLowerCase().includes('4'),
  },

  blasters: {
    title: 'Blasters',
    filter: (b: Badge) =>
      b.category.includes('WeaponLevel') &&
      b.id.toString().startsWith('1002') &&
      b.description.toLowerCase().includes('4'),
  },

  brushes: {
    title: 'Épinceaux',
    filter: (b: Badge) =>
      b.category.includes('WeaponLevel') &&
      b.id.toString().startsWith('1011') &&
      b.description.toLowerCase().includes('4'),
  },

  bows: {
    title: 'Arcs',
    filter: (b: Badge) =>
      b.category.includes('WeaponLevel') &&
      b.id.toString().startsWith('1070') &&
      b.description.toLowerCase().includes('4'),
  },

  splatanas: {
    title: 'Éclatanas',
    filter: (b: Badge) =>
      b.category.includes('WeaponLevel') &&
      b.id.toString().startsWith('1080') &&
      b.description.toLowerCase().includes('4'),
  },
} as const;

export type WeaponCategoryKey = keyof typeof weaponCategories;
