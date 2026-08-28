import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { Plus } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { styles } from '@features/pill_save/styles/molecules/PillSaveHeader';

interface IPillSaveHeaderProps {
  isEditing: boolean;
  folderCount: number;
  onCancelEdit: () => void;
  onRenameRequest: () => void;
  onDeleteRequest: () => void;
  onAddRequest: () => void;
}

// 보관함(폴더 목록) 화면의 최상단 헤더 컴포넌트
export const PillSaveHeader = ({
  isEditing,
  folderCount,
  onCancelEdit,
  onRenameRequest,
  onDeleteRequest,
  onAddRequest,
}: IPillSaveHeaderProps) => {
  if (isEditing) {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancelEdit}>
          <BaseText size={16} weight="bold" style={styles.textBlack}>
            취소
          </BaseText>
        </TouchableOpacity>
        <View style={styles.actionContainer}>
          <TouchableOpacity onPress={onRenameRequest}>
            <BaseText size={16} weight="bold" style={styles.textBlack}>
              이름 변경
            </BaseText>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDeleteRequest}>
            <BaseText size={16} weight="bold" style={styles.textBlack}>
              삭제
            </BaseText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <BaseText size={14} weight="semiBold" style={styles.countText}>
        전체 폴더 {folderCount}개
      </BaseText>
      <TouchableOpacity onPress={onAddRequest}>
        <Plus size={fontPx(24)} color={COLOR_TEXT.title} />
      </TouchableOpacity>
    </View>
  );
};
