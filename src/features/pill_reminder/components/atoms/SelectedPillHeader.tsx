import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { Pencil } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { styles } from '@features/pill_reminder/styles/atoms/SelectedPillHeader';

interface ISelectedPillHeaderProps {
  count: number;
  folderName?: string;
  onOpenSelectModal: () => void;
}

// 선택한 알약 개수 및 폴더명 표시, 우측 편집 아이콘 헤더 컴포넌트
export const SelectedPillHeader = memo(
  ({ count, folderName, onOpenSelectModal }: ISelectedPillHeaderProps) => {
    return (
      <View style={styles.sectionHeader}>
        <View style={styles.titleContainer}>
          <BaseText size={16} weight="bold" style={styles.sectionTitle}>
            선택한 알약 ({count})
          </BaseText>
          {!!folderName && (
            <View style={styles.folderBadge}>
              <BaseText
                size={12}
                weight="semiBold"
                style={styles.folderBadgeText}
              >
                {folderName}
              </BaseText>
            </View>
          )}
        </View>

        {/* 선택한 알약이 있을 때 우측 상단 편집 아이콘 버튼 노출 */}
        {count > 0 && (
          <TouchableOpacity
            style={styles.editBtn}
            onPress={onOpenSelectModal}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Pencil size={fontPx(16)} color={COLOR_TEXT.sub} />
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

SelectedPillHeader.displayName = 'SelectedPillHeader';
