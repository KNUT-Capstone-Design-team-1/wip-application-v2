import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../styles/BottomSheet';
import { px } from '@utils/responsive';

interface IBottomSheetControlProps {
  bottomInset: number;
  onNeverShowAgain: () => void;
  onClose: () => void;
}

const BottomSheetControl = ({
  bottomInset,
  onNeverShowAgain,
  onClose,
}: IBottomSheetControlProps) => {
  return (
    <View
      style={[
        styles.bottomSheetControl,
        { paddingBottom: Math.max(bottomInset, px(12)) },
      ]}
    >
      <TouchableOpacity onPress={onNeverShowAgain}>
        <BaseText size={14} weight="medium" style={styles.sheetCloseTodayText}>
          하루 동안 보지 않기
        </BaseText>
      </TouchableOpacity>
      <TouchableOpacity onPress={onClose}>
        <BaseText size={14} weight="medium" style={styles.sheetCloseButtonText}>
          닫기
        </BaseText>
      </TouchableOpacity>
    </View>
  );
};

export default memo(BottomSheetControl);
