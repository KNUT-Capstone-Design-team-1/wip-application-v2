import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { Plus, ListFilter } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx, px } from '@utils/responsive';
import { styles } from '@features/pill_save/styles/molecules/PillSaveHeader';

interface IPillSaveHeaderProps {
  isEditing: boolean;
  folderCount: number;
  onAddRequest: () => void;
  onSortRequest: () => void;
}

// 보관함(폴더 목록) 화면의 최상단 헤더 컴포넌트
export const PillSaveHeader = memo(
  ({
    isEditing,
    folderCount,
    onAddRequest,
    onSortRequest,
  }: IPillSaveHeaderProps) => {
    return (
      <View style={styles.header}>
        <BaseText size={14} weight="semiBold" style={styles.countText}>
          전체 폴더 {folderCount}개
        </BaseText>
        {!isEditing && (
          <View
            style={{ flexDirection: 'row', alignItems: 'center', gap: px(16) }}
          >
            <TouchableOpacity onPress={onSortRequest}>
              <ListFilter size={fontPx(24)} color={COLOR_TEXT.title} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onAddRequest}>
              <Plus size={fontPx(24)} color={COLOR_TEXT.title} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  },
);

PillSaveHeader.displayName = 'PillSaveHeader';
