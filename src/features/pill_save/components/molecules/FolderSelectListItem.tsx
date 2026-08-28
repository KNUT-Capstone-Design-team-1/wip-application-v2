import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { Check } from 'lucide-react-native';
import { ISavedPillFolder } from '@services/database/types';
import { styles } from '@features/pill_save/styles/molecules/FolderSelectListItem';

// 폴더 선택 모달에서 사용하는 개별 폴더 리스트 아이템 컴포넌트
export const FolderSelectListItem = memo(
  ({
    item,
    isSelected,
    isCurrentLocation,
    onPress,
  }: {
    item: ISavedPillFolder & { pill_count: number };
    isSelected: boolean;
    isCurrentLocation?: boolean;
    onPress: () => void;
  }) => {
    // 상태에 따른 이름 스타일 결정
    const folderNameStyle = isCurrentLocation
      ? styles.folderNameDisabled
      : isSelected
        ? styles.folderNameSelected
        : styles.folderName;

    return (
      <TouchableOpacity
        style={[
          styles.folderItem,
          isSelected && styles.folderItemSelected,
          isCurrentLocation && styles.folderItemDisabled,
        ]}
        onPress={isCurrentLocation ? undefined : onPress}
        activeOpacity={isCurrentLocation ? 1 : 0.7}
      >
        <View style={[styles.folderInfo, styles.shrinkText]}>
          <BaseText
            size={18}
            weight={isSelected ? 'bold' : 'medium'}
            style={[folderNameStyle, styles.shrinkText]}
            numberOfLines={1}
          >
            {item.name} {isCurrentLocation && '(현재 폴더)'}
          </BaseText>

          <View style={styles.separator} />

          <BaseText size={14} style={styles.folderCount}>
            알약 {item.pill_count}개
          </BaseText>
        </View>

        {isSelected && <Check size={fontPx(20)} color={COLOR['primary']} />}
      </TouchableOpacity>
    );
  },
);

FolderSelectListItem.displayName = 'FolderSelectListItem';
