import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type SelectedTableTurf = {
  [key: number]: boolean;
};

type TableTurfContextType = {
  selectedTableTurf: SelectedTableTurf;
  toggleTableTurf: (id: number) => void;
};

const TableTurfContext = createContext<TableTurfContextType | undefined>(undefined);

export const TableTurfProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedTableTurf, setSelectedTableTurf] = useState<SelectedTableTurf>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('selectedTableTurf');

        if (saved) {
          const parsed = JSON.parse(saved);
          setSelectedTableTurf(parsed);
          // console.log('Cartes chargées ✅', parsed);
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
        await AsyncStorage.setItem('selectedTableTurf', JSON.stringify(selectedTableTurf));
        //console.log('Données sauvegardées ✅', selectedTableTurf);
      } catch (err) {
        console.error('Erreur lors de la sauvegarde AsyncStorage:', err);
      }
    })();
  }, [selectedTableTurf]);

  const toggleTableTurf = (id: number) => {
    setSelectedTableTurf(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <TableTurfContext.Provider value={{ selectedTableTurf, toggleTableTurf }}>
      {children}
    </TableTurfContext.Provider>
  );
};

export const useTableTurf = () => {
  const ctx = useContext(TableTurfContext);
  if (!ctx) throw new Error('useTableTurf must be used inside TableTurfProvider');
  return ctx;
};
