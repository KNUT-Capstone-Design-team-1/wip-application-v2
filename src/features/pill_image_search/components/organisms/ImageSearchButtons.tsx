import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../../styles/organisms/ImageSearchButtons';
import { COLOR_PRIMARY, COLOR_GRAY, COLOR } from '@constants/color';
import CameraScreen from '../organisms/CameraScreen';
import {
  pickMultipleImages,
  pickMultipleImagesFromFiles,
} from '../../utils/imagePickerUtils';
import { Camera, FolderClosed, Image } from 'lucide-react-native';
import { fontPx } from '@utils/responsive';
import { PillImages } from '../../store/pill_image_store';

interface ImageSearchButtonsProps {
  visible?: boolean;
  onImageSelect?: (imageUri: string) => void;
  onMultipleImageSelect?: (images: string[]) => void;
  pillImages?: PillImages;
  onApply?: () => void;
  showApplyButton?: boolean;
}

const ImageSearchButtons = ({
  onImageSelect,
  onMultipleImageSelect,
  pillImages,
  onApply,
  showApplyButton,
}: ImageSearchButtonsProps) => {
  // 카메라 모달 표시 여부 상태
  const [showCamera, setShowCamera] = useState(false);

  // 카메라 엽기 전 이미 선택되어 있던 이미지 상태
  const [initialPillImages, setInitialPillImages] = useState<PillImages | null>(
    null,
  );

  const [initialImageCount, setInitialImageCount] = useState(0);

  // '촬영하기' 버튼 클릭 핸들러: 카메라 모달 열기
  const handleCameraPress = () => {
    setInitialPillImages(pillImages || null);

    setInitialImageCount(
      (pillImages?.front ? 1 : 0) + (pillImages?.back ? 1 : 0),
    );

    setShowCamera(true);
  };

  // 카메라에서 사진 촬영 완료 시 호출되는 핸들러
  const handleCameraCapture = (imageUri: string) => {
    onImageSelect?.(imageUri);

    // 이번에 새로 촬영하기 직전 상태의 이미지 총 개수 (0~2장)
    const currentCountBeforeCapture =
      (pillImages?.front ? 1 : 0) + (pillImages?.back ? 1 : 0);

    const hasOneImageBeforeCapture = currentCountBeforeCapture === 1;

    // 촬영 전 사진이 1장이었다면, 이번 촬영으로 2장이 채워지므로 카메라 닫기
    if (hasOneImageBeforeCapture) {
      setTimeout(() => {
        console.log('2장 촬영 완료, 카메라 닫기');
        setShowCamera(false);
      }, 300);

      return;
    }

    // 촬영 직전 2장(전체 교체)이었던 경우에만 즉시 안내 모달 표시
    // 맨 처음 촬영(0장)일 때는 자연스럽게 이어서 찍을 수 있도록 모달을 생략함
    const isReplacing = currentCountBeforeCapture === 2;
    if (!isReplacing) {
      return;
    }

    const title = '뒷면 이미지 변경';

    const message =
      '앞면 이미지가 변경되었습니다. 나머지 한 장(뒷면 등)도 변경하시겠습니까?';

    const confirmText = '변경하기 (계속 촬영)';

    const cancelText = '유지하기';

    Alert.alert(title, message, [
      { text: confirmText, onPress: () => {} },
      {
        text: cancelText,
        style: 'cancel',
        onPress: () => {
          const shouldKeepOldBackImage = !!(
            initialPillImages?.back && onMultipleImageSelect
          );

          if (shouldKeepOldBackImage) {
            onMultipleImageSelect([imageUri, initialPillImages!.back!]);
          }

          setShowCamera(false);
        },
      },
    ]);
  };

  // 카메라 모달 닫기 버튼 클릭 핸들러
  const handleCameraClose = () => {
    // 모달을 닫을 시점의 최종 이미지 총 개수 (0~2장)
    const currentCount =
      (pillImages?.front ? 1 : 0) + (pillImages?.back ? 1 : 0);

    const isInitialCapture = initialImageCount === 0 || initialImageCount === 2;

    const isSingleImageCaptured = currentCount === 1;

    const shouldPromptForSecondImage =
      isInitialCapture && isSingleImageCaptured;

    if (shouldPromptForSecondImage) {
      const isReplacing = initialImageCount === 2;

      const title = isReplacing ? '뒷면 이미지 변경' : '이미지 추가 촬영';

      const message = isReplacing
        ? '앞면 이미지가 변경되었습니다. 나머지 한 장(뒷면 등)도 변경하시겠습니까?'
        : '한 장의 이미지가 촬영되었습니다. 나머지 한 장(뒷면 등)을 추가로 촬영해주세요.';

      const confirmText = isReplacing ? '변경하기 (계속 촬영)' : '추가 촬영';

      const cancelText = isReplacing ? '유지하기' : '종료';

      Alert.alert(title, message, [
        { text: confirmText, onPress: () => {} },
        {
          text: cancelText,
          style: 'cancel',
          onPress: () => {
            const shouldKeepOldBackImage = !!(
              isReplacing &&
              initialPillImages?.back &&
              onMultipleImageSelect
            );

            if (shouldKeepOldBackImage) {
              // 2장 상태에서 1장만 찍고 종료(유지)를 선택한 경우:
              // 새로 찍은 앞면(pillImages?.front)과 기존에 저장해둔 뒷면(initialPillImages.back)을 결합
              onMultipleImageSelect([
                pillImages!.front!,
                initialPillImages!.back!,
              ]);
            }

            setShowCamera(false);
          },
        },
      ]);
      return;
    }
    setShowCamera(false);
  };

  // '앨범에서 선택하기' 버튼 클릭 핸들러
  const handleAlbumPress = async () => {
    const hasMultipleImageSelectCallback = !!onMultipleImageSelect;

    if (!hasMultipleImageSelectCallback) {
      return;
    }

    await pickMultipleImages(onMultipleImageSelect, pillImages);
  };

  // '파일 탐색기에서 선택하기' 버튼 클릭 핸들러
  const handleFilePress = async () => {
    const hasMultipleImageSelectCallback = !!onMultipleImageSelect;

    if (!hasMultipleImageSelectCallback) {
      return;
    }

    await pickMultipleImagesFromFiles(onMultipleImageSelect, pillImages);
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

      {/* 촬영/선택 버튼 */}
      <View style={styles.imageSearchButtonsWrapper}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.button, { backgroundColor: COLOR_PRIMARY[400] }]}
          onPress={handleCameraPress}
        >
          <Camera
            size={fontPx(24)}
            fill={COLOR['white']}
            color={COLOR_PRIMARY[400]}
          />
          <Text style={styles.text}>촬영하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.button, { backgroundColor: COLOR_PRIMARY[200] }]}
          onPress={handleAlbumPress}
        >
          <Image size={fontPx(24)} color={COLOR['white']} />
          <Text style={styles.text}>앨범에서 선택하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.button, { backgroundColor: COLOR_GRAY[400] }]}
          onPress={handleFilePress}
        >
          <FolderClosed size={fontPx(24)} color={COLOR['white']} />
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
