import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../../styles/organisms/CameraScreen';

interface CameraCaptureButtonProps {
  onCapture: () => void;
  isProcessing: boolean;
}

// 화면 하단의 사진 촬영 셔터 버튼을 렌더링하는 컴포넌트
export const CameraCaptureButton = ({
  onCapture,
  isProcessing,
}: CameraCaptureButtonProps) => {
  // 노치 등 하단 안전 영역 확보
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bottomOverlay,
        { paddingBottom: Math.max(insets.bottom, 40) },
      ]}
    >
      {/* 촬영 버튼 (처리 중일 땐 비활성화 및 반투명 처리) */}
      <TouchableOpacity
        style={[styles.captureButton, isProcessing && { opacity: 0.5 }]}
        onPress={onCapture}
        disabled={isProcessing}
      >
        <View style={styles.captureButtonInner} />
      </TouchableOpacity>
    </View>
  );
};
