import React, { useState, useEffect } from 'react';
import {
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import { TimePickerModalHeader } from '@features/pill_reminder/components/molecules/TimePickerModalHeader';
import { TimePickerModalFooter } from '@features/pill_reminder/components/molecules/TimePickerModalFooter';
import { TimePickerDisplay } from '@features/pill_reminder/components/atoms/TimePickerDisplay';
import { TimePickerColumn } from '@features/pill_reminder/components/atoms/TimePickerColumn';
import {
  PERIODS,
  HOURS_12,
  MINUTES,
  DEFAULT_PERIOD,
  DEFAULT_HOUR,
  DEFAULT_MINUTE,
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

// 복용 시간 선택 모달 메인 컴포넌트 (오전/오후 12시간제 지원)
export const TimePickerModal = ({
  visible,
  onClose,
  onConfirm,
  initialTime = '08:00',
}: ITimePickerModalProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TPeriod>(DEFAULT_PERIOD);
  const [selectedHour, setSelectedHour] = useState(DEFAULT_HOUR);
  const [selectedMinute, setSelectedMinute] = useState(DEFAULT_MINUTE);

  // 모달 열릴 때 초기 시간 설정 (24시간제 ➔ 12시간제 변환)
  useEffect(() => {
    const shouldSkipInit = !visible || !initialTime;

    if (shouldSkipInit) {
      return;
    }

    const { period, hour, minute } = parse24To12(initialTime);
    setSelectedPeriod(period);
    setSelectedHour(hour);
    setSelectedMinute(minute);
  }, [visible, initialTime]);

  // 시간 확정 핸들러 (12시간제 ➔ 24시간제 변환 후 상위 전달)
  const handleConfirm = () => {
    const finalHour = (selectedHour || DEFAULT_HOUR).padStart(2, '0');
    const finalMinute = (selectedMinute || DEFAULT_MINUTE).padStart(2, '0');
    const time24 = format12To24(selectedPeriod, finalHour, finalMinute);

    onConfirm(time24);
    onClose();
  };

  // 모달이 닫혀 있으면 렌더링 생략
  const isHidden = !visible;

  if (isHidden) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingView}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* 상단 헤더 */}
            <TimePickerModalHeader onClose={onClose} />

            {/* 시간/분 직접 숫자 입력 디스플레이 영역 */}
            <TimePickerDisplay
              hour={selectedHour}
              minute={selectedMinute}
              onHourChange={setSelectedHour}
              onMinuteChange={setSelectedMinute}
            />

            {/* 오전/오후, 시, 분 3개 스크롤 피커 컬럼 (1:1 스냅 일치) */}
            <View style={styles.pickersContainer}>
              <TimePickerColumn
                label="구분"
                unit=""
                data={PERIODS as unknown as string[]}
                selectedValue={selectedPeriod}
                onSelect={(val) => setSelectedPeriod(val as TPeriod)}
              />

              <View style={styles.columnSeparator} />

              <TimePickerColumn
                label="시"
                unit="시"
                data={HOURS_12}
                selectedValue={selectedHour.padStart(2, '0')}
                onSelect={setSelectedHour}
              />

              <View style={styles.columnSeparator} />

              <TimePickerColumn
                label="분"
                unit="분"
                data={MINUTES}
                selectedValue={selectedMinute.padStart(2, '0')}
                onSelect={setSelectedMinute}
              />
            </View>

            {/* 하단 푸터 버튼 */}
            <TimePickerModalFooter
              onClose={onClose}
              onConfirm={handleConfirm}
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};
