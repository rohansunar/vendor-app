import { useCategories } from '@/features/category/hooks/useCategories';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
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

/**
 * ProductForm: Handles creation and updating of products.
 * Uses a custom Modal-based picker for categories for a modern, controllable UX.
 */
export function ProductForm({ product, onSubmit, isPending }: Props) {
  const { data: categories, isLoading: isLoadingCats } = useCategories();

  // Form State
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product?.price?.toString() ?? '');
  const [deposit, setDeposit] = useState(product?.deposit?.toString() ?? '');
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? '');
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [isSchedulable, setIsSchedulable] = useState(
    product?.is_schedulable ?? false,
  );

  // UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  // Sync state with product prop for updates
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
    if (!price.trim() || isNaN(Number(price)))
      newErrors.price = 'Valid price is required';
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

  const selectedCategoryName = categories?.find((c) => c.id === categoryId)?.name;

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
        style={[
          styles.input,
          options.error && styles.inputError,
          options.multiline && styles.textArea,
        ]}
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
          if (options.errorKey) {
            setErrors((prev) => ({ ...prev, [options.errorKey]: '' }));
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
    <View style={styles.formContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>

        {/* Category Selection - Moved to Top */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category *</Text>
          <TouchableOpacity
            style={[
              styles.customPicker,
              errors.category && styles.inputError,
            ]}
            onPress={() => setIsPickerVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.pickerValue, !selectedCategoryName && styles.placeholderText]}>
              {selectedCategoryName || 'Select category'}
            </Text>
            <Feather name="chevron-down" size={20} color="#94A3B8" />
          </TouchableOpacity>
          {errors.category && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}
        </View>

        {renderInput('Product Name *', name, setName, 'e.g. 20L Water Jar', {
          error: errors.name,
          errorKey: 'name',
        })}

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            {renderInput('Price (₹) *', price, setPrice, '0.00', {
              keyboardType: 'numeric',
              error: errors.price,
              errorKey: 'price',
            })}
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            {renderInput('Deposit (₹)', deposit, setDeposit, '0.00', {
              keyboardType: 'numeric',
            })}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        {renderInput(
          'Description',
          description,
          setDescription,
          'Tell us more about the product...',
          {
            multiline: true,
            numberOfLines: 3,
            textAlignVertical: 'top',
          },
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>Active Status</Text>
            <Text style={styles.switchSubLabel}>
              Visible to customers
            </Text>
          </View>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
            thumbColor={isActive ? '#2563EB' : '#F8FAFF'}
          />
        </View>

        <View
          style={[
            styles.switchRow,
            { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>Schedulable</Text>
            <Text style={styles.switchSubLabel}>
              Subscription enabled
            </Text>
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
            <Feather
              name="check"
              size={20}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.saveText}>
              {product ? 'Update Product' : 'Create Product'}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Modern Minimal Category Picker Modal */}
      <Modal
        visible={isPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsPickerVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Category</Text>
                  <TouchableOpacity onPress={() => setIsPickerVisible(false)}>
                    <Feather name="x" size={24} color="#64748B" />
                  </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {categories?.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryItem,
                        categoryId === cat.id && styles.categoryItemActive,
                      ]}
                      onPress={() => {
                        setCategoryId(cat.id);
                        setErrors((prev) => ({ ...prev, category: '' }));
                        setIsPickerVisible(false);
                      }}
                    >
                      <Text style={[
                        styles.categoryText,
                        categoryId === cat.id && styles.categoryTextActive,
                      ]}>
                        {cat.name}
                      </Text>
                      {categoryId === cat.id && (
                        <Feather name="check" size={18} color="#2563EB" />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    // Container for the form elements
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
    padding: 16, // Reduced internal padding
    marginBottom: 16,
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
    marginBottom: 16,
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
  customPicker: {
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerValue: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  placeholderText: {
    color: '#94A3B8',
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
    height: 80, // Slightly reduced height
    textAlignVertical: 'top',
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
    marginTop: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  categoryItemActive: {
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: -12,
    borderBottomColor: 'transparent',
  },
  categoryText: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
});
