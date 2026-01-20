import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/organisms/ImageSearchButtons';
import { COLOR_PRIMARY } from '@/app/constants/color';
import CameraIcon from '@/assets/icons/camera.svg';
import AlbumIcon from '@/assets/icons/album.svg';

const ImageSearchButtons = ({ visible }: { visible: boolean }) => {
  return (
    <View style={styles.imageSearchButtonsWrapper}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.button, { backgroundColor: COLOR_PRIMARY[400] }]}
      >
        <CameraIcon width={20} height={16} fill="#fff" />
        <Text style={styles.text}>촬영하기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.button, { backgroundColor: COLOR_PRIMARY[200] }]}
      >
        <AlbumIcon width={21} height={17} fill="#fff" />
        <Text style={styles.text}>앨범에서 선택하기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ImageSearchButtons;
