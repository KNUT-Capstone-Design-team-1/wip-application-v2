import React from 'react';
import { View, TouchableOpacity, Image, Pressable } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { X } from 'lucide-react-native';
import { COLOR } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { styles } from '../../styles/organisms/CameraScreen';
import { usePillImageStore } from '../../store/pill_image_store';
import { usePillImageActions } from '../../hooks/usePillImageActions';

interface CameraHeaderProps {
  onClose: () => void;
}

// 상단 타이틀, 닫기 버튼 및 촬영된 앞/뒷면 이미지 슬롯을 렌더링하는 헤더 컴포넌트
export const CameraHeader = ({ onClose }: CameraHeaderProps) => {
  const { handlePreviewPress } = usePillImageActions();

  const { front: frontImage, back: backImage } = usePillImageStore(
    (state) => state.pillImages,
  );

  const direction = usePillImageStore((state) => state.direction);

  return (
    <View style={styles.topOverlay}>
      {/* 닫기 버튼 */}
      <TouchableOpacity style={[styles.closeButton]} onPress={onClose}>
        <X size={fontPx(24)} color={COLOR['white']} strokeWidth={3} />
      </TouchableOpacity>

      {/* 앞/뒷면 이미지 표시 슬롯 래퍼 */}
      <View style={styles.slotsWrapper}>
        {/* 앞면 슬롯 */}
        <Pressable
          style={[
            styles.slot,
            direction === 'front' && styles.slotSelectedBorder,
          ]}
          onPress={() => handlePreviewPress('front')}
        >
          {frontImage ? (
            <Image source={{ uri: frontImage }} style={styles.slotImage} />
          ) : (
            <View style={styles.emptySlot}>
              <BaseText size={18} weight="medium" style={styles.label}>
                앞면
              </BaseText>
            </View>
          )}
        </Pressable>

        {/* 뒷면 슬롯 */}
        <Pressable
          style={[
            styles.slot,
            direction === 'back' && styles.slotSelectedBorder,
          ]}
          onPress={() => handlePreviewPress('back')}
        >
          {backImage ? (
            <Image source={{ uri: backImage }} style={styles.slotImage} />
          ) : (
            <View style={styles.emptySlot}>
              <BaseText size={18} weight="medium" style={styles.label}>
                뒷면
              </BaseText>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
};
