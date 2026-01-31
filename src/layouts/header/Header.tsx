import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';
import LogoSvg from '@/assets/images/logo.svg';
import MenuSvg from '@/assets/images/menu.svg';
import { router } from 'expo-router';

const Header = () => {
  const insets = useSafeAreaInsets();

  // 메뉴 버튼 클릭 핸들러 (추후 구현)
  const handleMenuPress = () => {};

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <LogoSvg width={120} height={40} />
        </TouchableOpacity>
        {/*<TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>*/}
        {/*  <MenuSvg width={24} height={24} />*/}
        {/*</TouchableOpacity>*/}
      </View>
    </View>
  );
};

export default Header;
