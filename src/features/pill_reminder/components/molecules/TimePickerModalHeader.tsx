import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { X } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { styles } from '@features/pill_reminder/styles/molecules/TimePickerModalHeader';

interface ITimePickerModalHeaderProps {
  onClose: () => void;
}

// 복용 시간 선택 모달 상단 헤더 컴포넌트
export const TimePickerModalHeader = memo(
  ({ onClose }: ITimePickerModalHeaderProps) => {
    return (
      <View style={styles.header}>
        <BaseText size={18} weight="bold" style={styles.title}>
          복용 시간 설정
        </BaseText>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={fontPx(22)} color={COLOR_TEXT.sub} />
        </TouchableOpacity>
      </View>
    );
  },
);

TimePickerModalHeader.displayName = 'TimePickerModalHeader';
