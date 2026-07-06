import React, { memo, useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { router } from 'expo-router';
import { styles } from '@features/notice/styles/NoticeItem';
import {
  INoticeData,
  INoticeItemProps,
} from '@features/notice/types/notice_type';
import { formatDate, isModified } from '@utils/dateUtils';
import { px } from '@utils/responsive';

/**
 * 공지사항 텍스트 정보 컴포넌트 (제목 및 날짜)
 */
const NoticeInfo = ({ notice }: { notice: INoticeData }) => {
  const isContentModified = isModified(notice.createDate, notice.updateDate);

  return (
    <View style={{ flex: 1, marginRight: px(10) }}>
      <BaseText
        size={14}
        weight="bold"
        style={styles.noticeTitle}
        numberOfLines={1}
      >
        {notice.title}
      </BaseText>
      <BaseText size={12} weight="regular" style={styles.noticeDate}>
        {formatDate(notice.createDate)}
        {isContentModified && ' (수정)'}
      </BaseText>
    </View>
  );
};

/**
 * 필독 공지 뱃지 컴포넌트
 */
const MustReadBadge = ({ mustRead }: { mustRead: number }) => {
  if (mustRead !== 1) return null;

  return (
    <View style={styles.badge}>
      <BaseText
        fontFamily="Jalnan2"
        weight="regular"
        size={12}
        style={styles.badgeText}
      >
        필독
      </BaseText>
    </View>
  );
};

const NoticeItem = ({ noticeData }: INoticeItemProps) => {
  const handlePress = useCallback(() => {
    router.push({
      pathname: '/notice-detail',
      params: { notice: JSON.stringify(noticeData) },
    });
  }, [noticeData]);

  return (
    <TouchableOpacity
      style={styles.noticeDataWrapper}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <NoticeInfo notice={noticeData} />
      <MustReadBadge mustRead={noticeData.mustRead} />
    </TouchableOpacity>
  );
};

export default memo(NoticeItem);
