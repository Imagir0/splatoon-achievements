import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type SelectedBadges = {
  [key: number]: boolean;
};

type BadgesContextType = {
  selectedBadges: SelectedBadges;
  toggleBadge: (id: number) => void;
};

const BadgesContext = createContext<BadgesContextType | undefined>(undefined);

export const BadgesProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedBadges, setSelectedBadges] = useState<SelectedBadges>({});

  // Charger depuis AsyncStorage
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('selectedBadges');
      if (saved) setSelectedBadges(JSON.parse(saved));
    })();
  }, []);

  // Sauvegarder automatiquement
  useEffect(() => {
    AsyncStorage.setItem('selectedBadges', JSON.stringify(selectedBadges));
  }, [selectedBadges]);

  const toggleBadge = (id: number) => {
    setSelectedBadges(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <BadgesContext.Provider value={{ selectedBadges, toggleBadge }}>
      {children}
    </BadgesContext.Provider>
  );
};

export const useBadges = () => {
  const ctx = useContext(BadgesContext);
  if (!ctx) throw new Error('useBadges must be used inside BadgesProvider');
  return ctx;
};
