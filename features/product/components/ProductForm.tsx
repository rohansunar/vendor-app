import { useCategories } from '@/features/category/hooks/useCategories';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Product } from '../product.types';

type Props = {
  product?: Product;
  onSubmit: (data: {
    name: string;
    description?: string;
    price: number;
    deposit?: number;
    is_active: boolean;
    is_schedulable: boolean;
    categoryId: string;
  }) => void;
  isPending: boolean;
};

export function ProductForm({ product, onSubmit, isPending }: Props) {
  const { data: categories, isLoading: isLoadingCats } = useCategories();

  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product?.price?.toString() ?? '');
  const [deposit, setDeposit] = useState(product?.deposit?.toString() ?? '');
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? '');
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [isSchedulable, setIsSchedulable] = useState(product?.is_schedulable ?? false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setCategoryId(product.categoryId);
      setIsActive(product.is_active);
      setIsSchedulable(product.is_schedulable);
    }
  }, [product]);

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!price.trim() || isNaN(Number(price))) newErrors.price = 'Valid price is required';
    if (!categoryId) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      deposit: deposit ? Number(deposit) : undefined,
      is_active: isActive,
      is_schedulable: isSchedulable,
      categoryId,
    });
  }

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    options: any = {},
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, options.error && styles.inputError, options.multiline && styles.textArea]}
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
          if (options.errorKey) {
            setErrors(prev => ({ ...prev, [options.errorKey]: '' }));
          }
        }}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        {...options}
      />
      {options.error && <Text style={styles.errorText}>{options.error}</Text>}
    </View>
  );

  if (isLoadingCats) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          {renderInput('Product Name *', name, setName, 'e.g. 20L Water Jar', {
            error: errors.name,
            errorKey: 'name'
          })}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <View style={[styles.pickerContainer, errors.category && styles.inputError]}>
              <Picker
                selectedValue={categoryId}
                onValueChange={(val) => {
                  setCategoryId(val);
                  setErrors(prev => ({ ...prev, category: '' }));
                }}
                style={styles.picker}
              >
                <Picker.Item label="Select category" value="" color="#94A3B8" />
                {categories?.map((cat) => (
                  <Picker.Item key={cat.id} label={cat.name} value={cat.id} color="#0F172A" />
                ))}
              </Picker>
            </View>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              {renderInput('Price (₹) *', price, setPrice, '0.00', {
                keyboardType: 'numeric',
                error: errors.price,
                errorKey: 'price'
              })}
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              {renderInput('Deposit (₹)', deposit, setDeposit, '0.00', {
                keyboardType: 'numeric'
              })}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          {renderInput('Description', description, setDescription, 'Tell us more about the product...', {
            multiline: true,
            numberOfLines: 4,
            textAlignVertical: 'top'
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>Active Status</Text>
              <Text style={styles.switchSubLabel}>Allow customers to see this product</Text>
            </View>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
              thumbColor={isActive ? '#2563EB' : '#F8FAFF'}
            />
          </View>

          <View style={[styles.switchRow, { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 }]}>
            <View>
              <Text style={styles.switchLabel}>Schedulable</Text>
              <Text style={styles.switchSubLabel}>Enable subscription/scheduled orders</Text>
            </View>
            <Switch
              value={isSchedulable}
              onValueChange={setIsSchedulable}
              trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
              thumbColor={isSchedulable ? '#2563EB' : '#F8FAFF'}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isPending && styles.disabled]}
          onPress={handleSubmit}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Feather name="check" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.saveText}>
                {product ? 'Update Product' : 'Create Product'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  centered: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#0F172A',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    fontWeight: '500',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? undefined : 50,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  switchSubLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  saveButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.7,
  },
});
