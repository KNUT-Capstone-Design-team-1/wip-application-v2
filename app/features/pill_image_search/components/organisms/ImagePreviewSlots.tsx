import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/organisms/ImagePreviewSlots';

interface ImagePreviewSlotsProps {
  frontImage: string | null;
  backImage: string | null;
  onRemove: (side: 'front' | 'back') => void;
}

const ImagePreviewSlots = ({
  frontImage,
  backImage,
  onRemove,
}: ImagePreviewSlotsProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>촬영된 이미지</Text>
      <View style={styles.slotsWrapper}>
        {/* 앞면 */}
        <View style={styles.slot}>
          <Text style={styles.label}>앞면</Text>
          {frontImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: frontImage }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemove('front')}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptySlot}>
              <Text style={styles.emptyText}>+</Text>
            </View>
          )}
        </View>

        {/* 뒷면 */}
        <View style={styles.slot}>
          <Text style={styles.label}>뒷면</Text>
          {backImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: backImage }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemove('back')}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptySlot}>
              <Text style={styles.emptyText}>+</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default ImagePreviewSlots;
