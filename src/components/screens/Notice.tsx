import React, { useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useScreenStore } from '@/store/screen';
import { ScrollView, StyleSheet } from 'react-native';
import Layout from '@components/organisms/Layout';
import { useNotices } from '@/hooks/useNotices';
import { font, os } from '@/style/font';
import { useNoticeStore } from '@store/noticeStore';
import NoticeList from '@components/molecules/NoticeList';

const Notice = () => {
  const nav: any = useNavigation();
  const setScreen = useScreenStore((state) => state.setScreen);
  const { getNoticeList } = useNotices();
  const noticeData = useNoticeStore((state) => state.noticeData);

  const handleSetScreen = useCallback(() => {
    setScreen('공지 사항');
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
  termsText: {
    color: '#000',
    fontFamily: os.font(400, 400),
    fontSize: font(16),
    includeFontPadding: false,
    paddingBottom: 100,
  },
});

export default Notice;
