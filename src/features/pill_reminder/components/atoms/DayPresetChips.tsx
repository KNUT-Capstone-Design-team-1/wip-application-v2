import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/pill_reminder/styles/atoms/DayPresetChips';

interface IDayPresetChipsProps {
  isEveryday: boolean;
  isWeekdays: boolean;
  isWeekends: boolean;
  onSelectAll: () => void;
  onSelectWeekdays: () => void;
  onSelectWeekends: () => void;
}

// 요일 간편 선택 프리셋 칩 버튼 컴포넌트
export const DayPresetChips = memo(
  ({
    isEveryday,
    isWeekdays,
    isWeekends,
    onSelectAll,
    onSelectWeekdays,
    onSelectWeekends,
  }: IDayPresetChipsProps) => {
    return (
      <View style={styles.quickRow}>
        <TouchableOpacity
          style={[styles.quickChip, isEveryday && styles.quickChipSelected]}
          onPress={onSelectAll}
          activeOpacity={0.7}
        >
          <BaseText
            size={12}
            weight={isEveryday ? 'bold' : 'medium'}
            style={isEveryday ? styles.quickTextSelected : styles.quickText}
          >
            매일
          </BaseText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickChip, isWeekdays && styles.quickChipSelected]}
          onPress={onSelectWeekdays}
          activeOpacity={0.7}
        >
          <BaseText
            size={12}
            weight={isWeekdays ? 'bold' : 'medium'}
            style={isWeekdays ? styles.quickTextSelected : styles.quickText}
          >
            평일 (월~금)
          </BaseText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickChip, isWeekends && styles.quickChipSelected]}
          onPress={onSelectWeekends}
          activeOpacity={0.7}
        >
          <BaseText
            size={12}
            weight={isWeekends ? 'bold' : 'medium'}
            style={isWeekends ? styles.quickTextSelected : styles.quickText}
          >
            주말 (토·일)
          </BaseText>
        </TouchableOpacity>
      </View>
    );
  },
);

DayPresetChips.displayName = 'DayPresetChips';
