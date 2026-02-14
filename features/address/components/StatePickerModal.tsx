import { Ionicons } from '@expo/vector-icons';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { INDIAN_STATES } from '../../../shared/constants/indianStates';
import { addressStyles as styles } from './address.style';

/**
 * Props for StatePickerModal component.
 */
export interface StatePickerModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Currently selected state */
  selectedState: string;
  /** Callback when a state is selected */
  onSelectState: (state: string) => void;
  /** Callback when modal should close */
  onClose: () => void;
}

/**
 * StatePickerModal component for selecting Indian states.
 * Displays a bottom sheet style modal with a scrollable list of states.
 */
export function StatePickerModal({
  visible,
  selectedState,
  onSelectState,
  onClose,
}: StatePickerModalProps) {
  const handleStateSelect = (state: string) => {
    onSelectState(state);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select State</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={INDIAN_STATES}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.stateItem}
                onPress={() => handleStateSelect(item)}
              >
                <Text
                  style={[
                    styles.stateText,
                    selectedState === item && styles.selectedStateText,
                  ]}
                >
                  {item}
                </Text>
                {selectedState === item && (
                  <Ionicons name="checkmark" size={20} color="#2563EB" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}
