import React from 'react';
import { useRoute } from '@react-navigation/native';
import { ScrollView, Text, StyleSheet } from 'react-native';
import Layout from '@components/organisms/Layout';
import NoticeDetailContent from '@components/organisms/NoticeDetailContent';

const NoticeDetail = () => {
  const route = useRoute();
  const { notice }: any = route.params;

  return (
    <Layout.default>
      <ScrollView style={styles.scrollViewWrapper}>
        <NoticeDetailContent noticeDetailContent={notice} />
      </ScrollView>
    </Layout.default>
  );
};

const styles = StyleSheet.create({
  scrollViewWrapper: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});

export default NoticeDetail;
