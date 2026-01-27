import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type ObjectType = 'figures' | 'lockers' | 'stickers';
type ObjectKey = `${ObjectType}-${number}`;

type SelectedObjects = {
  [key in ObjectKey]?: number;
};

type ObjectsContextType = {
  selectedObjects: SelectedObjects;
  toggleObject: (type: ObjectType, id: number) => void;
  isOwned: (type: ObjectType, id: number) => boolean;
  getObjectCount: (type: ObjectType, id: number) => number;
  setObjectCount: (type: ObjectType, id: number, count: number) => void;
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
          // console.log('Objects chargés ✅', migrated);
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
        // console.log('Objects sauvegardés ✅', selectedObjects);
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

  return (
    <ObjectsContext.Provider
      value={{
        selectedObjects,
        toggleObject,
        isOwned,
        getObjectCount,
        setObjectCount,
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
