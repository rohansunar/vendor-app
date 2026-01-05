import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const toastConfig = {
  success: ({ text1 }: any) => (
    <View style={[styles.toast, styles.success]}>
      <Text style={styles.title}>{text1}</Text>
    </View>
  ),

  error: ({ text1 }: any) => (
    <View style={[styles.toast, styles.error]}>
      <Text style={styles.title}>{text1}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  toast: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },

  success: {
    backgroundColor: '#EAFBF3',
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },

  error: {
    backgroundColor: '#FDECEA',
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
});
