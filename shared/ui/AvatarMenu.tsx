import { removeToken } from '@/core/storage/secureStorage';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

export function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const { data: profile } = useProfile();

  const getInitials = (name?: string) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(profile?.name);

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
          android_disableSound={true}
        />
      )}

      <View style={{ position: 'relative' }}>
        {/* Avatar */}
        <Pressable
          onPress={() => setOpen((v) => !v)}
          style={({ pressed }) => [
            styles.avatarContainer,
            pressed && { opacity: 0.8 }
          ]}
        >
          <View style={styles.avatar}>
            {initials ? (
              <Text style={styles.initialsText}>{initials}</Text>
            ) : (
              <Feather name="user" size={18} color="#2563EB" />
            )}
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
            {/* Header info */}
            <View style={styles.headerInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {profile?.name || 'User'}
              </Text>
              <Text style={styles.userRole} numberOfLines={1}>
                {profile?.business_name || 'Vendor Partner'}
              </Text>
            </View>

            <View style={styles.menuItems}>
              <MenuItem
                icon="user"
                label="My Profile"
                onPress={() => navigate('/(protected)/(tabs)/profile')}
              />

              <MenuItem
                icon="credit-card"
                label="Bank Account"
                onPress={() => navigate('/(protected)/(tabs)/bank')}
              />

              <View style={styles.logoutSection}>
                <MenuItem
                  icon="log-out"
                  label="Logout"
                  danger
                  onPress={logout}
                />
              </View>
            </View>
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
        pressed && { backgroundColor: '#F8FAFC' },
      ]}
    >
      <View style={[styles.iconWrapper, danger && { backgroundColor: '#FEF2F2' }]}>
        <Feather name={icon} size={16} color={danger ? '#EF4444' : '#64748B'} />
      </View>
      <Text style={[styles.itemText, danger && { color: '#EF4444' }]}>
        {label}
      </Text>
      {!danger && <Feather name="chevron-right" size={14} color="#CBD5E1" style={{ marginLeft: 'auto' }} />}
    </Pressable>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  avatarContainer: {
    marginRight: 16,
    padding: 2,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  initialsText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: -0.5,
  },

  dropdown: {
    position: 'absolute',
    top: 50,
    right: 12,
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
    zIndex: 100,
  },

  headerInfo: {
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },

  menuItems: {
    padding: 8,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginVertical: 1,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },

  logoutSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});
