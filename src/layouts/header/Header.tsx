import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { styles } from './styles';
import LogoSvg from '@assets/images/logo.svg';
import UnifiedSearchBar from '@features/unified_search/components/UnifiedSearchBar';

const Header = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <LogoSvg width={120} height={40} />
        </TouchableOpacity>
        <UnifiedSearchBar containerStyle={{ marginLeft: 15, flex: 1 }} />
      </View>
    </View>
  );
};

export default Header;
