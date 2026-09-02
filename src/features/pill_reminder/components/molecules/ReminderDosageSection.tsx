import React, { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { DosageCounter } from '@features/pill_reminder/components/atoms/DosageCounter';
import { ISelectedPillItem } from '@features/pill_reminder/hooks/use_pill_reminder_setting_form';
import { styles } from '@features/pill_reminder/styles/molecules/ReminderDosageSection';

interface IReminderDosageSectionProps {
  selectedPills: ISelectedPillItem[];
  onDosageChange: (seq: string, dosage: number) => void;
}

// 1회 복용량 설정 섹션 컴포넌트
export const ReminderDosageSection = memo(
  ({ selectedPills, onDosageChange }: IReminderDosageSectionProps) => {
    const hasNoPills = selectedPills.length === 0;

    if (hasNoPills) {
      return null;
    }

    return (
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <BaseText size={16} weight="bold" style={styles.sectionTitle}>
            1회 복용량 설정
          </BaseText>
        </View>

        <View style={styles.dosageList}>
          {selectedPills.map((pill) => (
            <View key={pill.item_seq} style={styles.dosageRow}>
              <BaseText
                size={15}
                weight="semiBold"
                style={styles.dosagePillName}
                numberOfLines={1}
              >
                {pill.item_name}
              </BaseText>

              <DosageCounter
                value={pill.dosage || 1}
                onChange={(newDosage) =>
                  onDosageChange(pill.item_seq, newDosage)
                }
              />
            </View>
          ))}
        </View>
      </View>
    );
  },
);

ReminderDosageSection.displayName = 'ReminderDosageSection';
