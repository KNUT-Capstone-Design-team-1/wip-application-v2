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
  HOURS,
  MINUTES,
  DEFAULT_HOUR,
  DEFAULT_MINUTE,
} from '@features/pill_reminder/constants/pill_reminder_constant';
import { styles } from '@features/pill_reminder/styles/molecules/TimePickerModal';

interface ITimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (timeStr: string) => void;
  initialTime?: string;
}

// 복용 시간 선택 모달 메인 컴포넌트
export const TimePickerModal = ({
  visible,
  onClose,
  onConfirm,
  initialTime = '08:00',
}: ITimePickerModalProps) => {
  const [selectedHour, setSelectedHour] = useState(DEFAULT_HOUR);
  const [selectedMinute, setSelectedMinute] = useState(DEFAULT_MINUTE);

  // 모달 열릴 때 초기 시간 설정
  useEffect(() => {
    const shouldSkipInit = !visible || !initialTime;

    if (shouldSkipInit) {
      return;
    }

    const [h, m] = initialTime.split(':');

    const hasHour = Boolean(h);
    if (hasHour) {
      setSelectedHour(h.padStart(2, '0'));
    }

    const hasMinute = Boolean(m);
    if (hasMinute) {
      setSelectedMinute(m.padStart(2, '0'));
    }
  }, [visible, initialTime]);

  // 시간 확정 핸들러
  const handleConfirm = () => {
    const finalHour = (selectedHour || DEFAULT_HOUR).padStart(2, '0');
    const finalMinute = (selectedMinute || DEFAULT_MINUTE).padStart(2, '0');

    onConfirm(`${finalHour}:${finalMinute}`);
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

            {/* 시간/분 직접 숫자 입력 및 디스플레이 영역 */}
            <TimePickerDisplay
              hour={selectedHour}
              minute={selectedMinute}
              onHourChange={setSelectedHour}
              onMinuteChange={setSelectedMinute}
            />

            {/* 시간/분 스크롤 피커 컬럼 (위상 일치 및 고성능 스냅) */}
            <View style={styles.pickersContainer}>
              <TimePickerColumn
                label="시"
                unit="시"
                data={HOURS as unknown as string[]}
                selectedValue={selectedHour.padStart(2, '0')}
                onSelect={setSelectedHour}
              />

              <View style={styles.columnSeparator} />

              <TimePickerColumn
                label="분"
                unit="분"
                data={MINUTES as unknown as string[]}
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
