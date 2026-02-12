import React, { useState } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface DeliveryConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: { otp?: string; image?: string }) => void;
  method: 'OTP' | 'PHOTO';
}

export function DeliveryConfirmationModal({
  visible,
  onClose,
  onConfirm,
  method,
}: DeliveryConfirmationModalProps) {
  const [otp, setOtp] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleConfirm = () => {
    if (method === 'OTP') {
      if (otp.length === 4) {
        onConfirm({ otp });
      }
    } else {
      if (image) {
        onConfirm({ image });
      } else {
        // Mocking photo capture for now as we don't have camera integration set up here
        // In a real app, this would trigger the camera
        const mockImage =
          'https://via.placeholder.com/300x400.png?text=Proof+of+Delivery';
        setImage(mockImage);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.content}>
              <Text style={styles.title}>Delivery Confirmation</Text>
              <Text style={styles.subtitle}>
                {method === 'OTP'
                  ? 'Ask customer for the 4-digit OTP'
                  : 'Capture a photo of the delivered item'}
              </Text>

              {method === 'OTP' ? (
                <View style={styles.otpContainer}>
                  <TextInput
                    style={styles.otpInput}
                    placeholder="0000"
                    keyboardType="number-pad"
                    maxLength={4}
                    value={otp}
                    onChangeText={setOtp}
                  />
                </View>
              ) : (
                <View style={styles.imageContainer}>
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={styles.previewImage}
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Text style={styles.placeholderText}>
                        No photo captured
                      </Text>
                    </View>
                  )}
                </View>
              )}

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.confirmButton,
                    ((method === 'OTP' && otp.length !== 4) ||
                      (method === 'PHOTO' && !image && method === 'PHOTO')) &&
                      styles.disabledButton,
                  ]}
                  onPress={handleConfirm}
                >
                  <Text style={styles.confirmText}>
                    {method === 'PHOTO' && !image ? 'Take Photo' : 'Confirm'}
                  </Text>
                </TouchableOpacity>
              </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
    textAlign: 'center',
  },
  otpContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  otpInput: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
    fontSize: 32,
    fontWeight: '700',
    width: 120,
    textAlign: 'center',
    color: '#0F172A',
    letterSpacing: 8,
  },
  imageContainer: {
    height: 200,
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  placeholderText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
  },
  confirmButton: {
    backgroundColor: '#2563EB',
  },
  disabledButton: {
    // Optional: styles for disabled state if not taking photo
  },
  cancelText: {
    color: '#64748B',
    fontWeight: '600',
  },
  confirmText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
