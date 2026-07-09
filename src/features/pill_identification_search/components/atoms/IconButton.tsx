import React, { memo } from 'react';
import { Image } from '@components/common/CustomImage';
import { View, ImageSourcePropType } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../../styles/atoms/IconButton';
import { COLOR, COLOR_TEXT } from '@constants/color';

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
          isSelected && { borderColor: COLOR['primary'], borderWidth: 2 },
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
            <Image source={iconUrl} style={styles.icon} contentFit="contain" />
          )}
        </View>
        <View style={styles.iconButtonBottom}>
          <BaseText
            style={[
              styles.iconSectionLabel,
              isSelected && { color: COLOR_TEXT['title'] },
            ]}
            size={13}
            weight={isSelected ? 'bold' : 'medium'}
          >
            {label}
          </BaseText>
        </View>
      </View>
    );
  },
);

IconButton.displayName = 'IconButton';

export default IconButton;
