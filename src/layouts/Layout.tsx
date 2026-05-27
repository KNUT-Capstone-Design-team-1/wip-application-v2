import { View, StyleSheet } from 'react-native';
import { usePathname } from 'expo-router';
import Toast from 'react-native-toast-message';
import { PAGE_TITLES } from './constants';
import Header from './header/Header';
import SubHeader from './header/SubHeader';
import BottomTab from '@layouts/bottomTab/BottomTab';
import MainNoticeBottomSheet from '@features/notice/components/MainNoticeBottomSheet';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const isMainPage = pathname === '/';
  const pageTitle = PAGE_TITLES[pathname] || '페이지';

  return (
    <View style={styles.container}>
      {isMainPage ? <Header /> : <SubHeader title={pageTitle} />}
      <View style={styles.content}>{children}</View>
      <BottomTab />

      {/* 홈 화면에서만 공지사항 바텀시트 로드 및 표시 */}
      {isMainPage && <MainNoticeBottomSheet />}

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
    paddingHorizontal: 0,
  },
});

export default Layout;
