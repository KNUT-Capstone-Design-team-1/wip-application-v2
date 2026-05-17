import React from 'react';
import { ScrollView } from 'react-native';
import { styles } from '../styles/NoticeDetail';
import { useLocalSearchParams } from 'expo-router';
import { INoticeData } from '../types/notice_type';
import NoticeDetailContent from '@features/notice/components/NoticeDetailContent';

const NoticeDetail = () => {
  const params = useLocalSearchParams();

  // URL 파라미터에서 notice 데이터 파싱
  const notice: INoticeData = params.notice
    ? JSON.parse(params.notice as string)
    : null;

  if (!notice) {
    return null;
  }

  return (
    <ScrollView style={styles.scrollViewWrapper}>
      <NoticeDetailContent noticeDetailContent={notice} />
    </ScrollView>
  );
};

export default NoticeDetail;
