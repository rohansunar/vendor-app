import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useDeleteProductImage } from '../hooks/useDeleteProductImage';
import { useReorderProductImages } from '../hooks/useReorderProductImages';
import { useUploadProductImages } from '../hooks/useUploadProductImages';
import { buildImageFormData } from '../utils/imageFormData';

const MAX_IMAGES = 5;

type Props = {
  productId: string;
  images: string[];
};

export function ProductImageManager({ productId, images }: Props) {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const uploadMutation = useUploadProductImages(productId);
  const deleteMutation = useDeleteProductImage(productId);
  const reorderMutation = useReorderProductImages(productId);

  async function handlePickImages() {
    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      Alert.alert(
        'Limit reached',
        `You can upload up to ${MAX_IMAGES} images.`,
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedAssets = result.assets.slice(0, remainingSlots);
      if (result.assets.length > remainingSlots) {
        Alert.alert(
          'Image limit',
          `Only ${remainingSlots} more images can be added.`,
        );
      }

      const formData = buildImageFormData(selectedAssets);
      setUploadProgress(0);
      uploadMutation.mutate(
        {
          formData,
          onProgress: (p) => setUploadProgress(p),
        },
        {
          onSettled: () => setUploadProgress(null),
          onError: () =>
            Alert.alert(
              'Upload failed',
              'There was an error uploading your images.',
            ),
        },
      );
    }
  }

  function handleImageDelete(imageUrl: string) {
    Alert.alert('Delete Image', 'Are you sure you want to remove this image?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(imageUrl),
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Product Images</Text>
          <Text style={styles.subtitle}>
            {images.length}/{MAX_IMAGES} images used • Drag to reorder
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.addButton,
            images.length >= MAX_IMAGES && styles.addButtonDisabled,
          ]}
          onPress={handlePickImages}
          disabled={images.length >= MAX_IMAGES || uploadMutation.isPending}
        >
          {uploadMutation.isPending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Feather name="plus" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      {uploadProgress !== null && (
        <View style={styles.uploadOverlay}>
          <View style={styles.progressBox}>
            <ActivityIndicator color="#2563EB" />
            <Text style={styles.progressText}>Uploading {uploadProgress}%</Text>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressBar, { width: `${uploadProgress}%` }]}
              />
            </View>
          </View>
        </View>
      )}

      {images.length === 0 ? (
        <TouchableOpacity
          style={styles.emptyContainer}
          onPress={handlePickImages}
          activeOpacity={0.7}
        >
          <View style={styles.emptyIconCircle}>
            <Feather name="image" size={32} color="#94A3B8" />
          </View>
          <Text style={styles.emptyText}>Add your first image</Text>
          <Text style={styles.emptySubtext}>
            Show off your product with up to 5 photos
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.listContainer}>
          <DraggableFlatList
            data={images}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            onDragEnd={({ data }) => reorderMutation.mutate(data)}
            renderItem={({ item, drag, isActive }) => (
              <View
                style={[styles.imageCard, isActive && styles.activeImageCard]}
              >
                <TouchableOpacity
                  onLongPress={drag}
                  activeOpacity={0.9}
                  style={styles.imageWrapper}
                >
                  <Image source={{ uri: item }} style={styles.image} />
                  {images[0] === item && (
                    <View style={styles.mainBadge}>
                      <Text style={styles.mainBadgeText}>Main</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleImageDelete(item)}
                  disabled={deleteMutation.isPending}
                >
                  <View style={styles.deleteIconBg}>
                    <Feather name="x" size={14} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  listContainer: {
    height: 120,
  },
  imageCard: {
    marginRight: 16,
    position: 'relative',
  },
  activeImageCard: {
    opacity: 0.8,
    transform: [{ scale: 1.05 }],
  },
  imageWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  image: {
    width: 100,
    height: 100,
  },
  mainBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  mainBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 10,
  },
  deleteIconBg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  emptyContainer: {
    backgroundColor: '#F8FAFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  progressBox: {
    width: '80%',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginVertical: 12,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2563EB',
  },
});
