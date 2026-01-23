import type { ObjectItem } from '@/data/allObjects';

type ObjectFilter = (o: ObjectItem) => boolean;

export const objectsFilters: Record<
  'figures' | 'lockers' | 'stickers',
  Record<string, ObjectFilter>
> = {
  figures: {
    spend: (o) =>
      o.category === 'figures' &&
      (
        o.howToGet.includes('Shop') ||
        o.howToGet.includes('Catalog')
      ),

    rank: (o) =>
      o.category === 'figures' &&
      o.howToGet.includes('Other') &&
      o.id >= 300001 && o.id <= 300104,

    salmon: (o) =>
      o.category === 'figures' &&
      o.howToGet.includes('Uroko') &&
      (o.id >= 1200000 && o.id <= 1200024 ||
      o.id === 1200145),

    salmonEvent: (o) =>
      o.category === 'figures' &&
      o.howToGet.includes('Other') &&
      o.id >= 1200031 && o.id <= 1200144 &&
      o.id != 1200115,

    tableturf: (o) =>
      o.category === 'figures' &&
      o.howToGet.includes('Other') &&
      o.id >= 1400000 && o.id <= 1400002,

    story: (o) =>
      o.category === 'figures' &&
      o.howToGet.includes('Other') &&
      o.id >= 1300000 && o.id <= 1300028,

    dlc: (o) =>
      o.category === 'figures' &&
      o.howToGet.includes('Other') &&
      o.id >= 1310000 && o.id <= 1320006,
  },

  lockers: {
    general: (o) =>
      o.category === 'lockers',
  },

  stickers: {
    spend: (o) =>
      o.category === 'stickers' &&
      (
        o.howToGet.includes('Shop') ||
        o.howToGet.includes('Catalog')
      ),

    weapons: (o) =>
      o.category === 'stickers' &&
      o.howToGet.includes('Other') &&
      o.id >= 6000000 && o.id <= 6080121 ||
      o.id >= 6400534 && o.id <= 6400826 ||
      o.id >= 6400975 && o.id <= 6400978 ||
      o.id >= 6401021 && o.id <= 6401026 ||
      o.id === 6401028 ||
      o.id >= 6401060 && o.id <= 6401068 ||
      o.id >= 6401095 && o.id <= 6401128 ||
      o.id >= 6401137 && o.id <= 6401142,

    salmon: (o) =>
      o.category === 'stickers' &&
      o.howToGet.includes('Uroko') &&
      o.id >= 6200000 && o.id <= 6200502,

    salmonEvent: (o) =>
      o.category === 'stickers' &&
      o.howToGet.includes('Other') &&
      o.id >= 6202001 && o.id <= 6202034 ||
      o.id >= 6400967 && o.id <= 6400974 ||
      o.id >= 6401001 && o.id <= 6401006 ||
      o.id >= 6401008 && o.id <= 6401009 ||
      o.id >= 6401073 && o.id <= 6401078 ||
      o.id >= 6401088 && o.id <= 6401089 ||
      o.id >= 6401129 && o.id <= 6401136,

    tableturf: (o) =>
      o.category === 'stickers' &&
      o.howToGet.includes('Other') &&
      o.id >= 6400101 && o.id <= 6400107,

    story: (o) =>
      o.category === 'stickers' &&
      o.howToGet.includes('Other') &&
      o.id >= 6300100 && o.id <= 6300300,

    dlc: (o) =>
      o.category === 'stickers' &&
      o.howToGet.includes('Other') &&
      o.id >= 6400991 && o.id <= 6401000 ||
      o.id >= 6401044 && o.id <= 6401056 ||
      o.id >= 6401029 && o.id <= 6401043,
  },
};
