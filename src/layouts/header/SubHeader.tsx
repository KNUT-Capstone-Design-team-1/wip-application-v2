import { Keyboard, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Search, X } from 'lucide-react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { useHeaderActionStore } from './store/header_action_store';
import { useHeaderTitleStore } from './store/header_title_store';
import { styles } from './styles';

const SubHeader = () => {
  const router = useRouter();
  const onSearch = useHeaderActionStore((state) => state.onSearch);
  const isSearchOpen = useHeaderActionStore((state) => state.isSearchOpen);
  const title = useHeaderTitleStore((state) => state.title);
  const SearchIcon = isSearchOpen ? X : Search;

  const handleBackPress = () => {
    Keyboard.dismiss();
    router.back();
  };

  return (
    <View style={styles.container} onTouchStart={Keyboard.dismiss}>
      <View style={styles.subHeaderContent}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="뒤로가기"
        >
          <ChevronLeft
            size={fontPx(24)}
            color={COLOR.secondary}
            strokeWidth={2.5}
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <BaseText
            weight="bold"
            size={18}
            style={styles.headerTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </BaseText>
        </View>
        {onSearch ? (
          <TouchableOpacity
            onPress={onSearch}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel={
              isSearchOpen ? '본문 검색 닫기' : '상세 정보에서 찾기'
            }
            accessibilityHint="상세 정보 검색창을 열거나 닫습니다"
          >
            <SearchIcon
              size={fontPx(isSearchOpen ? 20 : 18)}
              color={COLOR.secondary}
              strokeWidth={2.5}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
      </View>
    </View>
  );
};

export default SubHeader;
