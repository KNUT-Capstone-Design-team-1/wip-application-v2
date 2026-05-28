import React, { memo } from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import { styles } from '../../styles/atoms/IconButton';
import { COLOR_PRIMARY } from '@constants/color';

interface IIConButtonProps {
  isSelected: boolean;
  iconUrl?: ImageSourcePropType;
  iconColor?: string;
  label: string;
}

const IconButton = memo(
  ({ isSelected, iconUrl, iconColor, label }: IIConButtonProps) => {
    // iconUrl이 실제 값이 있는지 체크 (TS2367 에러를 피하기 위해 any로 캐스팅하여 비교)
    const hasIcon = !!iconUrl && (iconUrl as any) !== '';

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
            !hasIcon &&
              iconColor && {
                backgroundColor: iconColor,
              },
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
              isSelected && { color: COLOR_PRIMARY[400], fontWeight: 700 },
            ]}
          >
            {label}
          </Text>
        </View>
      </View>
    );
  },
);

IconButton.displayName = 'IconButton';

export default IconButton;
