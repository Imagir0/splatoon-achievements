import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type GearType = 'clothes' | 'heads' | 'shoes';
type GearKey = `${GearType}-${number}`;

type SelectedGears = {
  [key in GearKey]?: boolean;
};

type GearsContextType = {
  selectedGears: SelectedGears;
  toggleGear: (type: GearType, id: number) => void;
  isOwned: (type: GearType, id: number) => boolean;
};

const GearsContext = createContext<GearsContextType | undefined>(undefined);

export const GearsProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedGears, setSelectedGears] = useState<SelectedGears>({});

  // Charger depuis AsyncStorage
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('selectedGears');
      if (saved) setSelectedGears(JSON.parse(saved));
    })();
  }, []);

  // Sauvegarder automatiquement
  useEffect(() => {
    AsyncStorage.setItem('selectedGears', JSON.stringify(selectedGears));
  }, [selectedGears]);

  const toggleGear = (type: GearType, id: number) => {
    const key: GearKey = `${type}-${id}`;

    setSelectedGears(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isOwned = (type: GearType, id: number) => {
    return !!selectedGears[`${type}-${id}`];
  };

  return (
    <GearsContext.Provider value={{ selectedGears, toggleGear, isOwned }}>
      {children}
    </GearsContext.Provider>
  );
};

export const useGears = () => {
  const ctx = useContext(GearsContext);
  if (!ctx) {
    throw new Error('useGears must be used inside GearsProvider');
  }
  return ctx;
};
