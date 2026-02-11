import { useProfile, useUpdateProfile } from '@/features/profile';
import { ProfileForm } from '@/features/profile/components/ProfileForm';
import { profileStyles } from '@/features/profile/components/profile.styles';
import { Feather } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function ProfileScreen() {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => null, // 👈 hides avatar

      headerLeft: () => (
        <Pressable onPress={() => router.back()} style={{ marginLeft: 14 }}>
          <Feather name="arrow-left" size={24} color="#0F172A" />
        </Pressable>
      ),

      headerTitle: 'Profile',
    });
  }, [navigation]);

  const { data, isLoading, isError } = useProfile();
  const update = useUpdateProfile();

  if (isLoading) {
    return (
      <View style={profileStyles.centered}>
        <Text>Loading profile…</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={profileStyles.centered}>
        <Text>Failed to load profile</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={profileStyles.container}
      contentContainerStyle={profileStyles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ---------- Profile Header ---------- */}
      <View style={profileStyles.profileHeader}>
        <View style={profileStyles.avatarLarge}>
          <Text style={profileStyles.avatarText}>{data.name.charAt(0)}</Text>
        </View>

        <Text style={profileStyles.profileName}>{data.name}</Text>

        <Text style={profileStyles.businessName}>{data.business_name}</Text>
      </View>

      {/* ---------- Form Card ---------- */}
      <ProfileForm
        data={data}
        loading={update.isPending}
        onSave={update.mutate}
      />

      {/* ---------- Metadata ---------- */}
      <View style={profileStyles.metaContainer}>
        <Text style={profileStyles.metaText}>
          Created: {new Date(data.created_at).toDateString()}
        </Text>
        <Text style={profileStyles.metaText}>
          Updated: {new Date(data.updated_at).toDateString()}
        </Text>
      </View>
    </ScrollView>
  );
}
