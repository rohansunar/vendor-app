import { Switch, Text, View } from 'react-native';

export function AvailabilityToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row justify-between items-center py-3">
      <Text className="text-base font-medium text-slate-800">
        Available Today
      </Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}
