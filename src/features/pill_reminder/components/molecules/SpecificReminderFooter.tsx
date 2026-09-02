import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BaseText } from '@components/common/BaseText';
import { Plus } from 'lucide-react-native';
import { COLOR } from '@constants/color';
import { fontPx, px } from '@utils/responsive';
import { styles } from '@features/pill_reminder/styles/molecules/SpecificReminderFooter';

interface ISpecificReminderFooterProps {
  onAdd: () => void;
  onClose: () => void;
}

// 특정 알약 복용 알림 바텀시트 하단 버튼 푸터 컴포넌트
export const SpecificReminderFooter = memo(
  ({ onAdd, onClose }: ISpecificReminderFooterProps) => {
    const insets = useSafeAreaInsets();

    return (
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, px(16)) },
        ]}
      >
        <TouchableOpacity
          style={styles.addBtn}
          onPress={onAdd}
          activeOpacity={0.7}
        >
          <Plus size={fontPx(18)} color={COLOR.white} />
          <BaseText size={16} weight="bold" style={styles.addBtnText}>
            알림 추가하기
          </BaseText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.closeBtn}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <BaseText size={16} weight="semiBold" style={styles.closeBtnText}>
            닫기
          </BaseText>
        </TouchableOpacity>
      </View>
    );
  },
);

SpecificReminderFooter.displayName = 'SpecificReminderFooter';
