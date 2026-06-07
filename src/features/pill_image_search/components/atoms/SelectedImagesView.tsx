import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '../../styles/atoms/SelectedImagesView';
import { Check } from 'lucide-react-native';
import { COLOR } from '@constants/color';
import { fontPx } from '@utils/responsive';

interface SelectedImagesViewProps {
  frontImage: string | null;
  backImage: string | null;
}

const SelectedImagesView = ({
  frontImage,
  backImage,
}: SelectedImagesViewProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>선택된 이미지</Text>
      <View style={styles.imagesWrapper}>
        {/* 앞면 */}
        <View style={styles.imageContainer}>
          <Text style={styles.label}>앞면</Text>
          {frontImage && (
            <View style={styles.imageBox}>
              <Image source={{ uri: frontImage }} style={styles.image} />
              <View style={styles.checkmark}>
                <Check
                  size={fontPx(14)}
                  color={COLOR['white']}
                  strokeWidth={4}
                />
              </View>
            </View>
          )}
        </View>

        {/* 뒷면 */}
        <View style={styles.imageContainer}>
          <Text style={styles.label}>뒷면</Text>
          {backImage && (
            <View style={styles.imageBox}>
              <Image source={{ uri: backImage }} style={styles.image} />
              <View style={styles.checkmark}>
                <Check
                  size={fontPx(14)}
                  color={COLOR['white']}
                  strokeWidth={4}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default SelectedImagesView;
