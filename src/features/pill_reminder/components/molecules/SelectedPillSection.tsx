import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { Plus } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { ISelectedPillItem } from '@features/pill_reminder/hooks/use_pill_reminder_setting_form';
import { SelectedPillHeader } from '@features/pill_reminder/components/atoms/SelectedPillHeader';
import { SelectedPillItem } from '@features/pill_reminder/components/atoms/SelectedPillItem';
import { styles } from '@features/pill_reminder/styles/molecules/SelectedPillSection';

interface ISelectedPillSectionProps {
  selectedPills: ISelectedPillItem[];
  folderName?: string;
  onOpenSelectModal: () => void;
  onRemovePill: (itemSeq: string) => void;
}

// 선택한 알약 목록 및 알약 추가 섹션 컴포넌트
export const SelectedPillSection = memo(
  ({
    selectedPills,
    folderName,
    onOpenSelectModal,
    onRemovePill,
  }: ISelectedPillSectionProps) => {
    return (
      <View style={styles.sectionCard}>
        <SelectedPillHeader
          count={selectedPills.length}
          folderName={folderName}
          onOpenSelectModal={onOpenSelectModal}
        />

        {selectedPills.length === 0 ? (
          <TouchableOpacity
            style={styles.addPillCenterBtn}
            onPress={onOpenSelectModal}
            activeOpacity={0.7}
          >
            <Plus size={fontPx(22)} color={COLOR_TEXT.subTitle} />
            <BaseText
              size={14}
              weight="semiBold"
              style={styles.addPillCenterText}
            >
              알약 선택하기
            </BaseText>
          </TouchableOpacity>
        ) : (
          <View style={styles.selectedPillsList}>
            {selectedPills.map((pill) => (
              <SelectedPillItem
                key={pill.item_seq}
                pill={pill}
                onRemove={onRemovePill}
              />
            ))}
          </View>
        )}
      </View>
    );
  },
);

SelectedPillSection.displayName = 'SelectedPillSection';
