export const weaponsFilters: Record<string, (b: any) => boolean> = {
  shooter: (b) =>
    b.internalName.includes('Shooter'),

  blaster: (b) =>
    b.internalName.includes('Blaster'),

  roller: (b) =>
    b.internalName.includes('Roller'),

  brush: (b) =>
    b.internalName.includes('Brush'),

  charger: (b) =>
    b.internalName.includes('Charger'),

  slosher: (b) =>
    b.internalName.includes('Slosher'),

  spinner: (b) =>
    b.internalName.includes('Spinner'),

  maneuver: (b) =>
    b.internalName.includes('Maneuver'),

  shelter: (b) =>
    b.internalName.includes('Shelter'),

  stringer: (b) =>
    b.internalName.includes('Stringer'),

  saber: (b) =>
    b.internalName.includes('Saber'),
};