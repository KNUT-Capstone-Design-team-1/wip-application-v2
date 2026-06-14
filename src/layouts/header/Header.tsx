import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { px } from '@utils/responsive';
import { styles } from './styles';
import UnifiedSearchBar from '@features/unified_search/components/UnifiedSearchBar';
import { Settings } from 'lucide-react-native';
import { COLOR } from '@constants/color';

const Header = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.logoWrapper}>
          <Text style={styles.logoText}>이게뭐약</Text>
        </View>
        <UnifiedSearchBar containerStyle={{ marginLeft: px(32), flex: 1 }} />
        <Pressable
          style={({ pressed }) => [
            styles.settingButton,
            pressed && { opacity: 0.4 },
          ]}
          onPress={() => router.push('/setting')}
        >
          <Settings size={px(22)} color={COLOR['black']} strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  );
};

export default Header;
