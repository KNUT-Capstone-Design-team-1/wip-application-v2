import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/organisms/ImagePreviewSlots';
import { Plus, X } from 'lucide-react-native';
import { COLOR, COLOR_GRAY } from '@constants/color';

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
                <X size={24} color={COLOR['white']} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptySlot}>
              <Plus size={24} color={COLOR_GRAY[400]} strokeWidth={3} />
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
                <X size={24} color={COLOR['white']} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptySlot}>
              <Plus size={24} color={COLOR_GRAY[400]} strokeWidth={3} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default ImagePreviewSlots;
