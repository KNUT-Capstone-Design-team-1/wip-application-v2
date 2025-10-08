import React, { useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useScreenStore } from '@/store/screen';
import { View, Text } from 'react-native';
import Layout from '@components/organisms/Layout';
import { useNotices } from '@/hooks/useNotices';

const Notices = () => {
  const nav: any = useNavigation();
  const setScreen = useScreenStore((state) => state.setScreen);
  const { getNoticeList } = useNotices();

  const handleSetScreen = useCallback(() => {
    setScreen('이용 약관');
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
      <Text>notice</Text>
    </Layout.default>
  );
};

export default Notices;
