import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export type FilterRange = 'weekly' | 'monthly' | 'custom';

interface EarningsFilterProps {
  selectedRange: FilterRange;
  onRangeChange: (range: FilterRange, start?: Date, end?: Date) => void;
  startDate?: Date;
  endDate?: Date;
}

export const EarningsFilter: React.FC<EarningsFilterProps> = ({
  selectedRange,
  onRangeChange,
  startDate,
  endDate,
}) => {
  const [showPicker, setShowPicker] = useState<'start' | 'end' | null>(null);

  const handlePresetChange = (range: 'weekly' | 'monthly') => {
    const now = new Date();
    let start = new Date();
    const end = new Date();

    if (range === 'weekly') {
      start.setDate(now.getDate() - 7);
    } else {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    onRangeChange(range, start, end);
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowPicker(null);
    if (selectedDate) {
      if (showPicker === 'start') {
        const newEnd =
          endDate && selectedDate > endDate ? selectedDate : endDate;
        onRangeChange('custom', selectedDate, newEnd);
      } else {
        const newStart =
          startDate && selectedDate < startDate ? selectedDate : startDate;
        onRangeChange('custom', newStart, selectedDate);
      }
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Select Date';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {(['weekly', 'monthly', 'custom'] as const).map((range) => {
          const isActive = selectedRange === range;
          return (
            <TouchableOpacity
              key={range}
              onPress={() =>
                range === 'custom'
                  ? onRangeChange('custom', startDate, endDate)
                  : handlePresetChange(range)
              }
              style={[styles.tab, isActive && styles.activeTab]}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {range.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedRange === 'custom' && (
        <View style={styles.datePickerRow}>
          <TouchableOpacity
            onPress={() => setShowPicker('start')}
            style={styles.dateSelector}
            activeOpacity={0.8}
          >
            <Text style={styles.dateLabel}>FROM</Text>
            <View style={styles.dateValueRow}>
              <Text style={styles.dateValue}>{formatDate(startDate)}</Text>
              <Feather name="calendar" size={14} color="#2563EB" />
            </View>
          </TouchableOpacity>

          <View style={styles.separator}>
            <Feather name="arrow-right" size={16} color="#CBD5E1" />
          </View>

          <TouchableOpacity
            onPress={() => setShowPicker('end')}
            style={styles.dateSelector}
            activeOpacity={0.8}
          >
            <Text style={styles.dateLabel}>TO</Text>
            <View style={styles.dateValueRow}>
              <Text style={styles.dateValue}>{formatDate(endDate)}</Text>
              <Feather name="calendar" size={14} color="#2563EB" />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {showPicker && (
        <DateTimePicker
          value={(showPicker === 'start' ? startDate : endDate) || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDate}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  activeTabText: {
    color: '#2563EB',
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateSelector: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  dateLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 4,
  },
  dateValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  separator: {
    width: 24,
    alignItems: 'center',
  },
});
