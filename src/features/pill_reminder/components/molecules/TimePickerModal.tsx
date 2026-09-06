import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import BaseModal from '@components/common/BaseModal';
import { BaseText } from '@components/common/BaseText';
import { TimePickerModalHeader } from '@features/pill_reminder/components/molecules/TimePickerModalHeader';
import { TimePickerModalFooter } from '@features/pill_reminder/components/molecules/TimePickerModalFooter';
import {
  TIME_PRESETS,
  TPeriod,
} from '@features/pill_reminder/constants/pill_reminder_constant';
import {
  parse24To12,
  format12To24,
} from '@features/pill_reminder/utils/reminder_format';
import { styles } from '@features/pill_reminder/styles/molecules/TimePickerModal';

interface ITimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (timeStr: string) => void;
  initialTime?: string;
}

// 복용 시간 스마트 선택 모달 (빠른 프리셋 + 스마트 조절기 + 직접 입력)
export const TimePickerModal = ({
  visible,
  onClose,
  onConfirm,
  initialTime = '08:00',
}: ITimePickerModalProps) => {
  const [period, setPeriod] = useState<TPeriod>('오전');
  const [hour, setHour] = useState('08');
  const [minute, setMinute] = useState('00');
  const [activeField, setActiveField] = useState<'hour' | 'minute' | null>(
    null,
  );

  const hourInputRef = useRef<TextInput>(null);
  const minuteInputRef = useRef<TextInput>(null);

  // 모달 열릴 때 초기 시간 파싱
  useEffect(() => {
    if (!visible) return;
    const parsed = parse24To12(initialTime);
    setPeriod(parsed.period);
    setHour(parsed.hour);
    setMinute(parsed.minute);
    setActiveField(null);
  }, [visible, initialTime]);

  // 시(Hour) 직접 입력 핸들러 (1~12 제한)
  const handleHourChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned === '') {
      setHour('');
      return;
    }
    const num = parseInt(cleaned, 10);
    if (num > 12) {
      setHour('12');
    } else {
      setHour(cleaned);
    }
  };

  // 시(Hour) 입력 포커스 아웃 시 2자리 포맷 보정
  const handleHourBlur = () => {
    setActiveField(null);
    const num = parseInt(hour, 10);
    if (isNaN(num) || num < 1) {
      setHour('12');
    } else {
      setHour(num.toString().padStart(2, '0'));
    }
  };

  // 분(Minute) 직접 입력 핸들러 (0~59 제한)
  const handleMinuteChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned === '') {
      setMinute('');
      return;
    }
    const num = parseInt(cleaned, 10);
    if (num > 59) {
      setMinute('59');
    } else {
      setMinute(cleaned);
    }
  };

  // 분(Minute) 입력 포커스 아웃 시 2자리 포맷 보정
  const handleMinuteBlur = () => {
    setActiveField(null);
    const num = parseInt(minute, 10);
    if (isNaN(num) || num < 0) {
      setMinute('00');
    } else {
      setMinute(num.toString().padStart(2, '0'));
    }
  };

  // 현재 설정된 24시간제 문자열
  const currentTime24 = format12To24(period, hour, minute);

  // 1. 프리셋 선택 핸들러
  const handleSelectPreset = useCallback((presetTime: string) => {
    const parsed = parse24To12(presetTime);
    setPeriod(parsed.period);
    setHour(parsed.hour);
    setMinute(parsed.minute);
  }, []);

  // 2. 시간/분 스마트 증감 핸들러
  const handleAdjustMinutes = useCallback(
    (offsetMinutes: number) => {
      const current24 = format12To24(period, hour, minute);
      const [hStr, mStr] = current24.split(':');
      let totalMinutes =
        parseInt(hStr, 10) * 60 + parseInt(mStr, 10) + offsetMinutes;

      // 24시간 범위(0~1439) 순환
      if (totalMinutes < 0) {
        totalMinutes = (totalMinutes % 1440) + 1440;
      } else if (totalMinutes >= 1440) {
        totalMinutes = totalMinutes % 1440;
      }

      const newHour24 = Math.floor(totalMinutes / 60)
        .toString()
        .padStart(2, '0');
      const newMinute = (totalMinutes % 60).toString().padStart(2, '0');
      const parsed = parse24To12(`${newHour24}:${newMinute}`);

      setPeriod(parsed.period);
      setHour(parsed.hour);
      setMinute(parsed.minute);
    },
    [period, hour, minute],
  );

  // 3. 오전/오후 토글
  const handleTogglePeriod = useCallback((targetPeriod: TPeriod) => {
    setPeriod(targetPeriod);
  }, []);

  // 4. 완료 확정
  const handleConfirm = useCallback(() => {
    onConfirm(currentTime24);
    onClose();
  }, [currentTime24, onConfirm, onClose]);

  return (
    <BaseModal
      visible={visible}
      onBackPress={onClose}
      onBackdropPress={onClose}
      overlayStyle={styles.overlay}
      contentStyle={styles.modalContent}
    >
      {/* 상단 헤더 */}
      <TimePickerModalHeader onClose={onClose} />

      {/* 1. 빠른 식사/시간대 프리셋 칩 */}
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
              onPress={() => handleSelectPreset(preset.time)}
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

      {/* 2. 중앙 시간 디스플레이 및 오전/오후 토글 */}
      <View style={styles.displayCard}>
        <View style={styles.periodToggleContainer}>
          <TouchableOpacity
            style={[
              styles.periodTab,
              period === '오전' && styles.periodTabActive,
            ]}
            onPress={() => handleTogglePeriod('오전')}
            activeOpacity={0.7}
          >
            <BaseText
              size={13}
              weight="bold"
              style={[
                styles.periodTabText,
                period === '오전' && styles.periodTabTextActive,
              ]}
            >
              오전
            </BaseText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodTab,
              period === '오후' && styles.periodTabActive,
            ]}
            onPress={() => handleTogglePeriod('오후')}
            activeOpacity={0.7}
          >
            <BaseText
              size={13}
              weight="bold"
              style={[
                styles.periodTabText,
                period === '오후' && styles.periodTabTextActive,
              ]}
            >
              오후
            </BaseText>
          </TouchableOpacity>
        </View>

        <View style={styles.timeRow}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => hourInputRef.current?.focus()}
            style={[
              styles.timeBox,
              activeField === 'hour' && styles.timeBoxActive,
            ]}
          >
            <TextInput
              ref={hourInputRef}
              value={hour}
              onChangeText={handleHourChange}
              onFocus={() => setActiveField('hour')}
              onBlur={handleHourBlur}
              keyboardType="number-pad"
              inputMode="numeric"
              maxLength={2}
              selectTextOnFocus
              style={styles.timeInput}
            />
            <BaseText size={11} weight="medium" style={styles.timeUnit}>
              시
            </BaseText>
          </TouchableOpacity>

          <BaseText size={28} weight="bold" style={styles.colonText}>
            :
          </BaseText>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => minuteInputRef.current?.focus()}
            style={[
              styles.timeBox,
              activeField === 'minute' && styles.timeBoxActive,
            ]}
          >
            <TextInput
              ref={minuteInputRef}
              value={minute}
              onChangeText={handleMinuteChange}
              onFocus={() => setActiveField('minute')}
              onBlur={handleMinuteBlur}
              keyboardType="number-pad"
              inputMode="numeric"
              maxLength={2}
              selectTextOnFocus
              style={styles.timeInput}
            />
            <BaseText size={11} weight="medium" style={styles.timeUnit}>
              분
            </BaseText>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. 빠른 미세 조절 버튼 (Quick Adjust) */}
      <BaseText size={15} weight="bold" style={styles.sectionLabel}>
        빠른 시간 조절
      </BaseText>

      <View style={styles.adjustContainer}>
        <TouchableOpacity
          style={styles.adjustBtn}
          onPress={() => handleAdjustMinutes(-60)}
          activeOpacity={0.6}
        >
          <BaseText size={15} weight="bold" style={styles.adjustBtnText}>
            -1시간
          </BaseText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.adjustBtn}
          onPress={() => handleAdjustMinutes(60)}
          activeOpacity={0.6}
        >
          <BaseText size={15} weight="bold" style={styles.adjustBtnText}>
            +1시간
          </BaseText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.adjustBtn}
          onPress={() => handleAdjustMinutes(-10)}
          activeOpacity={0.6}
        >
          <BaseText size={15} weight="bold" style={styles.adjustBtnText}>
            -10분
          </BaseText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.adjustBtn}
          onPress={() => handleAdjustMinutes(10)}
          activeOpacity={0.6}
        >
          <BaseText size={15} weight="bold" style={styles.adjustBtnText}>
            +10분
          </BaseText>
        </TouchableOpacity>
      </View>

      {/* 4. 하단 액션 버튼 */}
      <TimePickerModalFooter onClose={onClose} onConfirm={handleConfirm} />
    </BaseModal>
  );
};
