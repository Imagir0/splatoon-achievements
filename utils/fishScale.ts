export type FishScaleCount = {
  Bronze: number;
  Silver: number;
  Gold: number;
};

export const parseFishScalePrice = (
  price: string
): FishScaleCount => {
  const result: FishScaleCount = {
    Bronze: 0,
    Silver: 0,
    Gold: 0,
  };

  if (!price || typeof price !== 'string') {
    return result;
  }

  const bronzeMatch = price.match(/Bronze\s*:\s*(\d+)/i);
  const silverMatch = price.match(/Silver\s*:\s*(\d+)/i);
  const goldMatch   = price.match(/Gold\s*:\s*(\d+)/i);

  if (bronzeMatch) {
    result.Bronze = parseInt(bronzeMatch[1], 10);
  }
  if (silverMatch) {
    result.Silver = parseInt(silverMatch[1], 10);
  }
  if (goldMatch) {
    result.Gold = parseInt(goldMatch[1], 10);
  }

  return result;
};

export const addFishScales = (
  a: FishScaleCount,
  b: FishScaleCount
): FishScaleCount => ({
  Bronze: a.Bronze + b.Bronze,
  Silver: a.Silver + b.Silver,
  Gold: a.Gold + b.Gold,
});

export const getFishScalesTotal = (
  scales: FishScaleCount
): number => {
  return scales.Bronze + scales.Silver + scales.Gold;
};
