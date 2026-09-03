import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR_TEXT } from '@constants/color';
import { X } from 'lucide-react-native';
import { px, fontPx } from '@utils/responsive';
import { IMarkModalHeaderProps } from '@features/pill_identification_search/types';
import { styles } from '../../styles/molecules/MarkModalHeader';

// 마크 모달 상단 헤더 영역 컴포넌트
const MarkModalHeader = memo(({ onClose }: IMarkModalHeaderProps) => {
  return (
    <>
      {/* 상단 손잡이 (그랩바) */}
      <View style={styles.grabber} />

      {/* 닫기 버튼 */}
      <TouchableOpacity
        onPress={onClose}
        style={styles.closeButton}
        hitSlop={{
          top: px(10),
          bottom: px(10),
          left: px(10),
          right: px(10),
        }}
      >
        <X size={fontPx(24)} color={COLOR_TEXT['sub']} strokeWidth={3} />
      </TouchableOpacity>

      {/* 타이틀 */}
      <BaseText style={styles.title} size={18} weight="bold">
        마크 검색
      </BaseText>
    </>
  );
});

MarkModalHeader.displayName = 'MarkModalHeader';

export default MarkModalHeader;
