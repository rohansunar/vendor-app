import { useCategories } from '@/features/category/hooks/useCategories';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { Button, Switch, Text, TextInput, View } from 'react-native';
import { Product } from '../types';

type Props = {
  product?: Product;
  onSubmit: (data: {
    name: string;
    description?: string;
    price: number;
    is_active?: boolean;
    categoryId: string;
  }) => void;
  isPending: boolean;
};

export function ProductForm({ product, onSubmit, isPending }: Props) {
  const { data: categories, isLoading } = useCategories();

  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product?.price?.toString() ?? '');
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? '');

  useEffect(() => {
    if (product) {
      setCategoryId(product.categoryId);
    }
  }, [product]);

  function handleSubmit() {
    if (!name || !price || !categoryId) {
      alert('Name, price and category are required');
      return;
    }

    onSubmit({
      name,
      description,
      price: Number(price),
      categoryId,
    });
  }

  if (isLoading) {
    return <Text>Loading categories...</Text>;
  }

  return (
    <View>
      {/* Category dropdown */}
      <Text>Category</Text>
      <Picker
        selectedValue={categoryId}
        onValueChange={(value) => setCategoryId(value)}
      >
        <Picker.Item label="Select Category" value="" />
        {categories?.map((cat) => (
          <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
        ))}
      </Picker>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      {product && (
        <>
          <Text>Active</Text>
          <Switch value={isActive} onValueChange={setIsActive} />
        </>
      )}

      <Button title={isPending ? 'Saving...' : 'Save'} onPress={handleSubmit} />
    </View>
  );
}
