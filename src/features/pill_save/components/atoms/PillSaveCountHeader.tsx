import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR_TEXT } from '@constants/color';
import { styles } from '@features/pill_save/styles/PillSave';
import { styles as headerStyles } from '@features/pill_save/styles/molecules/PillSaveHeader';
import { px } from '@utils/responsive';

interface Props {
  count: number;
  isEditing?: boolean;
  onToggleEdit?: () => void;
  onSelectAll?: () => void;
  onMove?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
  allSelected?: boolean;
}

// 저장된 전체 알약 개수를 표시하는 헤더 컴포넌트
export const PillSaveCountHeader = ({
  count,
  isEditing = false,
  onToggleEdit,
  onSelectAll,
  onMove,
  onCopy,
  onDelete,
  allSelected = false,
}: Props) => (
  <View style={headerStyles.header}>
    <BaseText size={14} weight="semiBold" style={styles.countText}>
      총 {count}개
    </BaseText>

    <View style={{ flexDirection: 'row', gap: px(12) }}>
      {isEditing ? (
        <TouchableOpacity onPress={onSelectAll}>
          <BaseText
            size={14}
            weight="medium"
            style={{ color: COLOR_TEXT.title }}
          >
            {allSelected ? '전체해제' : '전체선택'}
          </BaseText>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onToggleEdit}>
          <BaseText
            size={14}
            weight="medium"
            style={{ color: COLOR_TEXT.title }}
          >
            편집
          </BaseText>
        </TouchableOpacity>
      )}
    </View>
  </View>
);
