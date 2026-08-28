import React, { memo } from 'react';
import { TouchableOpacity, StyleProp, TextStyle } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/nearby_pharmacy/styles/PharmacyInfoCard';

interface IPharmacyInfoRowProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  weight: 'bold' | 'semiBold' | 'medium' | 'regular';
  size: number;
  textStyle?: StyleProp<TextStyle>;
  rightElement?: React.ReactNode;
}

// 정보 카드의 개별 텍스트 줄 (클릭 시 액션 처리)
const PharmacyInfoRow = ({
  text,
  onPress,
  disabled,
  weight,
  size,
  textStyle,
  rightElement,
}: IPharmacyInfoRowProps) => {
  return (
    <TouchableOpacity
      style={styles.copyButton}
      disabled={disabled}
      onPress={onPress}
    >
      <BaseText weight={weight} size={size} style={textStyle}>
        {text}
      </BaseText>
      {rightElement}
    </TouchableOpacity>
  );
};

export default memo(PharmacyInfoRow);
