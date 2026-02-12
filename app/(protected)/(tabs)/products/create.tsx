import { ProductForm } from '@/features/product/components/ProductForm';
import { useCreateProduct } from '@/features/product/hooks/useCreateProduct';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

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
        <View style={styles.container}>
            <ProductForm onSubmit={handleSubmit} isPending={isPending} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFF',
    },
});
