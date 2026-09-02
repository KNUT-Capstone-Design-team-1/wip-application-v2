import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../../styles/organisms/ImageLoadButtons';
import { COLOR, COLOR_BG } from '@constants/color';
import CameraScreen from './CameraScreen';
import { Camera, ChevronRight, Image } from 'lucide-react-native';
import { fontPx } from '@utils/responsive';
import { usePillImageActions } from '../../hooks/usePillImageActions';

const ImageLoadButtons = () => {
  const { handleAlbumPress, handleFilePress, handleCameraClose } =
    usePillImageActions();

  // 카메라 모달 표시 여부 상태
  const [showCamera, setShowCamera] = useState(false);

  // '촬영하기' 버튼 클릭 핸들러: 카메라 모달 열기
  const handleCameraPress = () => {
    setShowCamera(true);
  };

  return (
    <>
      {/* 커스텀 카메라 화면 */}
      <CameraScreen
        visible={showCamera}
        onClose={() => {
          setShowCamera(false);
          handleCameraClose();
        }}
      />

      {/* 촬영/선택 버튼 */}
      <View style={styles.imageSearchButtonsWrapper}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.button, { backgroundColor: COLOR_BG['btnDark'] }]}
          onPress={handleCameraPress}
        >
          <Camera size={fontPx(24)} color={COLOR['white']} />
          <BaseText size={16} weight="bold" style={styles.text}>
            촬영하기
          </BaseText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.button, { backgroundColor: COLOR_BG['btnSecondary'] }]}
          onPress={async () => {
            await handleAlbumPress();
          }}
        >
          <Image size={fontPx(24)} color={COLOR['white']} />
          <BaseText size={16} weight="bold" style={styles.text}>
            앨범에서 선택하기
          </BaseText>
        </TouchableOpacity>
      </View>
      <View style={styles.explorerButtonWrapper}>
        <BaseText size={14} weight="semiBold" style={styles.explorerInfoText}>
          앨범에 모든 사진이 표시되지 않았나요?
        </BaseText>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.explorerButton}
          onPress={async () => {
            await handleFilePress();
          }}
        >
          <BaseText size={14} weight="bold" style={styles.explorerButtonText}>
            파일 탐색기에서 선택하기
          </BaseText>
          <ChevronRight
            size={fontPx(16)}
            color={COLOR['secondary']}
            strokeWidth={fontPx(3)}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ImageLoadButtons;
