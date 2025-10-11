import React, { useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useScreenStore } from '@/store/screen';
import { ScrollView, StyleSheet } from 'react-native';
import Layout from '@components/organisms/Layout';
import { useNotices } from '@/hooks/useNotices';
import { useNoticeStore } from '@store/noticeStore';
import NoticeList from '@components/molecules/NoticeList';

const Notice = () => {
  const nav: any = useNavigation();
  const setScreen = useScreenStore((state) => state.setScreen);
  const { getNoticeList } = useNotices();
  const noticeData = useNoticeStore((state) => state.noticeData);

  const handleSetScreen = useCallback(() => {
    setScreen('공지사항');
  }, [setScreen]);

  useEffect(() => {
    getNoticeList();
    nav.addListener('focus', () => handleSetScreen());
    return () => {
      nav.removeListener('focus', () => handleSetScreen());
    };
  }, [handleSetScreen, nav]);

  return (
    <Layout.default>
      <ScrollView style={styles.scrollViewWrapper}>
        <NoticeList noticeData={noticeData} />
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

export default Notice;
