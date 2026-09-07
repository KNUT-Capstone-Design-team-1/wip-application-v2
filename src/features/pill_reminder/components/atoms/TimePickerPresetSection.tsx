import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { TIME_PRESETS } from '@features/pill_reminder/constants/pill_reminder_constant';
import { styles } from '@features/pill_reminder/styles/molecules/TimePickerModal';

interface ITimePickerPresetSectionProps {
  currentTime24: string;
  onSelectPreset: (time: string) => void;
}

export const TimePickerPresetSection = ({
  currentTime24,
  onSelectPreset,
}: ITimePickerPresetSectionProps) => {
  return (
    <>
      <BaseText size={15} weight="bold" style={styles.sectionLabel}>
        자주 설정하는 시간
      </BaseText>
      <View style={styles.presetContainer}>
        {TIME_PRESETS.map((preset) => {
          const isActive = currentTime24 === preset.time;
          return (
            <TouchableOpacity
              key={preset.label}
              style={[styles.presetChip, isActive && styles.presetChipActive]}
              onPress={() => onSelectPreset(preset.time)}
              activeOpacity={0.7}
            >
              <BaseText
                size={14}
                weight="bold"
                style={[
                  styles.presetLabel,
                  isActive && styles.presetLabelActive,
                ]}
              >
                {preset.label}
              </BaseText>
              <BaseText
                size={12}
                weight="medium"
                style={[styles.presetTime, isActive && styles.presetTimeActive]}
              >
                {preset.subLabel}
              </BaseText>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
};
