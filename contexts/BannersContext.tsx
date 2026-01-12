import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type SelectedBanners = {
  [key: number]: boolean;
};

type BannersContextType = {
  selectedBanners: SelectedBanners;
  toggleBanner: (id: number) => void;
};

const BannersContext = createContext<BannersContextType | undefined>(undefined);

export const BannersProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedBanners, setSelectedBanners] = useState<SelectedBanners>({});

  // Charger depuis AsyncStorage
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('selectedBanners');
      if (saved) setSelectedBanners(JSON.parse(saved));
    })();
  }, []);

  // Sauvegarder automatiquement
  useEffect(() => {
    AsyncStorage.setItem('selectedBanners', JSON.stringify(selectedBanners));
  }, [selectedBanners]);

  const toggleBanner = (id: number) => {
    setSelectedBanners(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <BannersContext.Provider value={{ selectedBanners, toggleBanner }}>
      {children}
    </BannersContext.Provider>
  );
};

export const useBanners = () => {
  const ctx = useContext(BannersContext);
  if (!ctx) throw new Error('useBanners must be used inside BannersProvider');
  return ctx;
};
