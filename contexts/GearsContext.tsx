import { allGears } from '@/data/allGears';
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
  getOwnedGears: (type?: GearType) => typeof allGears;
  getGearsTotalSpent: (type?: GearType) => number;
  getGearsTotalPossible: (type?: GearType) => number;
  isLoading: boolean;
};

const GearsContext = createContext<GearsContextType | undefined>(undefined);

export const GearsProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedGears, setSelectedGears] = useState<SelectedGears>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('selectedGears');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSelectedGears(parsed);
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
        await AsyncStorage.setItem('selectedGears', JSON.stringify(selectedGears));
      } catch (err) {
        console.error('Erreur lors de la sauvegarde AsyncStorage:', err);
      }
    })();
  }, [selectedGears, isLoading]);

  const toggleGear = (type: GearType, id: number) => {
    const key: GearKey = `${type}-${id}`;

    setSelectedGears(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isOwned = (type: GearType, id: number) => {
    const key: GearKey = `${type}-${id}`;
    return !!selectedGears[key];
  };

  const getOwnedGears = (type?: GearType) => {
    return allGears.filter(gear => {
      if (type && gear.type !== type) return false;

      const key: GearKey = `${gear.type}-${gear.id}`;
      return selectedGears[key] === true;
    });
  };

  const getGearsTotalSpent = (type?: GearType): number => {
    return allGears.reduce((sum, gear) => {
      if (type && gear.type !== type) return sum;

      const key: GearKey = `${gear.type}-${gear.id}`;
      if (!selectedGears[key]) return sum;

      return sum + (gear.price ?? 0);
    }, 0);
  };

  const getGearsTotalPossible = (type?: GearType): number => {
    return allGears.reduce((sum, gear) => {
      if (type && gear.type !== type) return sum;
      return sum + (gear.price ?? 0);
    }, 0);
  };

  return (
    <GearsContext.Provider
      value={{
        selectedGears,
        toggleGear,
        isOwned,
        getOwnedGears,
        getGearsTotalSpent,
        getGearsTotalPossible,
        isLoading,
      }}
    >
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
