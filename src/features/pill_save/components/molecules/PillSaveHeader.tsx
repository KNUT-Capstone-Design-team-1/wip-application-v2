import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { Plus, ListFilter, Bell } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { styles } from '@features/pill_save/styles/molecules/PillSaveHeader';
import { router } from 'expo-router';

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
    // 복용 알림 목록 화면으로 이동
    const handleReminder = () => {
      router.push('/pill-reminder');
    };

    return (
      <View style={styles.header}>
        <BaseText size={14} weight="semiBold" style={styles.countText}>
          전체 폴더 {folderCount}개
        </BaseText>
        {!isEditing && (
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={handleReminder}>
              <Bell size={fontPx(20)} color={COLOR_TEXT.sub} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onSortRequest}>
              <ListFilter size={fontPx(20)} color={COLOR_TEXT.sub} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onAddRequest}>
              <Plus size={fontPx(20)} color={COLOR_TEXT.sub} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  },
);

PillSaveHeader.displayName = 'PillSaveHeader';
