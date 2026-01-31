import { allObjects } from '@/data/allObjects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type ObjectType = 'figures' | 'lockers' | 'stickers';
type ObjectKey = `${ObjectType}-${number}`;

type SelectedObjects = {
  [key in ObjectKey]?: number;
};

export type FishScaleCount = {
  Bronze: number;
  Silver: number;
  Gold: number;
};

type ObjectsContextType = {
  selectedObjects: SelectedObjects;
  toggleObject: (type: ObjectType, id: number) => void;
  isOwned: (type: ObjectType, id: number) => boolean;
  getObjectCount: (type: ObjectType, id: number) => number;
  setObjectCount: (type: ObjectType, id: number, count: number) => void;
  getObjectsTotalSpent: (category?: ObjectType) => number;
  getObjectsTotalPossible: (category?: ObjectType) => number;
  getTotalFishScales: () => number;
  getOwnedFishScales: () => number;
  getOwnedFishScalesByType: (category?: ObjectType) => FishScaleCount;
  getTotalFishScalesByType: (category?: ObjectType) => FishScaleCount;

  isLoading: boolean;
};

const ObjectsContext = createContext<ObjectsContextType | undefined>(undefined);

export const ObjectsProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedObjects, setSelectedObjects] = useState<SelectedObjects>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('selectedObjects');
        if (saved) {
          const parsed = JSON.parse(saved);
          const migrated: SelectedObjects = {};
          for (const key in parsed) {
            migrated[key as ObjectKey] =
              typeof parsed[key] === 'boolean'
                ? parsed[key] ? 1 : 0
                : parsed[key];
          }

          setSelectedObjects(migrated);
        }
      } catch (err) {
        console.error('Erreur lors du parsing AsyncStorage:', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    (async () => {
      try {
        await AsyncStorage.setItem('selectedObjects', JSON.stringify(selectedObjects));
      } catch (err) {
        console.error('Erreur lors de la sauvegarde AsyncStorage:', err);
      }
    })();
  }, [selectedObjects, isLoading]);

  const getKey = (type: ObjectType, id: number): ObjectKey =>
    `${type}-${id}`;

  const getObjectCount = (type: ObjectType, id: number): number =>
    selectedObjects[getKey(type, id)] ?? 0;

  const setObjectCount = (type: ObjectType, id: number, count: number) => {
    const key = getKey(type, id);
    setSelectedObjects(prev => ({
      ...prev,
      [key]: count,
    }));
  };

  const toggleObject = (type: ObjectType, id: number) => {
    const current = getObjectCount(type, id);
    setObjectCount(type, id, current > 0 ? 0 : 1);
  };

  const isOwned = (type: ObjectType, id: number) => getObjectCount(type, id) > 0;

  const getObjectsTotalSpent = (category?: ObjectType): number => {
    return allObjects.reduce((sum, object) => {
      if (category && object.category !== category) return sum;

      const count = getObjectCount(object.category, object.id);
      const price = object.price ?? 0;

      return sum + count * price;
    }, 0);
  };

  const getObjectsTotalPossible = (category?: ObjectType): number => {
    return allObjects.reduce((sum, object) => {
      if (category && object.category !== category) return sum;

      const price = object.price ?? 0;
      const max = Number(object.maxNumber ?? 0);

      return sum + max * price;
    }, 0);
  };

  const parseFishScalePrice = (price: string): FishScaleCount => {
    const result: FishScaleCount = { Bronze: 0, Silver: 0, Gold: 0 };

    const bronzeMatch = price.match(/Bronze:\s*(\d+)/i);
    const silverMatch = price.match(/Silver:\s*(\d+)/i);
    const goldMatch = price.match(/Gold:\s*(\d+)/i);

    if (bronzeMatch) result.Bronze = parseInt(bronzeMatch[1], 10);
    if (silverMatch) result.Silver = parseInt(silverMatch[1], 10);
    if (goldMatch) result.Gold = parseInt(goldMatch[1], 10);

    return result;
  };

  const getOwnedFishScales = (): number => {
    return allObjects.reduce((sum, object) => {
      const count = getObjectCount(object.category, object.id);
      if (!count || !object.fishScalePrice) return sum;

      const scales = parseFishScalePrice(object.fishScalePrice);
      return (
        sum +
        (scales.Bronze + scales.Silver + scales.Gold) * count
      );
    }, 0);
  };

  const getTotalFishScales = (): number => {
    return allObjects.reduce((sum, object) => {
      if (!object.fishScalePrice) return sum;

      const scales = parseFishScalePrice(object.fishScalePrice);
      const max = Number(object.maxNumber ?? 0);

      return (
        sum +
        (scales.Bronze + scales.Silver + scales.Gold) * max
      );
    }, 0);
  };

  const getOwnedFishScalesByType = (category?: ObjectType): FishScaleCount => {
    return allObjects.reduce((acc, object) => {
      if (category && object.category !== category) return acc;

      const count = getObjectCount(object.category, object.id);
      if (!count || !object.fishScalePrice) return acc;

      const scales = parseFishScalePrice(object.fishScalePrice);
      acc.Bronze += scales.Bronze * count;
      acc.Silver += scales.Silver * count;
      acc.Gold += scales.Gold * count;

      return acc;
    }, { Bronze: 0, Silver: 0, Gold: 0 });
  };

  const getTotalFishScalesByType = (
    category?: ObjectType
  ): FishScaleCount => {
    return allObjects.reduce(
      (acc, object) => {
        if (category && object.category !== category) return acc;

        const max = Number(object.maxNumber ?? 0);
        if (!max || !object.fishScalePrice) return acc;

        const scales = parseFishScalePrice(object.fishScalePrice);
        acc.Bronze += scales.Bronze * max;
        acc.Silver += scales.Silver * max;
        acc.Gold += scales.Gold * max;

        return acc;
      },
      { Bronze: 0, Silver: 0, Gold: 0 }
    );
  };

  return (
    <ObjectsContext.Provider
      value={{
        selectedObjects,
        toggleObject,
        isOwned,
        getObjectCount,
        setObjectCount,
        getObjectsTotalSpent,
        getObjectsTotalPossible,
        getTotalFishScales,
        getOwnedFishScales,
        getOwnedFishScalesByType,
        getTotalFishScalesByType,
        isLoading,
      }}
    >
      {children}
    </ObjectsContext.Provider>
  );
};

export const useObjects = () => {
  const ctx = useContext(ObjectsContext);
  if (!ctx) throw new Error('useObjects must be used inside ObjectsProvider');
  return ctx;
};
