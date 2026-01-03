import { useState } from 'react';
import { Button, Switch, Text, TextInput, View } from 'react-native';
import { Product } from '../types';

type Props = {
  product?: Product;
  onSubmit: (data: {
    name: string;
    description?: string;
    price: number;
    is_active?: boolean;
  }) => void;
  isPending: boolean;
};

export function ProductForm({ product, onSubmit, isPending }: Props) {
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product?.price?.toString() ?? '');
  const [isActive, setIsActive] = useState(product?.is_active ?? true);

  function handleSubmit() {
    onSubmit({
      name,
      description,
      price: Number(price),
      is_active: isActive,
    });
  }

  return (
    <View>
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
