import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from './styles';
import UnifiedSearchNavigateBar from '@features/unified_search/components/UnifiedSearchNavigateBar';

const Header = () => {
  return (
    <View style={styles.container}>
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
        <UnifiedSearchNavigateBar
          containerStyle={styles.navigateBarContainer}
        />
      </View>
    </View>
  );
};

export default Header;
