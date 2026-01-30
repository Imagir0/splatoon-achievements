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
  maxNumber: string;
  fishScalePrice: string;
  price: number;
};

export const allObjects: ObjectItem[] = [
  ...figures.map(item => ({ ...item, category: 'figures' as const, price: Number(item.price ?? 0) })),
  ...lockers.map(item => ({ ...item, category: 'lockers' as const, price: Number(item.price ?? 0) })),
  ...stickers.map(item => ({ ...item, category: 'stickers' as const, price: Number(item.price ?? 0) })),
];
