import React, { RefObject } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/pill_reminder/styles/molecules/TimePickerModal';

interface ITimePickerColumnProps {
  unitLabel: '시' | '분';
  value: string;
  isActive: boolean;
  inputRef: RefObject<TextInput | null>;
  onFocus: () => void;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  adjustButtons: { label: string; offset: number }[];
  onAdjust: (offset: number) => void;
}

export const TimePickerColumn = ({
  unitLabel,
  value,
  isActive,
  inputRef,
  onFocus,
  onChangeText,
  onBlur,
  adjustButtons,
  onAdjust,
}: ITimePickerColumnProps) => {
  // 2개씩 짝지어서 행(Row) 구성
  const rows: { label: string; offset: number }[][] = [];
  for (let i = 0; i < adjustButtons.length; i += 2) {
    rows.push(adjustButtons.slice(i, i + 2));
  }

  return (
    <View style={styles.timeColumn}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
        style={[styles.timeBox, isActive && styles.timeBoxActive]}
      >
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={2}
          selectTextOnFocus
          style={styles.timeInput}
        />
        <BaseText size={12} weight="bold" style={styles.timeUnit}>
          {unitLabel}
        </BaseText>
      </TouchableOpacity>

      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.columnAdjustRow}>
          {row.map((btn) => (
            <TouchableOpacity
              key={btn.label}
              style={styles.adjustBtnSmall}
              onPress={() => onAdjust(btn.offset)}
              activeOpacity={0.6}
            >
              <BaseText size={13} weight="bold" style={styles.adjustBtnText}>
                {btn.label}
              </BaseText>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};
