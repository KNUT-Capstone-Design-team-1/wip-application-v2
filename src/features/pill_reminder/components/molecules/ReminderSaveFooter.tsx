import React, { memo } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BaseText } from '@components/common/BaseText';
import { COLOR } from '@constants/color';
import { px } from '@utils/responsive';
import { styles } from '@features/pill_reminder/styles/molecules/ReminderSaveFooter';

interface IReminderSaveFooterProps {
  isEditMode: boolean;
  isFormValid: boolean;
  saving: boolean;
  onSave: () => void;
}

// 복용 알림 저장 하단 고정 푸터 컴포넌트
export const ReminderSaveFooter = memo(
  ({ isEditMode, isFormValid, saving, onSave }: IReminderSaveFooterProps) => {
    const insets = useSafeAreaInsets();

    return (
      <View
        style={[
          styles.footerContainer,
          { paddingBottom: Math.max(insets.bottom, px(16)) },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.saveButton,
            !isFormValid && styles.disabledButton,
            saving && { opacity: 0.7 },
          ]}
          onPress={onSave}
          disabled={saving}
          activeOpacity={0.7}
        >
          {saving ? (
            <ActivityIndicator size="small" color={COLOR.white} />
          ) : (
            <BaseText
              size={18}
              weight="bold"
              style={!isFormValid ? styles.disabledText : styles.saveText}
            >
              {isEditMode ? '수정 완료' : '알림 설정하기'}
            </BaseText>
          )}
        </TouchableOpacity>
      </View>
    );
  },
);

ReminderSaveFooter.displayName = 'ReminderSaveFooter';
