import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { Plus, Minus } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import {
  MIN_DOSAGE,
  MAX_DOSAGE,
} from '@features/pill_reminder/constants/reminder_validation_constant';
import { styles } from '@features/pill_reminder/styles/atoms/DosageCounter';

interface IDosageCounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

// 복용량 증감 조절 컴포넌트
export const DosageCounter = memo(
  ({
    value,
    onChange,
    min = MIN_DOSAGE,
    max = MAX_DOSAGE,
  }: IDosageCounterProps) => {
    // 수량 감소 핸들러
    const handleMinus = () => {
      if (value <= min) {
        return;
      }
      onChange(value - 1);
    };

    // 수량 증가 핸들러
    const handlePlus = () => {
      if (value >= max) {
        return;
      }
      onChange(value + 1);
    };

    const isMinusDisabled = value <= min;
    const isPlusDisabled = value >= max;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, isMinusDisabled && styles.disabledButton]}
          onPress={handleMinus}
          disabled={isMinusDisabled}
          activeOpacity={0.7}
        >
          <Minus
            size={fontPx(14)}
            color={isMinusDisabled ? COLOR_TEXT.disabled : COLOR_TEXT.body}
          />
        </TouchableOpacity>

        <View style={styles.valueContainer}>
          <BaseText size={15} weight="bold" style={styles.valueText}>
            {value}정
          </BaseText>
        </View>

        <TouchableOpacity
          style={[styles.button, isPlusDisabled && styles.disabledButton]}
          onPress={handlePlus}
          disabled={isPlusDisabled}
          activeOpacity={0.7}
        >
          <Plus
            size={fontPx(14)}
            color={isPlusDisabled ? COLOR_TEXT.disabled : COLOR_TEXT.body}
          />
        </TouchableOpacity>
      </View>
    );
  },
);

DosageCounter.displayName = 'DosageCounter';
