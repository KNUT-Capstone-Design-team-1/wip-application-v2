import React, { memo } from 'react';
import { ScrollView, View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { PillSelectListItem } from '@features/pill_reminder/components/atoms/PillSelectListItem';
import { IPillSelectOption } from '@features/pill_reminder/hooks/use_pill_reminder_select_modal';
import { styles } from '@features/pill_reminder/styles/molecules/PillReminderSelectList';

interface IPillReminderSelectListProps {
  folderPills: IPillSelectOption[];
  tempSelectedSeqs: string[];
  onToggleSelect: (seq: string) => void;
}

// 알약 선택 모달의 알약 스크롤 목록 컴포넌트
export const PillReminderSelectList = memo(
  ({
    folderPills,
    tempSelectedSeqs,
    onToggleSelect,
  }: IPillReminderSelectListProps) => {
    const hasNoPills = folderPills.length === 0;

    if (hasNoPills) {
      return (
        <ScrollView
          style={styles.scrollList}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.emptyContainer}>
            <BaseText size={14} style={styles.emptyText}>
              이 폴더에 저장된 알약이 없습니다.
            </BaseText>
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView
        style={styles.scrollList}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {folderPills.map((pill) => {
          const isSelected = tempSelectedSeqs.includes(pill.item_seq);

          return (
            <PillSelectListItem
              key={pill.item_seq}
              pill={pill}
              isSelected={isSelected}
              onToggle={onToggleSelect}
            />
          );
        })}
      </ScrollView>
    );
  },
);

PillReminderSelectList.displayName = 'PillReminderSelectList';
