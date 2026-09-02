import React, { memo } from 'react';
import { View, TouchableOpacity, Switch } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { COLOR, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { styles } from '@features/pill_reminder/styles/atoms/ReminderActionButtons';

interface IReminderActionButtonsProps {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
  onDelete: () => void;
}

// 알림 카드 상단 우측 스위치 및 삭제 버튼 컴포넌트
export const ReminderActionButtons = memo(
  ({ isEnabled, onToggle, onDelete }: IReminderActionButtonsProps) => {
    return (
      <View style={styles.container}>
        <Switch
          value={isEnabled}
          onValueChange={onToggle}
          trackColor={{ false: COLOR_LINE.border, true: COLOR.primary }}
          thumbColor={COLOR.white}
          ios_backgroundColor={COLOR_LINE.border}
        />
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Trash2 size={fontPx(18)} color={COLOR_TEXT.sub} />
        </TouchableOpacity>
      </View>
    );
  },
);

ReminderActionButtons.displayName = 'ReminderActionButtons';
