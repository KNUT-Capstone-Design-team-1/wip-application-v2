import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BaseText } from '@components/common/BaseText';
import { Plus } from 'lucide-react-native';
import { COLOR } from '@constants/color';
import { fontPx, px } from '@utils/responsive';
import { styles } from '@features/pill_reminder/styles/molecules/ReminderListFooter';

interface IReminderListFooterProps {
  onCreateReminder: () => void;
}

// 복용 알림 목록 하단 추가 고정 버튼 컴포넌트
export const ReminderListFooter = memo(
  ({ onCreateReminder }: IReminderListFooterProps) => {
    const insets = useSafeAreaInsets();

    return (
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, px(16)) },
        ]}
      >
        <TouchableOpacity
          style={styles.addButton}
          onPress={onCreateReminder}
          activeOpacity={0.7}
        >
          <Plus size={fontPx(20)} color={COLOR.white} />
          <BaseText size={18} weight="bold" style={styles.addButtonText}>
            복용 알림 추가
          </BaseText>
        </TouchableOpacity>
      </View>
    );
  },
);

ReminderListFooter.displayName = 'ReminderListFooter';
