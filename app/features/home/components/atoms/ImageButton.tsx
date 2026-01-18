import React from 'react';
import {
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  DimensionValue,
} from 'react-native';
import { styles } from '../../styles/atoms/ImageButton';

interface ImageButtonProps {
  imageSource: ImageSourcePropType;
  onPress: () => void;
  disabled?: boolean;
  width: DimensionValue;
  height: DimensionValue;
}

const ImageButton = ({
  imageSource,
  onPress,
  disabled,
  width,
  height,
}: ImageButtonProps) => {
  return (
    <TouchableOpacity activeOpacity={0.7} style={[styles.container, {width: width, height: height}]} onPress={onPress}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
    </TouchableOpacity>
  );
};

export default ImageButton;
