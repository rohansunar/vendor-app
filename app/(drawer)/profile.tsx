import { useProfile } from '@/features/profile/hooks/useProfile';
import { useUpdateProfile } from '@/features/profile/hooks/useUpdateProfile';
import { useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

export default function ProfileScreen() {
  const { data, isLoading } = useProfile();
  const { mutate, isPending } = useUpdateProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (data?.data) {
      setName(data.data.name ?? '');
      setEmail(data.data.email ?? '');
    }
  }, [data]);

  if (isLoading) {
    return <Text>Loading profile...</Text>;
  }

  function handleSave() {
    mutate({ name, email });
  }

  return (
    <View>
      <Text>Profile</Text>

      <TextInput placeholder="Full Name" value={name} onChangeText={setName} />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Button title={isPending ? 'Saving...' : 'Save'} onPress={handleSave} />
    </View>
  );
}
