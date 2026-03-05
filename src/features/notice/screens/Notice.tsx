import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useNoticeStore } from '../store/notice_store';
import { useNotices } from '../hooks/use_notice';
import NoticeList from '../components/NoticeList';

const Notice = () => {
  const { noticeData, isNoticeLoading } = useNoticeStore();
  const { getNoticeList } = useNotices();

  useEffect(() => {
    loadNotices();
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default Notice;
