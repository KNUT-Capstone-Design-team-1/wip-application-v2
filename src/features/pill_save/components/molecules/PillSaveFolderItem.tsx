import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR, COLOR_TEXT } from '@constants/color';
import { CheckCircle2, Circle } from 'lucide-react-native';
import { FolderIconPreview } from '@features/pill_save/components/atoms/FolderIconPreview';
import { styles } from '@features/pill_save/styles/molecules/PillSaveFolderItem';

import { IPillSaveFolderItemProps } from '@features/pill_save/types/pill_save_type';

// 우측 아이콘 렌더링을 담당하는 서브 컴포넌트
const RightAccessory = memo(
  ({
    isDefault,
    isEditing,
    isSelected,
  }: {
    isDefault: boolean;
    isEditing?: boolean;
    isSelected?: boolean;
  }) => {
    if (!isEditing || isDefault) return null;

    return isSelected ? (
      <CheckCircle2 size={24} color={COLOR_TEXT.white} fill={COLOR.primary} />
    ) : (
      <Circle size={24} color={COLOR_TEXT.disabled} fill="#FFF" />
    );
  },
);

RightAccessory.displayName = 'RightAccessory';

// 폴더 목록 화면에서 보여지는 개별 폴더 리스트 아이템 컴포넌트
export const PillSaveFolderItem = memo(
  ({
    item,
    onPress,
    onLongPress,
    isEditing,
    isSelected,
  }: IPillSaveFolderItemProps) => {
    return (
      <TouchableOpacity
        style={styles.folderItemWrapper}
        activeOpacity={0.7}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        <FolderIconPreview images={item.preview_images} />

        <View style={styles.folderInfoContainer}>
          <BaseText
            size={18}
            weight="bold"
            style={[styles.folderName, isSelected && { color: COLOR.primary }]}
            numberOfLines={1}
          >
            {item.name}
          </BaseText>
          <View style={styles.separator} />
          <BaseText size={14} style={styles.folderCount}>
            총 {item.pill_count}개
          </BaseText>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <RightAccessory
            isDefault={!!item.is_default}
            isEditing={isEditing}
            isSelected={isSelected}
          />
        </View>
      </TouchableOpacity>
    );
  },
);

PillSaveFolderItem.displayName = 'PillSaveFolderItem';
