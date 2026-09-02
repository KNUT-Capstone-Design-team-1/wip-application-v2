import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { px } from '@utils/responsive';
import { Image } from '@components/common/CustomImage';
import { SelectionRadioButton } from '@features/pill_save/components/atoms/SelectionRadioButton';
import { IPillSelectOption } from '@features/pill_reminder/components/organisms/PillReminderSelectModal';
import { styles } from '@features/pill_reminder/styles/atoms/PillSelectListItem';

interface IPillSelectListItemProps {
  pill: IPillSelectOption;
  isSelected: boolean;
  onToggle: (itemSeq: string) => void;
}

// 알약 선택 바텀시트 내 개별 알약 리스트 아이템 컴포넌트
export const PillSelectListItem = memo(
  ({ pill, isSelected, onToggle }: IPillSelectListItemProps) => {
    return (
      <TouchableOpacity
        style={[styles.pillItem, isSelected && styles.pillItemSelected]}
        onPress={() => onToggle(pill.item_seq)}
        activeOpacity={0.7}
      >
        <View style={styles.leftContainer}>
          {pill.item_image ? (
            <Image
              source={{ uri: pill.item_image }}
              contentFit="cover"
              style={[styles.pillThumb, { width: px(44), height: px(44) }]}
            />
          ) : (
            <View style={styles.pillThumbPlaceholder}>
              <BaseText size={18}>💊</BaseText>
            </View>
          )}
          <View style={styles.pillInfo}>
            <BaseText
              size={15}
              weight={isSelected ? 'bold' : 'semiBold'}
              style={styles.pillName}
              numberOfLines={1}
            >
              {pill.item_name}
            </BaseText>
            {!!pill.class_name && (
              <BaseText
                size={12}
                weight="regular"
                style={styles.pillClass}
                numberOfLines={1}
              >
                {pill.class_name}
              </BaseText>
            )}
          </View>
        </View>

        <SelectionRadioButton isSelected={isSelected} size={16} />
      </TouchableOpacity>
    );
  },
);

PillSelectListItem.displayName = 'PillSelectListItem';
