import { View, Text, ActivityIndicator } from 'react-native';
import { styles } from '../styles/Notice';
import { useEffect } from 'react';
import { useNoticeStore } from '../store/notice_store';
import { useNotices } from '../hooks/use_notice';
import NoticeList from '../components/NoticeList';

const Notice = () => {
  const { noticeData, isNoticeLoading } = useNoticeStore();
  const { getNoticeList } = useNotices();

  useEffect(() => {
    loadNotices();
    console.log('noticeData', noticeData.length);
  }, []);

  const loadNotices = async () => {
    await getNoticeList();
  };

  if (isNoticeLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>공지사항을 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>공지사항</Text>
      </View>
      {noticeData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>공지사항이 없습니다.</Text>
        </View>
      ) : (
        <NoticeList noticeData={noticeData} />
      )}
    </View>
  );
};

export default Notice;
