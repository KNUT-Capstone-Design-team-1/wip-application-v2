import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/pill_reminder/styles/atoms/SelectedPillHeader';

interface ISelectedPillHeaderProps {
  count: number;
  folderName?: string;
  onPressFolder?: () => void;
}

// 선택한 알약 개수 및 폴더명 표시 헤더 컴포넌트
export const SelectedPillHeader = memo(
  ({ count, folderName, onPressFolder }: ISelectedPillHeaderProps) => {
    const hasFolderPress = Boolean(onPressFolder);

    return (
      <View style={styles.sectionHeader}>
        <View style={styles.titleContainer}>
          <BaseText size={20} weight="bold" style={styles.sectionTitle}>
            선택한 알약 ({count})
          </BaseText>

          {!!folderName && (
            <TouchableOpacity
              style={styles.folderBadge}
              onPress={onPressFolder}
              disabled={!hasFolderPress}
              activeOpacity={0.7}
            >
              <BaseText
                size={13}
                weight="semiBold"
                style={styles.folderBadgeText}
              >
                폴더: {folderName}
              </BaseText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  },
);

SelectedPillHeader.displayName = 'SelectedPillHeader';
