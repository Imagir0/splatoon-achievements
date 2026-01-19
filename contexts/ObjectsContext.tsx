import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type ObjectType = 'figures' | 'lockers' | 'stickers';
type ObjectKey = `${ObjectType}-${number}`;

/**
 * Stocke la quantité possédée
 * 0 ou undefined = non possédé
 * >=1 = possédé
 */
type SelectedObjects = {
  [key in ObjectKey]?: number;
};

type ObjectsContextType = {
  selectedObjects: SelectedObjects;

  // Compatibilité existante
  toggleObject: (type: ObjectType, id: number) => void;
  isOwned: (type: ObjectType, id: number) => boolean;

  // Nouvelle API quantitative
  getObjectCount: (type: ObjectType, id: number) => number;
  setObjectCount: (type: ObjectType, id: number, count: number) => void;
};

const ObjectsContext = createContext<ObjectsContextType | undefined>(undefined);

export const ObjectsProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedObjects, setSelectedObjects] = useState<SelectedObjects>({});

  /** Chargement depuis AsyncStorage */
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('selectedObjects');
      if (saved) {
        const parsed = JSON.parse(saved);

        /**
         * Migration douce :
         * boolean → number
         */
        const migrated: SelectedObjects = {};
        for (const key in parsed) {
          migrated[key as ObjectKey] =
            typeof parsed[key] === 'boolean'
              ? parsed[key] ? 1 : 0
              : parsed[key];
        }

        setSelectedObjects(migrated);
      }
    })();
  }, []);

  /** Sauvegarde automatique */
  useEffect(() => {
    AsyncStorage.setItem('selectedObjects', JSON.stringify(selectedObjects));
  }, [selectedObjects]);

  const getKey = (type: ObjectType, id: number): ObjectKey =>
    `${type}-${id}`;

  /** Nouvelle logique quantitative */
  const getObjectCount = (type: ObjectType, id: number): number => {
    return selectedObjects[getKey(type, id)] ?? 0;
  };

  const setObjectCount = (type: ObjectType, id: number, count: number) => {
    const key = getKey(type, id);

    setSelectedObjects(prev => ({
      ...prev,
      [key]: count,
    }));
  };

  /** Compatibilité objets uniques */
  const toggleObject = (type: ObjectType, id: number) => {
    const current = getObjectCount(type, id);
    setObjectCount(type, id, current > 0 ? 0 : 1);
  };

  const isOwned = (type: ObjectType, id: number) => {
    return getObjectCount(type, id) > 0;
  };

  return (
    <ObjectsContext.Provider
      value={{
        selectedObjects,
        toggleObject,
        isOwned,
        getObjectCount,
        setObjectCount,
      }}
    >
      {children}
    </ObjectsContext.Provider>
  );
};

export const useObjects = () => {
  const ctx = useContext(ObjectsContext);
  if (!ctx) {
    throw new Error('useObjects must be used inside ObjectsProvider');
  }
  return ctx;
};
