import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { DayPresetChips } from '@features/pill_reminder/components/atoms/DayPresetChips';
import { useDaySelector } from '@features/pill_reminder/hooks/use_day_selector';
import {
  DAYS,
  DAY_NAMES,
} from '@features/pill_reminder/constants/pill_reminder_constant';
import { styles } from '@features/pill_reminder/styles/atoms/DaySelector';

interface IDaySelectorProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
}

// 복용 요일 선택 컴포넌트
export const DaySelector = memo(
  ({ selectedDays, onChange }: IDaySelectorProps) => {
    const {
      toggleDay,
      handleSelectAll,
      handleSelectWeekdays,
      handleSelectWeekends,
      isEveryday,
      isWeekdays,
      isWeekends,
    } = useDaySelector(selectedDays, onChange);

    return (
      <View style={styles.container}>
        {/* 요일 원형 버튼 리스트 (일, 월, 화, 수, 목, 금, 토) */}
        <View style={styles.daysRow}>
          {DAYS.map((day) => {
            const isSelected = selectedDays.includes(day);
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  isSelected && styles.dayButtonSelected,
                ]}
                onPress={() => toggleDay(day)}
                activeOpacity={0.7}
              >
                <BaseText
                  size={14}
                  weight={isSelected ? 'bold' : 'medium'}
                  style={isSelected ? styles.dayTextSelected : styles.dayText}
                >
                  {DAY_NAMES[day]}
                </BaseText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 간편 선택 프리셋 칩 */}
        <DayPresetChips
          isEveryday={isEveryday}
          isWeekdays={isWeekdays}
          isWeekends={isWeekends}
          onSelectAll={handleSelectAll}
          onSelectWeekdays={handleSelectWeekdays}
          onSelectWeekends={handleSelectWeekends}
        />
      </View>
    );
  },
);

DaySelector.displayName = 'DaySelector';
