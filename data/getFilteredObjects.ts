import { ObjectItem } from '@/data/allObjects';
import { objectsFilters } from '@/data/objectsFilters';

export function getFilteredObjects(
  objects: ObjectItem[],
  category: keyof typeof objectsFilters,
  subCategory: string
) {
  const filter = objectsFilters[category]?.[subCategory];
  if (!filter) return [];

  return objects
    .filter(filter)
    .sort((a, b) => a.id - b.id);
}
