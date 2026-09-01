import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname } from 'expo-router';
import Header from './header/Header';
import SubHeader from './header/SubHeader';
import { styles } from './styles/Layout';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const isMainPage = pathname === '/';

  const renderHeader = () => {
    if (isMainPage) {
      return <Header />;
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

export default Layout;
