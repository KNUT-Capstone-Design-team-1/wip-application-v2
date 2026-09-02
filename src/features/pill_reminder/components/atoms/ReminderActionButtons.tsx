import React, { memo } from 'react';
import { View, Switch } from 'react-native';
import { SelectionRadioButton } from '@features/pill_save/components/atoms/SelectionRadioButton';
import { COLOR, COLOR_LINE } from '@constants/color';
import { styles } from '@features/pill_reminder/styles/atoms/ReminderActionButtons';

interface IReminderActionButtonsProps {
  isEnabled: boolean;
  isEditing?: boolean;
  isSelected?: boolean;
  onToggle: (value: boolean) => void;
}

// 알림 카드 우측 스위치 및 편집 모드 선택 라디오 버튼 컴포넌트
export const ReminderActionButtons = memo(
  ({
    isEnabled,
    isEditing = false,
    isSelected = false,
    onToggle,
  }: IReminderActionButtonsProps) => {
    return (
      <View style={styles.container}>
        {isEditing ? (
          <SelectionRadioButton isSelected={isSelected} size={20} />
        ) : (
          <Switch
            value={isEnabled}
            onValueChange={onToggle}
            trackColor={{ false: COLOR_LINE.border, true: COLOR.primary }}
            thumbColor={COLOR.white}
            ios_backgroundColor={COLOR_LINE.border}
          />
        )}
      </View>
    );
  },
);

ReminderActionButtons.displayName = 'ReminderActionButtons';
