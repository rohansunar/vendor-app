import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { dashboardStyles } from './dashboard.styles';

type Props = {
  icon: keyof typeof Feather.glyphMap;
  value: string | number;
  label: string;
  color?: string;
  isLast?: boolean;
};

export function StatCard({
  icon,
  value,
  label,
  color = '#2563EB',
  isLast,
}: Props) {
  return (
    <View style={[dashboardStyles.card, isLast && dashboardStyles.cardLast]}>
      <Feather name={icon} size={20} color={color} />
      <Text style={dashboardStyles.cardValue}>{value}</Text>
      <Text style={dashboardStyles.cardLabel}>{label}</Text>
    </View>
  );
}
