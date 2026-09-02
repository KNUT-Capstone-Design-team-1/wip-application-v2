import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { X, Plus } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { styles } from '@features/pill_reminder/styles/atoms/TimeChip';

interface ITimeChipProps {
  time: string;
  onPress?: () => void;
  onRemove?: () => void;
  isAddButton?: boolean;
  onPressAdd?: () => void;
}

// 복용 시간 태그 및 추가 칩 컴포넌트
export const TimeChip = memo(
  ({ time, onPress, onRemove, isAddButton, onPressAdd }: ITimeChipProps) => {
    // 추가 버튼일 경우 + 아이콘만 심플하게 렌더링
    if (isAddButton) {
      return (
        <TouchableOpacity
          style={styles.addButton}
          onPress={onPressAdd}
          activeOpacity={0.7}
        >
          <Plus size={fontPx(18)} color={COLOR_TEXT.subTitle} />
        </TouchableOpacity>
      );
    }

    const hasOnPress = Boolean(onPress);

    return (
      <TouchableOpacity
        style={styles.chipContainer}
        onPress={onPress}
        disabled={!hasOnPress}
        activeOpacity={0.7}
      >
        <BaseText size={15} weight="bold" style={styles.timeText}>
          {time}
        </BaseText>

        {onRemove && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={fontPx(14)} color={COLOR_TEXT.sub} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  },
);

TimeChip.displayName = 'TimeChip';
