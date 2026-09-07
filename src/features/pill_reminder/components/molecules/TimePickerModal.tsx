import React, { useRef, useCallback } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import BaseModal from '@components/common/BaseModal';
import { BaseText } from '@components/common/BaseText';
import { TimePickerModalHeader } from '@features/pill_reminder/components/molecules/TimePickerModalHeader';
import { TimePickerModalFooter } from '@features/pill_reminder/components/molecules/TimePickerModalFooter';
import { TimePickerPresetSection } from '@features/pill_reminder/components/atoms/TimePickerPresetSection';
import { TimePickerColumn } from '@features/pill_reminder/components/atoms/TimePickerColumn';
import { useTimePickerState } from '@features/pill_reminder/hooks/use_time_picker_state';
import { styles } from '@features/pill_reminder/styles/molecules/TimePickerModal';

interface ITimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (timeStr: string) => void;
  initialTime?: string;
}

const HOUR_ADJUST_BUTTONS = [
  { label: '-1시간', offset: -1 },
  { label: '+1시간', offset: 1 },
];

const MINUTE_ADJUST_BUTTONS = [
  { label: '-10분', offset: -10 },
  { label: '+10분', offset: 10 },
  { label: '-1분', offset: -1 },
  { label: '+1분', offset: 1 },
];

// 복용 시간 스마트 선택 모달 (단일 책임 분리 및 가독성 최적화)
export const TimePickerModal = ({
  visible,
  onClose,
  onConfirm,
  initialTime = '08:00',
}: ITimePickerModalProps) => {
  const hourInputRef = useRef<TextInput>(null);
  const minuteInputRef = useRef<TextInput>(null);

  const {
    period,
    hour,
    minute,
    activeField,
    currentTime24,
    setActiveField,
    handleHourChange,
    handleHourBlur,
    handleMinuteChange,
    handleMinuteBlur,
    handleSelectPreset,
    handleAdjustHour,
    handleAdjustMinute,
    handleTogglePeriod,
  } = useTimePickerState({ visible, initialTime });

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
      <TimePickerPresetSection
        currentTime24={currentTime24}
        onSelectPreset={handleSelectPreset}
      />

      {/* 2. 중앙 시간 디스플레이 및 시/분 전용 조절 컨트롤 */}
      <View style={styles.displayCard}>
        {/* 오전/오후 토글 */}
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

        {/* 시/분 분리 컬럼 */}
        <View style={styles.timeColumnsContainer}>
          <TimePickerColumn
            unitLabel="시"
            value={hour}
            isActive={activeField === 'hour'}
            inputRef={hourInputRef}
            onFocus={() => setActiveField('hour')}
            onChangeText={handleHourChange}
            onBlur={handleHourBlur}
            adjustButtons={HOUR_ADJUST_BUTTONS}
            onAdjust={handleAdjustHour}
          />

          <BaseText size={32} weight="bold" style={styles.colonText}>
            :
          </BaseText>

          <TimePickerColumn
            unitLabel="분"
            value={minute}
            isActive={activeField === 'minute'}
            inputRef={minuteInputRef}
            onFocus={() => setActiveField('minute')}
            onChangeText={handleMinuteChange}
            onBlur={handleMinuteBlur}
            adjustButtons={MINUTE_ADJUST_BUTTONS}
            onAdjust={handleAdjustMinute}
          />
        </View>
      </View>

      {/* 3. 하단 완료/취소 버튼 */}
      <TimePickerModalFooter onClose={onClose} onConfirm={handleConfirm} />
    </BaseModal>
  );
};
