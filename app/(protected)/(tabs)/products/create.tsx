import { ProductForm } from '@/features/product/components/ProductForm';
import { useCreateProduct } from '@/features/product/hooks/useCreateProduct';
import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

export default function CreateProductPage() {
    const { mutate, isPending } = useCreateProduct();

    const handleSubmit = (data: any) => {
        mutate(data, {
            onSuccess: () => {
                router.back();
            },
        });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                style={styles.container}
            >
                <ProductForm onSubmit={handleSubmit} isPending={isPending} />
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
});

