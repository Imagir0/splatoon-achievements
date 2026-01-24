import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

type Props = {
  categoryKey: string;
  title: string;
};

export default function CategoryScreen({ categoryKey }: Props) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/(tabs)/collectibles/gears/[category]',
          params: { category: categoryKey },
        })
      }
    >
    </Pressable>
  );
}
