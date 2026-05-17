import { View, StyleSheet } from 'react-native';
import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
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
  const { mainBottomSheetData, actions } = useNoticeStore();
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
        // 아직 24시간이 지나지 않았으면 데이터를 비워서 보여주지 않음
        actions.setMainBottomSheetData([]);
        return;
      }
    }
    await getNoticeBottomSheet();
  };

  useEffect(() => {
    if (isMainPage && mainBottomSheetData && mainBottomSheetData.length > 0) {
      setShowBottomSheet(true);
    } else {
      setShowBottomSheet(false);
    }
  }, [mainBottomSheetData, isMainPage]);

  const handleCloseBottomSheet = () => {
    setShowBottomSheet(false);
  };

  const handleNeverShowAgain = async () => {
    // 24시간 (24시간 * 60분 * 60초 * 1000밀리초)
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const hideUntil = Date.now() + ONE_DAY_MS;

    await AsyncStorage.setItem(BOTTOM_SHEET_HIDDEN_KEY, hideUntil.toString());

    // 상태도 함께 비워줌으로써 다시 나타나는 현상 방지
    actions.setMainBottomSheetData([]);
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
      <Toast />
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
