import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR } from '@constants/color';
import { styles } from '@features/pill_save/styles/atoms/SaveActionBtn';

// 하단 저장하기 액션 버튼 컴포넌트
export const SaveActionBtn = ({
  isSaving,
  onPress,
}: {
  isSaving: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.saveBtn, isSaving && { opacity: 0.7 }]}
    onPress={onPress}
    disabled={isSaving}
  >
    {isSaving ? (
      <ActivityIndicator color={COLOR['white']} />
    ) : (
      <BaseText size={16} weight="bold" style={styles.saveBtnText}>
        저장하기
      </BaseText>
    )}
  </TouchableOpacity>
);
