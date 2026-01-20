import { View, StyleSheet } from 'react-native';
import { usePathname } from 'expo-router';
import { PAGE_TITLES } from './constants';
import Header from './header/Header';
import SubHeader from './header/SubHeader';
import BottomTab from '@/app/layouts/bottomTab/BottomTab';

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
