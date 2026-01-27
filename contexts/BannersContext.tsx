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
  const [isLoading, setIsLoading] = useState(true); // Pour loader si besoin

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('selectedBanners');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSelectedBanners(parsed);
          // console.log('Banners chargés ✅', parsed);
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
        await AsyncStorage.setItem('selectedBanners', JSON.stringify(selectedBanners));
        // console.log('Banners sauvegardés ✅', selectedBanners);
      } catch (err) {
        console.error('Erreur lors de la sauvegarde AsyncStorage:', err);
      }
    })();
  }, [selectedBanners, isLoading]);

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
