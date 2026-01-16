import { figures } from '@/data/figures';
import { lockers } from '@/data/lockers';
import { stickers } from '@/data/stickers';

export type ObjectType = 'figures' | 'lockers' | 'stickers';

export type ObjectItem = {
  id: number;
  name: string;
  category: ObjectType;
  howToGet: string;
  image: any;
};

export const allObjects: ObjectItem[] = [
  ...figures.map(item => ({ ...item, category: 'figures' as const })),
  ...lockers.map(item => ({ ...item, category: 'lockers' as const })),
  ...stickers.map(item => ({ ...item, category: 'stickers' as const })),
];
