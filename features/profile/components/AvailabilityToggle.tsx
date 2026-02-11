import { Switch, Text, View } from 'react-native';
import { useUpdateAvailability } from '../hooks/useUpdateAvailability';

export function AvailabilityToggle({ value }: { value: boolean }) {
  const mutation = useUpdateAvailability();

  function handleToggle(newValue: boolean) {
    mutation.mutate(newValue);
  }

  return (
    <View className="flex-row justify-between items-center py-3">
      <Text className="text-base font-medium text-slate-800">
        Available Today
      </Text>
      <Switch
        value={value}
        onValueChange={handleToggle}
        disabled={mutation.isPending}
      />
    </View>
  );
}
