import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { px } from '@utils/responsive';
import { styles } from './styles';
import UnifiedSearchBar from '@features/unified_search/components/UnifiedSearchBar';

const Header = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.HeaderContent}>
        <View style={styles.logoWrapper}>
          <BaseText
            fontFamily="Jalnan2"
            weight="regular"
            size={20}
            style={styles.logoText}
          >
            이게뭐약
          </BaseText>
        </View>
        <UnifiedSearchBar containerStyle={{ marginLeft: px(32), flex: 1 }} />
      </View>
    </View>
  );
};

export default Header;
