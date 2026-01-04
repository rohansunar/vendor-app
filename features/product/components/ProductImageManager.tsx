import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
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

type Props = {
  productId: string;
  images: string[];
};

export function ProductImageManager({ productId, images }: Props) {
  const uploadMutation = useUploadProductImages(productId);
  const deleteMutation = useDeleteProductImage(productId);
  const reorderMutation = useReorderProductImages(productId);

  async function handlePickImages() {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const formData = buildImageFormData(result.assets);
      uploadMutation.mutate(formData);
    }
  }

  function handleDelete(imageUrl: string) {
    Alert.alert('Delete Image', 'Are you sure?', [
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
      <TouchableOpacity style={styles.addButton} onPress={handlePickImages}>
        <Text style={styles.addText}>+ Add Images</Text>
      </TouchableOpacity>

      <Text style={styles.helperText}>
        Tap ✕ to delete · Long press to reorder
      </Text>

      <DraggableFlatList
        data={images}
        keyExtractor={(item) => item}
        horizontal
        onDragEnd={({ data }) => {
          // data is reordered string[]
          reorderMutation.mutate(data);
        }}
        renderItem={({ item, drag }) => (
          <View style={styles.imageContainer}>
            {/* IMAGE */}
            <TouchableOpacity
              onLongPress={drag}
              onPress={() => handleDelete(item)}
              style={styles.imageWrapper}
            >
              <Image source={{ uri: item }} style={styles.image} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => handleDelete(item)}
              disabled={deleteMutation.isPending}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close-circle"
                size={22}
                color={deleteMutation.isPending ? '#B0B0B0' : '#FF3B30'}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  addButton: {
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginBottom: 12,
  },
  addText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  imageWrapper: {
    marginRight: 12,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  imageContainer: {
    marginRight: 12,
  },
  deleteIcon: {
    position: 'absolute',
    top: -2,
    right: -6,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
});
