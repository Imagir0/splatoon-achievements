import { figures } from '@/data/figures';
import { lockers } from '@/data/lockers';
import { stickers } from '@/data/stickers';

export const OBJECTS_DATA = {
  figures,
  lockers,
  stickers,
} as const;

export type ObjectItem = {
  id: number;
  name: string;
  category: 'figures' | 'lockers' | 'stickers';
  howToGet: string;
};
