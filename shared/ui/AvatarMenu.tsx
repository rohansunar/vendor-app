import { removeToken } from '@/core/storage/secureStorage';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export function AvatarMenu() {
  const [open, setOpen] = useState(false);

  // animation values
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: open ? 1 : 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: open ? 0 : -8,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  function navigate(path: Parameters<typeof router.push>[0]) {
    closeMenu();
    router.push(path);
  }

  async function logout() {
    closeMenu();
    await removeToken();
    router.replace('/(auth)/login');
  }

  return (
    <>
      {/* Outside tap overlay */}
      {open && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={closeMenu}
        />
      )}

      <View style={{ position: 'relative' }}>
        {/* Avatar */}
        <Pressable onPress={() => setOpen(v => !v)}>
          <View style={styles.avatar}>
            <Feather name="user" size={18} color="#FFF" />
          </View>
        </Pressable>

        {/* Dropdown */}
        {open && (
          <Animated.View
            style={[
              styles.dropdown,
              {
                opacity,
                transform: [{ translateY }],
              },
            ]}
          >
            <MenuItem
              icon="user"
              label="Profile"
              onPress={() =>
                navigate('/(protected)/(tabs)/profile')
              }
            />

            <Divider />

            <MenuItem
              icon="credit-card"
              label="Bank Account"
              onPress={() =>
                navigate('/(protected)/bank')
              }
            />

            <Divider />

            <MenuItem
              icon="log-out"
              label="Logout"
              danger
              onPress={logout}
            />
          </Animated.View>
        )}
      </View>
    </>
  );
}

/* ---------- Sub-components ---------- */

function MenuItem({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.item,
        pressed && { backgroundColor: '#F1F5F9' },
      ]}
    >
      <Feather
        name={icon}
        size={16}
        color={danger ? '#DC2626' : '#334155'}
      />
      <Text
        style={[
          styles.itemText,
          danger && { color: '#DC2626' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Divider() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: '#E2E8F0',
      }}
    />
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dropdown: {
    position: 'absolute',
    top: 44,
    right: 0,
    width: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
    zIndex: 100,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  itemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
});
