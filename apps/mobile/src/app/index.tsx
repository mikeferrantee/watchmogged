import { Text, View } from 'react-native';

import { formatUsd } from '@watchmogged/utils';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center gap-2">
      <Text className="text-3xl font-bold">WATCHMOGGED</Text>
      <Text className="text-base">Sample value: {formatUsd(12_500_000)}</Text>
    </View>
  );
}
