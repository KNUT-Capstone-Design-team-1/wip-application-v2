import React from "react";
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import { styles } from '../../styles/atoms/IconButton';
import { COLOR_PRIMARY } from '@/src/constants';

interface IIConButtonProps {
  isSelected: boolean;
  iconUrl?: ImageSourcePropType;
  iconColor?: string;
  label: string;
}

const IconButton = ({
  isSelected,
  iconUrl,
  iconColor,
  label,
}: IIConButtonProps) => {
  // iconUrl이 빈 문자열이 아니고 실제 값이 있는지 체크
  const hasIcon = iconUrl && iconUrl !== '';

  // 흰색일 때 테두리 추가
  const isWhite =
    iconColor === '#fff' || iconColor === '#ffffff' || iconColor === 'white';

  return (
    <View
      style={[
        styles.iconButtonWrapper,
        isSelected && { borderColor: COLOR_PRIMARY[100], borderWidth: 2 },
      ]}
    >
      {/* iconUrl이 있으면 이미지, 없으면 색상으로 채우기 */}
      <View
        style={[
          styles.iconButtonTop,
          !hasIcon && iconColor && { backgroundColor: iconColor },
          !hasIcon && isWhite && { borderWidth: 1, borderColor: '#E0E0E0' },
        ]}
      >
        {hasIcon && (
          <Image source={iconUrl} style={styles.icon} resizeMode="contain" />
        )}
      </View>
      <View style={styles.iconButtonBottom}>
        <Text
          style={[
            styles.iconSectionLabel,
            isSelected && { color: COLOR_PRIMARY[400], fontWeight: 600, },
          ]}
        >
          {label}
        </Text>
      </View>
    </View>
  );
};

export default IconButton;
