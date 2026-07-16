import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname } from 'expo-router';
import Header from './header/Header';
import SubHeader from './header/SubHeader';
import NearbyPharmacyHeader from './header/NearbyPharmacyHeader';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const isMainPage = pathname === '/';
  const isNearbyPharmacy = pathname === '/nearby-pharmacy';

  const renderHeader = () => {
    if (isMainPage) {
      return <Header />;
    }

    if (isNearbyPharmacy) {
      return <NearbyPharmacyHeader />;
    }

    return <SubHeader />;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {renderHeader()}
      <View style={styles.content}>{children}</View>
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
  },
});

export default Layout;
