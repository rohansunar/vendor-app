import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useRiderAssignment } from '../hooks/useRiderAssignment';

import { AddRiderForm } from '@/features/riders/components/AddRiderForm';
import { useRiders } from '@/features/riders/hooks/useRiders';

interface Rider {
  id: string;
  name: string;
  phone: string;
}

interface RiderSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (riderId: string) => void;
}

export function RiderSelectionModal({
  visible,
  onClose,
  onSelect,
}: RiderSelectionModalProps) {
  const { riders, isLoadingRiders, ridersError } = useRiderAssignment();
  const { addRider, isAdding } = useRiders();

  const getDisplayName = (rider: Rider) => {
    if (rider.name && rider.name.trim() !== '') return rider.name;
    return `Rider #${rider.phone.slice(-4)}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>Select a Rider</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </View>

              <AddRiderForm
                onSubmit={async (data) => {
                  await addRider(data);
                }}
                isLoading={isAdding}
              />

              {isLoadingRiders ? (
                <ActivityIndicator
                  size="large"
                  color="#2563EB"
                  style={{ marginVertical: 40 }}
                />
              ) : ridersError ? (
                <View style={{ marginVertical: 40, alignItems: 'center' }}>
                  <Text style={{ color: '#EF4444', marginBottom: 8 }}>
                    Failed to load riders
                  </Text>
                  <Text style={{ fontSize: 12, color: '#64748B' }}>
                    Please try again later
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={riders}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.riderItem}
                      onPress={() => onSelect(item.id)}
                    >
                      <View>
                        <Text style={styles.riderName}>
                          {getDisplayName(item)}
                        </Text>
                        <Text style={styles.riderPhone}>
                          {item.phone || 'No phone'}
                        </Text>
                      </View>
                      <View style={styles.selectBadge}>
                        <Text style={styles.selectText}>Assign</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                  ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>No riders available</Text>
                  )}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeText: {
    fontSize: 16,
    color: '#64748B',
  },
  riderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  riderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  riderPhone: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  selectBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  selectText: {
    color: '#0284C7',
    fontSize: 13,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#64748B',
  },
});
