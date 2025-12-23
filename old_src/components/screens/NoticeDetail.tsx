import React, { useEffect, useCallback } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet } from 'react-native';
import Layout from '@components/organisms/Layout';
import NoticeDetailContent from '@components/organisms/NoticeDetailContent';
import { useScreenStore } from '@/store/screen';

const NoticeDetail = () => {
  const route = useRoute();
  const nav: any = useNavigation();
  const { notice }: any = route.params;
  const setScreen = useScreenStore((state) => state.setScreen);

  const handleSetScreen = useCallback(() => {
    setScreen('공지사항 상세');
  }, [setScreen]);

  useEffect(() => {
    nav.addListener('focus', () => handleSetScreen());
    return () => {
      nav.removeListener('focus', () => handleSetScreen());
    };
  }, [handleSetScreen, nav]);

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
    marginBottom: 20,
  },
});

export default NoticeDetail;
