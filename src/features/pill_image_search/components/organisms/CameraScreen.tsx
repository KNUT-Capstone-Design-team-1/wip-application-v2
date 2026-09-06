import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import { styles } from '../../styles/organisms/CameraScreen';
import { useCameraCapture } from '../../hooks/useCameraCapture';
import { useCameraConfig } from '@features/pill_image_search/hooks/useCameraConfig';
import { CameraHeader } from '../molecules/CameraHeader';
import { CameraCaptureButton } from '../molecules/CameraCaptureButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePillImageActions } from '@features/pill_image_search/hooks/usePillImageActions';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

// 카메라 촬영 화면 (Expo Router fullScreenModal 라우트)
const CameraScreen = () => {
  const router = useRouter();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  // 카메라 기기 설정 및 권한 훅
  const { device, format, getGuideWidth } = useCameraConfig();

  const { handleCameraCapture } = usePillImageActions();

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  // 사진 촬영 로직 훅
  const { cameraRef, capturePhoto, isProcessing } = useCameraCapture({
    onCapture: handleCameraCapture,
  });

  // 권한이 없거나 카메라 기기를 못 찾았을 경우 렌더링 방지
  if (!device) {
    return null;
  }

  return (
    <View
      style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}
      pointerEvents={isProcessing ? 'none' : 'auto'}
    >
      <StatusBar style="light" />

      {/* 헤더 및 이미지 슬롯 영역 */}
      <CameraHeader onClose={handleClose} />

      {/* 중앙 카메라 뷰파인더 및 가이드라인 영역 */}
      {/* 핀치줌이나 탭투포커스 추가시 GestureDetector를 해당 영역에 배치하여 처리
      카메라 자체는 pointerEvents="none" 처리 */}
      <View style={styles.guideOverlay}>
        {/* 실제 카메라 렌즈 뷰 */}
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isFocused}
          photo={true}
          format={format}
          photoQualityBalance="balanced"
          resizeMode="cover"
          androidPreviewViewType="texture-view"
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
        onClose={handleClose}
        isProcessing={isProcessing}
      />
    </View>
  );
};

export default CameraScreen;
