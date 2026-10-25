import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

interface ReceiptPickerProps {
  receiptUri: string | null;
  onReceiptSelected: (uri: string | null) => void;
}

export const ReceiptPicker: React.FC<ReceiptPickerProps> = ({
  receiptUri,
  onReceiptSelected,
}) => {
  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'You need to grant camera roll access to attach a loan receipt.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onReceiptSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image from library');
    }
  };

  const removeImage = () => {
    onReceiptSelected(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Receipt Photo (Optional)</Text>

      {receiptUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: receiptUri }} style={styles.previewImage} resizeMode="cover" />
          <View style={styles.previewOverlay}>
            <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
              <Ionicons name="trash-outline" size={18} color={colors.textLight} />
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadBox} onPress={pickImage} activeOpacity={0.7}>
          <Ionicons name="cloud-upload-outline" size={26} color={colors.primary} />
          <Text style={styles.uploadTitle}>Tap to attach receipt or photo</Text>
          <Text style={styles.uploadSubtitle}>PNG, JPG, or screenshot</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSubtle,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 6,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  previewContainer: {
    position: 'relative',
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 4,
  },
  removeButtonText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '600',
  },
});
