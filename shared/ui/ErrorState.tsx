import { GradientButton } from '@/shared/ui/GradientButton';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  footer?: string;
  icon?: keyof typeof Feather.glyphMap;
}

export const ErrorState = ({
  title = 'Connection Error',
  message = "We're having trouble reaching the server. Please check your connection and try again.",
  onRetry,
  footer,
  icon = 'wifi-off',
}: ErrorStateProps) => {
  return (
    <View style={styles.errorContainer}>
      <View style={styles.content}>
        <View style={styles.errorIconBg}>
          <Feather name={icon} size={32} color="#EF4444" />
        </View>

        <Text style={styles.errorTitle}>{title}</Text>

        <Text style={styles.errorSubtitle}>{message}</Text>

        {onRetry && (
          <View style={styles.buttonContainer}>
            <GradientButton title="Retry Again" onPress={onRetry} />
          </View>
        )}

        {footer && <Text style={styles.errorFooter}>{footer}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 40,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  errorIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  buttonContainer: {
    width: 180,
  },
  errorFooter: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
