import React, { memo } from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { formatContents } from '@features/notice/utils/notice';
import { px } from '@utils/responsive';
import { styles } from '../styles/BottomSheet';
import { INoticeData } from '../types/notice_type';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface IBottomSheetItemProps {
  item: INoticeData;
  onPressDetail: (notice: INoticeData) => void;
}

const BottomSheetItem = ({ item, onPressDetail }: IBottomSheetItemProps) => {
  return (
    <View
      style={[
        styles.slideItem,
        { width: SCREEN_WIDTH, paddingHorizontal: px(16) },
      ]}
    >
      <View style={styles.slideContent}>
        <BaseText
          size={18}
          weight="bold"
          style={styles.title}
          numberOfLines={1}
        >
          {item.title}
        </BaseText>
        <BaseText
          size={14}
          weight="medium"
          style={styles.contents}
          numberOfLines={3}
        >
          {formatContents(item.contents)}
        </BaseText>
      </View>
      <TouchableOpacity
        style={styles.detailButton}
        onPress={() => onPressDetail(item)}
        activeOpacity={0.7}
      >
        <BaseText size={14} weight="semiBold" style={styles.detailButtonText}>
          자세히 보기
        </BaseText>
      </TouchableOpacity>
    </View>
  );
};

export default memo(BottomSheetItem);
