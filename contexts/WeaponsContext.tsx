import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type SelectedWeapons = {
  [key: number]: boolean;
};

type WeaponsContextType = {
  selectedWeapons: SelectedWeapons;
  toggleWeapon: (id: number) => void;
  isLoading: boolean;
};

const WeaponsContext = createContext<WeaponsContextType | undefined>(undefined);

export const WeaponsProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedWeapons, setSelectedWeapons] = useState<SelectedWeapons>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('selectedWeapons');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSelectedWeapons(parsed);
          // console.log('Weapons chargées ✅', parsed);
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
        await AsyncStorage.setItem('selectedWeapons', JSON.stringify(selectedWeapons));
        // console.log('Weapons sauvegardées ✅', selectedWeapons);
      } catch (err) {
        console.error('Erreur lors de la sauvegarde AsyncStorage:', err);
      }
    })();
  }, [selectedWeapons, isLoading]);

  const toggleWeapon = (id: number) => {
    setSelectedWeapons(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <WeaponsContext.Provider value={{ selectedWeapons, toggleWeapon, isLoading }}>
      {children}
    </WeaponsContext.Provider>
  );
};

export const useWeapons = () => {
  const ctx = useContext(WeaponsContext);
  if (!ctx) throw new Error('useWeapons must be used inside WeaponsProvider');
  return ctx;
};
