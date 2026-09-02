import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { X, Plus } from 'lucide-react-native';
import { COLOR, COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { formatReminderTime } from '@features/pill_reminder/utils/reminder_format';
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
    // 추가 버튼일 경우 요일 버튼 스타일과 일치하는 + 버튼 렌더링
    if (isAddButton) {
      return (
        <TouchableOpacity
          style={styles.addButton}
          onPress={onPressAdd}
          activeOpacity={0.7}
        >
          <Plus size={fontPx(18)} color={COLOR_TEXT.sub} />
        </TouchableOpacity>
      );
    }

    const hasOnPress = Boolean(onPress);
    const formattedTime = formatReminderTime(time);

    return (
      <TouchableOpacity
        style={styles.chipContainer}
        onPress={onPress}
        disabled={!hasOnPress}
        activeOpacity={0.7}
      >
        <BaseText size={16} weight="bold" style={styles.timeText}>
          {formattedTime}
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
            <X size={fontPx(15)} color={COLOR.white} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  },
);

TimeChip.displayName = 'TimeChip';
