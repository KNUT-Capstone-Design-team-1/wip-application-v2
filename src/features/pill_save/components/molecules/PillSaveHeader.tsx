import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import {
  Plus,
  ListFilter,
  Bell,
  CircleQuestionMark,
} from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { styles } from '@features/pill_save/styles/molecules/PillSaveHeader';
import { router } from 'expo-router';
import { GuideTarget } from '@features/guide';

interface IPillSaveHeaderProps {
  isEditing: boolean;
  folderCount: number;
  onAddRequest: () => void;
  onSortRequest: () => void;
  onGuideRequest: () => void;
}

// 보관함(폴더 목록) 화면의 최상단 헤더 컴포넌트
export const PillSaveHeader = memo(
  ({
    isEditing,
    folderCount,
    onAddRequest,
    onSortRequest,
    onGuideRequest,
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
            <TouchableOpacity onPress={onGuideRequest}>
              <CircleQuestionMark size={fontPx(20)} color={COLOR_TEXT.sub} />
            </TouchableOpacity>
            <GuideTarget id="save.reminder">
              <TouchableOpacity onPress={handleReminder}>
                <Bell size={fontPx(20)} color={COLOR_TEXT.sub} />
              </TouchableOpacity>
            </GuideTarget>
            <TouchableOpacity onPress={onSortRequest}>
              <ListFilter size={fontPx(20)} color={COLOR_TEXT.sub} />
            </TouchableOpacity>
            <GuideTarget id="save.add">
              <TouchableOpacity onPress={onAddRequest}>
                <Plus size={fontPx(20)} color={COLOR_TEXT.sub} />
              </TouchableOpacity>
            </GuideTarget>
          </View>
        )}
      </View>
    );
  },
);

PillSaveHeader.displayName = 'PillSaveHeader';
