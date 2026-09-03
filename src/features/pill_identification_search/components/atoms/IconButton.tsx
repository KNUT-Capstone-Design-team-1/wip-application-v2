import React, { memo } from 'react';
import { Image } from '@components/common/CustomImage';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../../styles/atoms/IconButton';
import { COLOR, COLOR_TEXT } from '@constants/color';
import { IIconButtonProps } from '@features/pill_identification_search/types';

// 식별 검색 아이콘 버튼 컴포넌트 (Atom)
const IconButton = memo(
  ({ isSelected, iconUrl, iconColor, label }: IIconButtonProps) => {
    // iconUrl 유효성 검사
    const hasIcon = Boolean(iconUrl) && (iconUrl as any) !== '';

    return (
      <View
        style={[
          styles.iconButtonWrapper,
          isSelected && { borderColor: COLOR['primary'], borderWidth: 2 },
        ]}
      >
        {/* iconUrl이 있으면 이미지, 없으면 단색 배경 */}
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
