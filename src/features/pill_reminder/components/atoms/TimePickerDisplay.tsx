import React, { memo, useRef } from 'react';
import { View, TextInput } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/pill_reminder/styles/atoms/TimePickerDisplay';

interface ITimePickerDisplayProps {
  hour: string;
  minute: string;
  onHourChange: (hour: string) => void;
  onMinuteChange: (minute: string) => void;
}

// 시간/분 직접 숫자 입력 및 디스플레이 컴포넌트
export const TimePickerDisplay = memo(
  ({ hour, minute, onHourChange, onMinuteChange }: ITimePickerDisplayProps) => {
    const minuteInputRef = useRef<TextInput>(null);

    // 시간 입력 핸들러 (00~23)
    const handleHourTextChange = (text: string) => {
      const clean = text.replace(/[^0-9]/g, '');
      if (!clean) {
        onHourChange('');
        return;
      }

      const num = parseInt(clean, 10);
      if (num > 23) {
        onHourChange('23');
        minuteInputRef.current?.focus();
        return;
      }

      onHourChange(clean);
      if (clean.length >= 2) {
        minuteInputRef.current?.focus();
      }
    };

    // 시간 포커스 해제 시 2자리 포맷팅
    const handleHourBlur = () => {
      if (!hour) {
        onHourChange('00');
        return;
      }
      onHourChange(hour.padStart(2, '0'));
    };

    // 분 입력 핸들러 (00~59)
    const handleMinuteTextChange = (text: string) => {
      const clean = text.replace(/[^0-9]/g, '');
      if (!clean) {
        onMinuteChange('');
        return;
      }

      const num = parseInt(clean, 10);
      if (num > 59) {
        onMinuteChange('59');
        return;
      }

      onMinuteChange(clean);
    };

    // 분 포커스 해제 시 2자리 포맷팅
    const handleMinuteBlur = () => {
      if (!minute) {
        onMinuteChange('00');
        return;
      }
      onMinuteChange(minute.padStart(2, '0'));
    };

    return (
      <View>
        <View style={styles.container}>
          {/* 시 입력 박스 */}
          <View style={styles.timeBox}>
            <TextInput
              value={hour}
              onChangeText={handleHourTextChange}
              onBlur={handleHourBlur}
              keyboardType="number-pad"
              maxLength={2}
              selectTextOnFocus
              style={styles.timeInput}
            />
          </View>

          <BaseText style={styles.colonText}>:</BaseText>

          {/* 분 입력 박스 */}
          <View style={styles.timeBox}>
            <TextInput
              ref={minuteInputRef}
              value={minute}
              onChangeText={handleMinuteTextChange}
              onBlur={handleMinuteBlur}
              keyboardType="number-pad"
              maxLength={2}
              selectTextOnFocus
              style={styles.timeInput}
            />
          </View>
        </View>

        <BaseText size={11} weight="medium" style={styles.hintText}>
          숫자를 터치하여 직접 입력하거나 아래 목록에서 선택하세요
        </BaseText>
      </View>
    );
  },
);

TimePickerDisplay.displayName = 'TimePickerDisplay';
