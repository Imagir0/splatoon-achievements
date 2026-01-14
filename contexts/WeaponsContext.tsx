import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type SelectedWeapons = {
  [key: number]: boolean;
};

type WeaponsContextType = {
  selectedWeapons: SelectedWeapons;
  toggleWeapon: (id: number) => void;
};

const WeaponsContext = createContext<WeaponsContextType | undefined>(undefined);
export const WeaponsProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedWeapons, setSelectedWeapons] = useState<SelectedWeapons>({});

  // Charger depuis AsyncStorage
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('selectedWeapons');
      if (saved) setSelectedWeapons(JSON.parse(saved));
    })();
  }, []);

  // Sauvegarder automatiquement
  useEffect(() => {
    AsyncStorage.setItem('selectedWeapons', JSON.stringify(selectedWeapons));
  }, [selectedWeapons]);

  const toggleWeapon = (id: number) => {
    setSelectedWeapons(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <WeaponsContext.Provider value={{ selectedWeapons, toggleWeapon }}>
      {children}
    </WeaponsContext.Provider>
  );
};

export const useWeapons = () => {
  const ctx = useContext(WeaponsContext);
  if (!ctx) throw new Error('useWeapons must be used inside WeaponsProvider');
  return ctx;
};
