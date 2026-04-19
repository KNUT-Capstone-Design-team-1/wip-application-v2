import { View, StyleSheet } from 'react-native';
import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PAGE_TITLES } from './constants';
import Header from './header/Header';
import SubHeader from './header/SubHeader';
import BottomTab from '../layouts/bottomTab/BottomTab';
import BottomSheet from '@features/notice/components/BottomSheet';
import { useNoticeStore } from '@features/notice/store/notice_store';
import { useNotices } from '@features/notice/hooks/use_notice';

const BOTTOM_SHEET_HIDDEN_KEY = 'bottomSheetHiddenUntil';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const isMainPage = pathname === '/';
  const pageTitle = PAGE_TITLES[pathname] || '페이지';
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const { mainBottomSheetData } = useNoticeStore();
  const { getNoticeBottomSheet } = useNotices();

  useEffect(() => {
    if (isMainPage) {
      loadNoticeBottomSheet();
    }
  }, [isMainPage]);

  const loadNoticeBottomSheet = async () => {
    const hiddenUntil = await AsyncStorage.getItem(BOTTOM_SHEET_HIDDEN_KEY);
    if (hiddenUntil) {
      const hiddenTime = parseInt(hiddenUntil);
      const now = Date.now();
      if (now < hiddenTime) {
        return;
      }
    }
    await getNoticeBottomSheet();
  };

  useEffect(() => {
    if (isMainPage && mainBottomSheetData && mainBottomSheetData.length > 0) {
      setShowBottomSheet(true);
    }
  }, [mainBottomSheetData, isMainPage]);

  const handleCloseBottomSheet = () => {
    setShowBottomSheet(false);
  };

  const handleNeverShowAgain = async () => {
    const oneDayLater = Date.now() + 24 * 60 * 60 * 1000;
    await AsyncStorage.setItem(BOTTOM_SHEET_HIDDEN_KEY, oneDayLater.toString());
    setShowBottomSheet(false);
  };

  return (
    <View style={styles.container}>
      {isMainPage ? <Header /> : <SubHeader title={pageTitle} />}
      <View style={styles.content}>{children}</View>
      <BottomTab />
      {isMainPage && showBottomSheet && mainBottomSheetData.length > 0 && (
        <BottomSheet
          data={mainBottomSheetData}
          onClose={handleCloseBottomSheet}
          onNeverShowAgain={handleNeverShowAgain}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    marginBottom: -30,
    paddingHorizontal: '5%',
  },
});

export default Layout;
