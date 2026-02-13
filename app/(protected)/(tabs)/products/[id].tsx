import { ProductForm } from '@/features/product/components/ProductForm';
import { ProductImageManager } from '@/features/product/components/ProductImageManager';
import { useProduct } from '@/features/product/hooks/useProduct';
import { useUpdateProduct } from '@/features/product/hooks/useUpdateProduct';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProductDetailsPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: product, isLoading, error } = useProduct(id!);
    const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (error || !product) {
        return (
            <View style={styles.center}>
                <Feather name="alert-circle" size={48} color="#EF4444" />
                <Text style={styles.errorText}>Failed to load product</Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleSubmit = (data: any) => {
        updateProduct(
            { id: product.id, data },
            {
                onSuccess: () => {
                    // Success feedback can be handled here or in the hook
                },
            },
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
        >
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <ProductImageManager
                    productId={product.id}
                    images={product.images || []}
                />

                <View style={styles.divider} />

                <ProductForm
                    product={product}
                    onSubmit={handleSubmit}
                    isPending={isUpdating}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFF',
    },
    scrollContent: {
        padding: 12,
        paddingBottom: 40,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    errorText: {
        marginTop: 12,
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
    },
    backButton: {
        marginTop: 24,
        backgroundColor: '#2563EB',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 16,
    },
});
