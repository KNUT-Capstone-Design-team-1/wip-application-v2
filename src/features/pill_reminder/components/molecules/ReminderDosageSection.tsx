import React, { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { ISelectedPillItem } from '@features/pill_reminder/hooks/use_pill_reminder_setting_form';
import { DosageCounter } from '@features/pill_reminder/components/atoms/DosageCounter';
import { styles } from '@features/pill_reminder/styles/molecules/ReminderDosageSection';

interface IReminderDosageSectionProps {
  selectedPills: ISelectedPillItem[];
  onDosageChange: (itemSeq: string, dosage: number) => void;
}

// 알약별 1회 복용량 조절 섹션 컴포넌트
export const ReminderDosageSection = memo(
  ({ selectedPills, onDosageChange }: IReminderDosageSectionProps) => {
    // 선택된 알약이 없으면 섹션 숨김
    const hasNoPills = selectedPills.length === 0;

    if (hasNoPills) {
      return null;
    }

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <BaseText size={20} weight="bold" style={styles.sectionTitle}>
            1회 복용량 설정
          </BaseText>
        </View>

        <View style={styles.dosageList}>
          {selectedPills.map((pill) => (
            <View key={pill.item_seq} style={styles.dosageRow}>
              <BaseText
                size={15}
                weight="medium"
                numberOfLines={1}
                style={styles.dosagePillName}
              >
                {pill.item_name}
              </BaseText>

              <DosageCounter
                value={pill.dosage}
                onChange={(dosage) => onDosageChange(pill.item_seq, dosage)}
              />
            </View>
          ))}
        </View>
      </View>
    );
  },
);

ReminderDosageSection.displayName = 'ReminderDosageSection';
