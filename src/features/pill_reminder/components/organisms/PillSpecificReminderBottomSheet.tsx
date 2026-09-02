import React from 'react';
import { View, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { Bell } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { SpecificReminderHeader } from '@features/pill_reminder/components/molecules/SpecificReminderHeader';
import { SpecificReminderCard } from '@features/pill_reminder/components/molecules/SpecificReminderCard';
import { SpecificReminderFooter } from '@features/pill_reminder/components/molecules/SpecificReminderFooter';
import { useSpecificReminders } from '@features/pill_reminder/hooks/use_specific_reminders';
import { styles } from '@features/pill_reminder/styles/organisms/PillSpecificReminderBottomSheet';

interface IPillSpecificReminderBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  itemSeq: string;
  itemName: string;
}

// 특정 알약이 포함된 복용 알림 바텀시트 메인 컴포넌트
export const PillSpecificReminderBottomSheet = ({
  visible,
  onClose,
  itemSeq,
  itemName,
}: IPillSpecificReminderBottomSheetProps) => {
  const { reminders, handleSelectReminder, handleAddReminder } =
    useSpecificReminders(visible, itemSeq, onClose);

  // 닫혀 있으면 렌더링 생략
  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.bottomSheet} onStartShouldSetResponder={() => true}>
          {/* 헤더 & 드래그 바 */}
          <SpecificReminderHeader itemName={itemName} onClose={onClose} />

          {/* 알림 목록 스크롤 영역 */}
          <ScrollView
            style={styles.scrollList}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {reminders.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Bell size={fontPx(32)} color={COLOR_TEXT.disabled} />
                <BaseText size={15} style={styles.emptyText}>
                  설정된 복용 알림이 없습니다.
                </BaseText>
              </View>
            ) : (
              reminders.map((reminder) => (
                <SpecificReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  itemSeq={itemSeq}
                  itemName={itemName}
                  onPress={handleSelectReminder}
                />
              ))
            )}
          </ScrollView>

          {/* 하단 고정 액션 버튼 푸터 */}
          <SpecificReminderFooter onAdd={handleAddReminder} onClose={onClose} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
