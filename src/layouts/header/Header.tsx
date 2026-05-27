import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';
import UnifiedSearchBar from '@features/unified_search/components/UnifiedSearchBar';

const Header = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.logoWrapper}>
          <Text style={styles.logoText}>이게뭐약</Text>
        </View>
        <UnifiedSearchBar containerStyle={{ marginLeft: 45, flex: 1 }} />
      </View>
    </View>
  );
};

export default Header;
