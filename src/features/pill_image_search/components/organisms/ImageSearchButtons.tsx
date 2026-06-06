import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/organisms/ImageSearchButtons';
import { COLOR_PRIMARY, COLOR_GRAY, COLOR } from '@constants/color';
import ImagePreviewSlots from '../organisms/ImagePreviewSlots';
import CameraScreen from '../organisms/CameraScreen';
import {
  pickMultipleImages,
  pickMultipleImagesFromFiles,
} from '../../utils/imagePickerUtils';
import { Camera, FolderClosed, FolderOpen, Image } from 'lucide-react-native';

interface PillImages {
  front: string | null;
  back: string | null;
}

interface ImageSearchButtonsProps {
  visible?: boolean;
  onImageSelect?: (imageUri: string) => void;
  onMultipleImageSelect?: (images: string[]) => void;
  pillImages?: PillImages;
  onImageRemove?: (side: 'front' | 'back') => void;
  onApply?: () => void;
  showApplyButton?: boolean;
}

const ImageSearchButtons = ({
  onImageSelect,
  onMultipleImageSelect,
  pillImages,
  onImageRemove,
  onApply,
  showApplyButton,
}: ImageSearchButtonsProps) => {
  const [showCamera, setShowCamera] = useState(false);

  const handleCameraPress = () => {
    setShowCamera(true);
  };

  const handleCameraCapture = (imageUri: string) => {
    console.log('이미지 캡처됨:', imageUri);
    console.log('현재 pillImages:', pillImages);
    onImageSelect?.(imageUri);

    // 뒷면 촬영이 완료되면 카메라 닫기
    // pillImages.front가 있으면 이번 촬영이 뒷면
    if (pillImages?.front && !pillImages?.back) {
      setTimeout(() => {
        console.log('2장 촬영 완료, 카메라 닫기');
        setShowCamera(false);
      }, 300);
    }
  };

  const handleCameraClose = () => {
    setShowCamera(false);
  };

  const handleAlbumPress = async () => {
    if (!onMultipleImageSelect) return;
    await pickMultipleImages(onMultipleImageSelect);
  };

  const handleFilePress = async () => {
    if (!onMultipleImageSelect) return;
    await pickMultipleImagesFromFiles(onMultipleImageSelect);
  };

  return (
    <>
      {/* 커스텀 카메라 화면 */}
      <CameraScreen
        visible={showCamera}
        onClose={handleCameraClose}
        onCapture={handleCameraCapture}
        frontImage={pillImages?.front || null}
        backImage={pillImages?.back || null}
        mode="camera"
      />
      {/* 이미지 미리보기 슬롯 - 촬영 완료 전에만 표시 */}
      {pillImages &&
        !showApplyButton &&
        (pillImages.front || pillImages.back) && (
          <ImagePreviewSlots
            frontImage={pillImages.front}
            backImage={pillImages.back}
            onRemove={onImageRemove || (() => {})}
          />
        )}

      {/* 촬영/선택 버튼 */}
      <View style={styles.imageSearchButtonsWrapper}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.button, { backgroundColor: COLOR_PRIMARY[400] }]}
          onPress={handleCameraPress}
        >
          <Camera size={24} fill={COLOR['white']} color={COLOR_PRIMARY[400]} />
          <Text style={styles.text}>촬영하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.button, { backgroundColor: COLOR_PRIMARY[200] }]}
          onPress={handleAlbumPress}
        >
          <Image size={24} color={COLOR['white']} />
          <Text style={styles.text}>앨범에서 선택하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.button, { backgroundColor: COLOR_GRAY[400] }]}
          onPress={handleFilePress}
        >
          <FolderClosed size={24} color={COLOR['white']} />
          <Text style={styles.text}>파일 탐색기에서 선택하기</Text>
        </TouchableOpacity>
      </View>

      {/* 검색하기 버튼 */}
      {showApplyButton && (
        <View>
          <View style={styles.hr}></View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.button,
              { backgroundColor: COLOR_PRIMARY[200], borderRadius: 50 },
            ]}
            onPress={onApply}
          >
            <Text style={styles.searchButtonText}>검색하기</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default ImageSearchButtons;
