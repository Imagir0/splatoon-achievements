import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type SelectedBadges = {
  [key: number]: boolean;
};

type BadgesContextType = {
  selectedBadges: SelectedBadges;
  toggleBadge: (id: number) => void;
  isLoading: boolean;
};

const BadgesContext = createContext<BadgesContextType | undefined>(undefined);

export const BadgesProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedBadges, setSelectedBadges] = useState<SelectedBadges>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('selectedBadges');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSelectedBadges(parsed);
          // console.log('Badges chargés ✅', parsed);
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
        await AsyncStorage.setItem('selectedBadges', JSON.stringify(selectedBadges));
        // console.log('Badges sauvegardés ✅', selectedBadges);
      } catch (err) {
        console.error('Erreur lors de la sauvegarde AsyncStorage:', err);
      }
    })();
  }, [selectedBadges, isLoading]);

  const toggleBadge = (id: number) => {
    setSelectedBadges(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <BadgesContext.Provider value={{ selectedBadges, toggleBadge, isLoading }}>
      {children}
    </BadgesContext.Provider>
  );
};

export const useBadges = () => {
  const ctx = useContext(BadgesContext);
  if (!ctx) throw new Error('useBadges must be used inside BadgesProvider');
  return ctx;
};
