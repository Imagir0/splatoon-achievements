import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type SelectedSalmonSkins = {
  [key: number]: boolean;
};

type SalmonSkinsContextType = {
  selectedSalmonSkins: SelectedSalmonSkins;
  toggleSalmonSkins: (id: number) => void;
};

const SalmonSkinsContext = createContext<SalmonSkinsContextType | undefined>(undefined);

export const SalmonSkinsProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedSalmonSkins, setSelectedSalmonSkins] = useState<SelectedSalmonSkins>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('selectedSalmonSkins');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSelectedSalmonSkins(parsed);
          // console.log('Salmon Skins chargés ✅', parsed);
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
        await AsyncStorage.setItem('selectedSalmonSkins', JSON.stringify(selectedSalmonSkins));
        // console.log('Salmon Skins sauvegardés ✅', selectedSalmonSkins);
      } catch (err) {
        console.error('Erreur lors de la sauvegarde AsyncStorage:', err);
      }
    })();
  }, [selectedSalmonSkins, isLoading]);

  const toggleSalmonSkins = (id: number) => {
    setSelectedSalmonSkins(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <SalmonSkinsContext.Provider value={{ selectedSalmonSkins, toggleSalmonSkins }}>
      {children}
    </SalmonSkinsContext.Provider>
  );
};

export const useSalmonSkins = () => {
  const ctx = useContext(SalmonSkinsContext);
  if (!ctx) throw new Error('useSalmonSkins must be used inside SalmonSkinsProvider');
  return ctx;
};
