import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from './styles';
import { fontPx, px } from '@utils/responsive';
import { COLOR } from '@constants/color';
import { ChevronLeft } from 'lucide-react-native';
import UnifiedSearchBar from '@features/unified_search/components/UnifiedSearchBar';

const SearchHeader = () => {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchHeaderContent}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ChevronLeft
            size={fontPx(24)}
            color={COLOR['secondary']}
            strokeWidth={2.5}
          />
        </TouchableOpacity>
        <UnifiedSearchBar focus={true} />
      </View>
    </View>
  );
};

export default SearchHeader;
