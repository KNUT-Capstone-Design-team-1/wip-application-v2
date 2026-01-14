import { View, StyleSheet } from 'react-native';
import Header from './header/Header';
import BottomTab from '@/app/layouts/bottomTab/BottomTab';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>{children}</View>
      {/*<BottomTab />*/}
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
  },
});

export default Layout;
