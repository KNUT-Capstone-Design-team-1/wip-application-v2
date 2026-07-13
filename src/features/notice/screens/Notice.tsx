import { View, ActivityIndicator } from 'react-native';
import { styles } from '../styles/Notice';
import { useEffect } from 'react';
import { useNoticeStore } from '../store/notice_store';
import { useNotices } from '../hooks/use_notice';
import NoticeList from '../components/NoticeList';
import { BaseText } from '@components/common/BaseText';

const Notice = () => {
  const { noticeData, isNoticeLoading } = useNoticeStore();
  const { getNoticeList } = useNotices();

  useEffect(() => {
    getNoticeList(); // 마운트 시 공지사항 데이터를 로드
  }, [getNoticeList]);

  if (isNoticeLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <BaseText size={16} weight="medium" style={styles.loadingText}>
          공지사항을 불러오는 중...
        </BaseText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {noticeData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <BaseText size={16} weight="medium" style={styles.emptyText}>
            공지사항이 없습니다.
          </BaseText>
        </View>
      ) : (
        <NoticeList noticeData={noticeData} />
      )}
    </View>
  );
};

export default Notice;
