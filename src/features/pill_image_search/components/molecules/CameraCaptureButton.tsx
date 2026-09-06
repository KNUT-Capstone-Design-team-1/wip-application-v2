import React from 'react';
import { View, TouchableOpacity, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../../styles/organisms/CameraScreen';
import { BaseText } from '@components/common/BaseText';
import { fontPx, px } from '@utils/responsive';
import { ChevronRight } from 'lucide-react-native';
import { COLOR } from '@constants/color';

interface CameraCaptureButtonProps {
  onCapture: () => void;
  onClose: () => void;
  isProcessing: boolean;
}

// 화면 하단의 사진 촬영 셔터 버튼을 렌더링하는 컴포넌트
export const CameraCaptureButton = ({
  onCapture,
  onClose,
  isProcessing,
}: CameraCaptureButtonProps) => {
  // 노치 등 하단 안전 영역 확보
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bottomOverlay,
        {
          paddingBottom: Math.max(insets.bottom, 40),
        },
      ]}
    >
      {/* 촬영 버튼 (처리 중일 땐 비활성화 및 반투명 처리) */}
      <View style={styles.bottomOverlayWrapper}>
        <TouchableOpacity
          style={[styles.captureButton, isProcessing && { opacity: 0.5 }]}
          onPress={onCapture}
          disabled={isProcessing}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        <Pressable
          style={({ pressed }) => [
            styles.bottomCompleteButton,
            { opacity: pressed ? 0.6 : 1 },
          ]}
          onPress={onClose}
        >
          <BaseText
            size={22}
            weight="bold"
            style={styles.bottomCompleteButtonText}
          >
            완료
          </BaseText>
          <ChevronRight
            size={fontPx(26)}
            color={COLOR['white']}
            strokeWidth={fontPx(2)}
          />
        </Pressable>
      </View>
    </View>
  );
};
