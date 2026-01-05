import { showError, showSuccess } from '@/core/ui/toast';
import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { ProductForm } from '@/features/product/components/ProductForm';
import { useCreateProduct } from '@/features/product/hooks/useCreateProduct';
import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function CreateProductScreen() {
  const { mutate, isPending } = useCreateProduct();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16 }}
      >
        <ProductForm
          isPending={isPending}
          onSubmit={(data) => {
            mutate(data, {
              onSuccess: (res) => {
                showSuccess(
                  res?.data?.message || 'Product created successfully',
                );
                router.replace('/dashboard/products');
              },
              onError: (error) => {
                showError(getErrorMessage(error));
              },
            });
          }}
        />
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}
