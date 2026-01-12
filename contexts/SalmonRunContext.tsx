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

  // Charger depuis AsyncStorage
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('selectedSalmonSkins');
      if (saved) setSelectedSalmonSkins(JSON.parse(saved));
    })();
  }, []);

  // Sauvegarder automatiquement
  useEffect(() => {
    AsyncStorage.setItem('selectedSalmonSkins', JSON.stringify(selectedSalmonSkins));
  }, [selectedSalmonSkins]);

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
