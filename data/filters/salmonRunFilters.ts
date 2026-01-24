type Badge = {
  id: number;
  image: any;
  category: string;
  description: string;
};

export const salmonRunCategories: Record<
  string,
  {
    title: string;
    filter: (b: Badge) => boolean;
  }
> = {
  general: {
    title: 'Général',
    filter: (b: Badge) =>
      b.category.includes('CoopBigRunTrophy') ||
      b.category.includes('CoopClearDangerRateMax') ||
      b.category.includes('CoopContestTrophy') ||
      b.category.includes('CoopKillTripleBoss') ||
      b.category.includes('TotalKumaPoint'),
  },

  ennemies: {
    title: 'Ennemis',
    filter: (b: Badge) =>
      b.category.includes('CoopRareEnemyKillNum'),
  },

  maps: {
    title: 'Cartes',
    filter: (b: Badge) =>
      b.category.includes('CoopGrade_Normal'),
  },

  bosses: {
    title: 'Salmonarques',
    filter: (b: Badge) =>
      b.category.includes('CoopBossKillNum'),
  },
} as const;

export type SalmonRunCategoryKey = keyof typeof salmonRunCategories;
