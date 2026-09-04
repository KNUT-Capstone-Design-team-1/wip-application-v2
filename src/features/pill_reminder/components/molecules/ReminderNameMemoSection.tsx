import React, { memo } from 'react';
import { View, TextInput } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR_TEXT } from '@constants/color';
import {
  sanitizeReminderTitle,
  sanitizeReminderMemo,
} from '@features/pill_reminder/utils/reminder_validation';
import { styles } from '@features/pill_reminder/styles/molecules/ReminderNameMemoSection';

interface IReminderNameMemoSectionProps {
  title: string;
  onChangeTitle: (title: string) => void;
  memo: string;
  onChangeMemo: (memo: string) => void;
}

// 복용 알림 이름 및 메모 입력 섹션 컴포넌트
export const ReminderNameMemoSection = memo(
  ({
    title,
    onChangeTitle,
    memo,
    onChangeMemo,
  }: IReminderNameMemoSectionProps) => {
    // 이름 변경 핸들러 (최대 50자 및 안전 문자열 정제)
    const handleTitleChange = (text: string) => {
      const sanitized = sanitizeReminderTitle(text);
      onChangeTitle(sanitized);
    };

    // 메모 변경 핸들러 (최대 255자 및 안전 문자열 정제)
    const handleMemoChange = (text: string) => {
      const sanitized = sanitizeReminderMemo(text);
      onChangeMemo(sanitized);
    };

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <BaseText size={20} weight="bold" style={styles.sectionTitle}>
            알림 정보
          </BaseText>
        </View>

        {/* 1. 알림 이름 입력창 (최대 50자, 미입력 시 '알림1' 자동 지정) */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <BaseText size={14} weight="semiBold" style={styles.label}>
              알림 이름
            </BaseText>
            <BaseText size={12} weight="medium" style={styles.counterText}>
              {title.length}/50
            </BaseText>
          </View>

          <TextInput
            value={title}
            onChangeText={handleTitleChange}
            placeholder="미입력 시 자동으로 이름이 지정됩니다"
            placeholderTextColor={COLOR_TEXT.disabled}
            maxLength={50}
            style={styles.textInput}
          />
        </View>

        {/* 2. 메모 입력창 (최대 255자, 선택 입력) */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <BaseText size={14} weight="semiBold" style={styles.label}>
              메모 (선택)
            </BaseText>
            <BaseText size={12} weight="medium" style={styles.counterText}>
              {memo.length}/255
            </BaseText>
          </View>

          <TextInput
            value={memo}
            onChangeText={handleMemoChange}
            placeholder="복용 시 주의사항 등 메모를 입력하세요"
            placeholderTextColor={COLOR_TEXT.disabled}
            multiline={true}
            numberOfLines={3}
            maxLength={255}
            style={styles.memoInput}
          />
        </View>
      </View>
    );
  },
);

ReminderNameMemoSection.displayName = 'ReminderNameMemoSection';
