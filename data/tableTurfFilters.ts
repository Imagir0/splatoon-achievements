export const tableTurfFilters: Record<string, (b: any) => boolean> = {
  season1: (b) =>
    b.season.includes('1'),

  season2: (b) =>
    b.season.includes('2'),

  season4: (b) =>
    b.season.includes('4'),

  season5: (b) =>
    b.season.includes('5'),

  season6: (b) =>
    b.season.includes('6'),

  season7: (b) =>
    b.season.includes('7'),

  season8: (b) =>
    b.season.includes('8'),

};