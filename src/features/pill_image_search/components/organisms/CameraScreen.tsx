import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import { styles } from '../../styles/organisms/CameraScreen';
import { useCameraCapture } from '../../hooks/useCameraCapture';
import { useCameraConfig } from '@features/pill_image_search/hooks/useCameraConfig';
import { CameraPermissionAlert } from '../molecules/CameraPermissionAlert';
import { CameraHeader } from '../molecules/CameraHeader';
import { CameraCaptureButton } from '../molecules/CameraCaptureButton';

interface CameraScreenProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (imageUri: string) => void;
  frontImage: string | null;
  backImage: string | null;
  mode: 'camera' | 'album';
}

// 카메라 촬영 화면의 메인 컨테이너 컴포넌트
const CameraScreen = ({
  visible,
  onClose,
  onCapture,
  frontImage,
  backImage,
}: CameraScreenProps) => {
  // 카메라 기기 설정 및 권한 훅
  const { device, format, hasPermission, requestPermission, getGuideWidth } =
    useCameraConfig();

  // 사진 촬영 로직 훅
  const { cameraRef, capturePhoto, isProcessing } = useCameraCapture({
    onCapture,
  });

  // 권한 안내 모달 표시 상태
  const [showPermissionAlert, setShowPermissionAlert] = useState(false);

  // 모달 팝업 시 카메라 권한 확인 및 요청
  useEffect(() => {
    if (visible && !hasPermission) {
      requestPermission().then((isGranted) => {
        if (!isGranted) {
          setShowPermissionAlert(true); // 권한 거부 시 커스텀 알림창 띄움
        }
      });
    }
  }, [visible, hasPermission]);

  // 렌더링 조건 방어 로직
  if (!visible) {
    return null;
  }

  // 권한 거부 상태일 때 커스텀 안내 모달 렌더링
  if (showPermissionAlert) {
    return (
      <CameraPermissionAlert
        visible={showPermissionAlert}
        onClose={onClose}
        onCancel={() => {
          setShowPermissionAlert(false);
          onClose();
        }}
      />
    );
  }

  // 권한이 없거나 카메라 기기를 못 찾았을 경우 렌더링 방지
  if (!hasPermission || !device) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* 헤더 및 이미지 슬롯 영역 */}
        <CameraHeader
          onClose={onClose}
          frontImage={frontImage}
          backImage={backImage}
        />

        {/* 중앙 카메라 뷰파인더 및 가이드라인 영역 */}
        <View style={styles.guideOverlay}>
          {/* 실제 카메라 렌즈 뷰 */}
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={visible}
            photo={true}
            format={format}
            photoQualityBalance="balanced"
            resizeMode="cover"
          />
          {/* 촬영 규격 가이드 테두리 */}
          <View style={[styles.guideView, { width: getGuideWidth() }]}>
            <View style={[styles.guideCorner, styles.topLeft]} />
            <View style={[styles.guideCorner, styles.topRight]} />
            <View style={[styles.guideCorner, styles.bottomLeft]} />
            <View style={[styles.guideCorner, styles.bottomRight]} />
          </View>
        </View>

        {/* 하단 셔터 버튼 영역 */}
        <CameraCaptureButton
          onCapture={capturePhoto}
          isProcessing={isProcessing}
        />
      </View>
    </Modal>
  );
};

export default CameraScreen;
