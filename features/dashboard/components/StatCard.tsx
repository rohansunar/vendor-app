import { Feather } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { dashboardStyles } from './dashboard.styles';

type Props = {
  icon: keyof typeof Feather.glyphMap;
  value: string | number;
  label: string;
  color?: string;
  isLast?: boolean;
  onPress?: () => void;
};

const getBgColor = (color: string) => {
  // Basic mapping for preview colors to light backgrounds
  // In a real app we might use a dedicated theme utility
  const map: Record<string, string> = {
    '#2563EB': '#EFF6FF', // Blue
    '#059669': '#ECFDF5', // Green
    '#D97706': '#FFFBEB', // Amber
    '#7C3AED': '#F5F3FF', // Purple
    '#DB2777': '#FDF2F8', // Pink
    '#EF4444': '#FEF2F2', // Red
  };
  return map[color] || '#F1F5F9';
};

export function StatCard({
  icon,
  value,
  label,
  color = '#2563EB',
  isLast,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={[dashboardStyles.card, isLast && dashboardStyles.cardLast]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[dashboardStyles.iconContainer, { backgroundColor: getBgColor(color) }]}>
        <Feather name={icon} size={22} color={color} />
      </View>
      <Text style={dashboardStyles.cardValue} numberOfLines={1}>{value}</Text>
      <Text style={dashboardStyles.cardLabel}>{label}</Text>
    </TouchableOpacity>
  );
}
