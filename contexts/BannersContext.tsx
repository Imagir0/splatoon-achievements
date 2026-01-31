import { banners } from '@/data/banners';
import { parseFishScalePrice } from '@/utils/fishScale';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type SelectedBanners = {
  [key: number]: boolean;
};

export type FishScaleCount = {
  Bronze: number;
  Silver: number;
  Gold: number;
};

type BannersContextType = {
  selectedBanners: SelectedBanners;
  toggleBanner: (id: number) => void;
  getTotalFishScales: () => number;
  getOwnedFishScales: () => number;
  getOwnedFishScalesByType: () => FishScaleCount;
  getTotalFishScalesByType: () => FishScaleCount;
};

const BannersContext = createContext<BannersContextType | undefined>(undefined);

export const BannersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedBanners, setSelectedBanners] =
    useState<SelectedBanners>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('selectedBanners');
        if (saved) {
          setSelectedBanners(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Erreur AsyncStorage (load):', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    (async () => {
      try {
        await AsyncStorage.setItem(
          'selectedBanners',
          JSON.stringify(selectedBanners)
        );
      } catch (err) {
        console.error('Erreur AsyncStorage (save):', err);
      }
    })();
  }, [selectedBanners, isLoading]);

  const toggleBanner = (id: number) => {
    setSelectedBanners(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getTotalFishScales = (): number => {
    return banners.reduce((sum, banner) => {
      const scales = parseFishScalePrice(banner.fishScalePrice);
      return sum + scales.Bronze + scales.Silver + scales.Gold;
    }, 0);
  };

  const getOwnedFishScales = (): number => {
    return banners.reduce((sum, banner) => {
      if (!selectedBanners[banner.id]) return sum;

      const scales = parseFishScalePrice(banner.fishScalePrice);
      return sum + scales.Bronze + scales.Silver + scales.Gold;
    }, 0);
  };

  const getTotalFishScalesByType = (): FishScaleCount => {
    return banners.reduce(
      (acc, banner) => {
        const scales = parseFishScalePrice(banner.fishScalePrice);
        acc.Bronze += scales.Bronze;
        acc.Silver += scales.Silver;
        acc.Gold += scales.Gold;
        return acc;
      },
      { Bronze: 0, Silver: 0, Gold: 0 }
    );
  };

  const getOwnedFishScalesByType = (): FishScaleCount => {
    return banners.reduce(
      (acc, banner) => {
        if (!selectedBanners[banner.id]) return acc;

        const scales = parseFishScalePrice(banner.fishScalePrice);
        acc.Bronze += scales.Bronze;
        acc.Silver += scales.Silver;
        acc.Gold += scales.Gold;
        return acc;
      },
      { Bronze: 0, Silver: 0, Gold: 0 }
    );
  };

  return (
    <BannersContext.Provider
      value={{
        selectedBanners,
        toggleBanner,
        getTotalFishScales,
        getOwnedFishScales,
        getOwnedFishScalesByType,
        getTotalFishScalesByType,
      }}
    >
      {children}
    </BannersContext.Provider>
  );
};

export const useBanners = () => {
  const ctx = useContext(BannersContext);
  if (!ctx) {
    throw new Error('useBanners must be used inside BannersProvider');
  }
  return ctx;
};
