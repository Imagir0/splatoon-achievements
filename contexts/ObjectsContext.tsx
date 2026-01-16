import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type ObjectType = 'figures' | 'lockers' | 'stickers';
type ObjectKey = `${ObjectType}-${number}`;

type SelectedObjects = {
  [key in ObjectKey]?: boolean;
};

type ObjectsContextType = {
  selectedObjects: SelectedObjects;
  toggleObject: (type: ObjectType, id: number) => void;
  isOwned: (type: ObjectType, id: number) => boolean;
};

const ObjectsContext = createContext<ObjectsContextType | undefined>(undefined);

export const ObjectsProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedObjects, setSelectedObjects] = useState<SelectedObjects>({});

  // Charger depuis AsyncStorage
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('selectedObjects');
      if (saved) setSelectedObjects(JSON.parse(saved));
    })();
  }, []);

  // Sauvegarder automatiquement
  useEffect(() => {
    AsyncStorage.setItem('selectedObjects', JSON.stringify(selectedObjects));
  }, [selectedObjects]);

  const toggleObject = (type: ObjectType, id: number) => {
    const key: ObjectKey = `${type}-${id}`;

    setSelectedObjects(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isOwned = (type: ObjectType, id: number) => {
    return !!selectedObjects[`${type}-${id}`];
  };

  return (
    <ObjectsContext.Provider value={{ selectedObjects, toggleObject, isOwned }}>
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
