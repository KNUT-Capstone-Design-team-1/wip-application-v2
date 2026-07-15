import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { Plus, X } from 'lucide-react-native';
import { COLOR } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { styles } from '../../styles/organisms/CameraScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CameraHeaderProps {
  onClose: () => void;
  frontImage: string | null;
  backImage: string | null;
}

// 상단 타이틀, 닫기 버튼 및 촬영된 앞/뒷면 이미지 슬롯을 렌더링하는 헤더 컴포넌트
export const CameraHeader = ({
  onClose,
  frontImage,
  backImage,
}: CameraHeaderProps) => {
  // 노치 등 상단 안전 영역 확보
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.topOverlay, { paddingTop: Math.max(insets.top, 20) }]}>
      {/* 닫기 버튼 */}
      <TouchableOpacity
        style={[styles.closeButton, { top: Math.max(insets.top, 20) + 10 }]}
        onPress={onClose}
      >
        <X size={fontPx(24)} color={COLOR['white']} strokeWidth={3} />
      </TouchableOpacity>

      {/* 화면 타이틀 */}
      <BaseText size={18} weight="bold" style={styles.title}>
        알약 검색
      </BaseText>

      {/* 앞/뒷면 이미지 표시 슬롯 래퍼 */}
      <View style={styles.slotsWrapper}>
        {/* 앞면 슬롯 */}
        <View style={styles.slot}>
          <BaseText size={14} weight="medium" style={styles.label}>
            앞면
          </BaseText>
          {frontImage ? (
            <Image source={{ uri: frontImage }} style={styles.slotImage} />
          ) : (
            <View style={styles.emptySlot}>
              <Plus size={fontPx(24)} color={COLOR['white']} strokeWidth={2} />
            </View>
          )}
        </View>

        {/* 뒷면 슬롯 */}
        <View style={styles.slot}>
          <BaseText size={14} weight="medium" style={styles.label}>
            뒷면
          </BaseText>
          {backImage ? (
            <Image source={{ uri: backImage }} style={styles.slotImage} />
          ) : (
            <View style={styles.emptySlot}>
              <Plus size={fontPx(24)} color={COLOR['white']} strokeWidth={2} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
