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

  // Charger depuis AsyncStorage
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('selectedTableTurf');
      if (saved) setSelectedTableTurf(JSON.parse(saved));
    })();
  }, []);

  // Sauvegarder automatiquement
  useEffect(() => {
    AsyncStorage.setItem('selectedTableTurf', JSON.stringify(selectedTableTurf));
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
