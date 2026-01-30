import { clothes } from '@/data/clothes';
import { heads } from '@/data/heads';
import { shoes } from '@/data/shoes';

export type GearType = 'clothes' | 'heads' | 'shoes';

export type GearItem = {
  id: number;
  type: GearType;
  image: any;
  name: string;
  price: number;
};

export const allGears: GearItem[] = [
  ...clothes.map(item => ({ ...item, type: 'clothes' as const, price: Number(item.price ?? 0) })),
  ...heads.map(item => ({ ...item, type: 'heads' as const, price: Number(item.price ?? 0) })),
  ...shoes.map(item => ({ ...item, type: 'shoes' as const, price: Number(item.price ?? 0) })),
];
