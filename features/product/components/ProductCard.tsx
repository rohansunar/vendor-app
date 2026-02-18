import { Feather } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDeleteProduct } from '../hooks/useDeleteProduct';
import { useRestoreProduct } from '../hooks/useRestoreProduct';
import { Product } from '../product.types';

type Props = {
  product: Product;
  onPress: () => void;
};

export function ProductCard({ product, onPress }: Props) {
  const imageUri =
    product.images && product.images.length > 0
      ? { uri: product.images[0] }
      : require('@/assets/images/product-placeholder.png');

  const deleteMutation = useDeleteProduct();
  const restoreMutation = useRestoreProduct();
  const isInactive = !product.is_active;

  return (
    <TouchableOpacity
      style={[styles.container, isInactive && styles.inactiveContainer]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image source={imageUri} style={styles.image} />
        {isInactive && (
          <View style={styles.inactiveOverlay}>
            <Text style={styles.inactiveLabel}>Inactive</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.content}>
        {/* Badges Row - Dedicated row at the top */}
        <View style={styles.badgeRow}>
          {product.is_schedulable && (
            <View style={styles.schedulableBadge}>
              <Text style={styles.schedulableText}>SUBSCRIPTION</Text>
            </View>
          )}
          <View
            style={[
              styles.statusBadge,
              product.approval_status === 'APPROVED'
                ? styles.statusApproved
                : styles.statusPending,
            ]}
          >
            <Text style={styles.statusText}>{product.approval_status}</Text>
          </View>
        </View>

        {/* Product Name - Full Width below badges */}
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {product.description || 'No description provided'}
        </Text>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹ {product.price}</Text>
            {product.deposit && product.deposit > 0 && (
              <Text style={styles.deposit}>+ ₹{product.deposit} deposit</Text>
            )}
          </View>

          <View style={styles.actions}>
            {!isInactive ? (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  deleteMutation.mutate(product.id);
                }}
              >
                <Feather name="trash-2" size={18} color="#EF4444" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  restoreMutation.mutate(product.id);
                }}
              >
                <Feather name="refresh-cw" size={18} color="#10B981" />
              </TouchableOpacity>
            )}
            <View style={styles.chevron}>
              <Feather name="chevron-right" size={20} color="#94A3B8" />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    minHeight: 140, // Increased for new layout
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  inactiveContainer: {
    opacity: 0.8,
    backgroundColor: '#F8FAFF',
  },
  imageContainer: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  image: {
    width: 90,
    height: 90,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusApproved: {
    backgroundColor: '#10B981',
  },
  statusPending: {
    backgroundColor: '#F59E0B',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  schedulableBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  schedulableText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#2563EB',
  },
  inactiveOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  priceContainer: {
    flexDirection: 'column',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563EB',
  },
  deposit: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chevron: {
    marginLeft: 4,
  },
});
