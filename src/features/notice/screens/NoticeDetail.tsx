import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { styles } from '../styles/NoticeDetail';
import { useLocalSearchParams } from 'expo-router';
import { INoticeData } from '../types/notice_type';
import NoticeDetailContent from '@features/notice/components/NoticeDetailContent';
import { useHeaderTitleStore } from '@layouts/header/store/header_title_store';

const NoticeDetail = () => {
  const params = useLocalSearchParams();
  const { setTitle, resetTitle } = useHeaderTitleStore();

  // URL 파라미터에서 notice 데이터 파싱
  const notice: INoticeData = params.notice
    ? JSON.parse(params.notice as string)
    : null;

  useEffect(() => {
    if (notice) {
      setTitle(notice.title);
    }

    return () => {
      resetTitle();
    };
  }, []);

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
