import { Feather } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function ProductsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#1e72f9',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                    fontWeight: '700',
                },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'My Products',
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => router.push('/products/create')}
                            style={{ marginRight: 16 }}
                            activeOpacity={0.7}
                        >
                            <Feather name="plus" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="create"
                options={{
                    title: 'Add Product',
                }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    title: 'Product Details',
                }}
            />
        </Stack>
    );
}
