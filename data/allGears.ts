import { clothes } from '@/data/clothes';
import { heads } from '@/data/heads';
import { shoes } from '@/data/shoes';

export type GearType = 'clothes' | 'heads' | 'shoes';

export type GearItem = {
  id: number;
  type: GearType;
  image: any;
  name: string;
};

export const allGears: GearItem[] = [
  ...clothes.map(item => ({ ...item, type: 'clothes' as const })),
  ...heads.map(item => ({ ...item, type: 'heads' as const })),
  ...shoes.map(item => ({ ...item, type: 'shoes' as const })),
];
