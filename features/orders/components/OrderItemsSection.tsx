import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { OrderItem } from '../orders.types';

export function OrderItemsSection({ items }: { items: OrderItem[] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={{ marginTop: 12 }}>
      <Pressable
        onPress={() => setExpanded(!expanded)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontWeight: '600',
            fontSize: 13,
            color: '#334155',
          }}
        >
          Order Items ({items.length})
        </Text>

        <Feather
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color="#64748B"
        />
      </Pressable>

      {expanded &&
        items.map((item) => (
          <View
            key={item.id}
            style={{
              marginTop: 8,
              padding: 10,
              backgroundColor: '#F1F5F9',
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontWeight: '600',
                fontSize: 13,
                color: '#0F172A',
              }}
            >
              {item.product.name}
            </Text>

            <Text style={{ fontSize: 12, color: '#475569' }}>
              Qty: {item.quantity} | ₹{item.price}
            </Text>
          </View>
        ))}
    </View>
  );
}
