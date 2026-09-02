import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { X } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { Image } from '@components/common/CustomImage';
import { ISelectedPillItem } from '@features/pill_reminder/hooks/use_pill_reminder_setting_form';
import { styles } from '@features/pill_reminder/styles/atoms/SelectedPillItem';

interface ISelectedPillItemProps {
  pill: ISelectedPillItem;
  onPress?: () => void;
  onRemove: (itemSeq: string) => void;
}

// 선택된 알약 개별 항목 표시 컴포넌트 (터치 시 알약 선택 모달 오픈)
export const SelectedPillItem = memo(
  ({ pill, onPress, onRemove }: ISelectedPillItemProps) => {
    const hasOnPress = Boolean(onPress);

    return (
      <TouchableOpacity
        style={styles.selectedPillRow}
        onPress={onPress}
        disabled={!hasOnPress}
        activeOpacity={0.7}
      >
        {pill.item_image ? (
          <Image
            source={{ uri: pill.item_image }}
            contentFit="cover"
            style={styles.pillThumb}
          />
        ) : (
          <View style={styles.pillThumbPlaceholder}>
            <BaseText size={14}>💊</BaseText>
          </View>
        )}

        <View style={styles.pillInfo}>
          <BaseText
            size={14}
            weight="bold"
            style={styles.pillName}
            numberOfLines={1}
          >
            {pill.item_name}
          </BaseText>

          {!!pill.class_name && (
            <BaseText
              size={12}
              weight="medium"
              style={styles.pillClass}
              numberOfLines={1}
            >
              {pill.class_name}
            </BaseText>
          )}
        </View>

        <TouchableOpacity
          style={styles.removePillBtn}
          onPress={(e) => {
            e.stopPropagation();
            onRemove(pill.item_seq);
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <X size={fontPx(16)} color={COLOR_TEXT.sub} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  },
);

SelectedPillItem.displayName = 'SelectedPillItem';
