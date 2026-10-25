import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { useRouter } from 'expo-router';
import { styles } from './styles';
import { fontPx } from '@utils/responsive';
import { COLOR } from '@constants/color';
import { useHeaderActionStore } from './store/header_action_store';
import { ChevronLeft, Search } from 'lucide-react-native';
import { useHeaderTitleStore } from '@layouts/header/store/header_title_store';

const SubHeader = () => {
  const router = useRouter();

  const onSearch = useHeaderActionStore((state) => state.onSearch);
  const title = useHeaderTitleStore((state) => state.title);

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.subHeaderContent}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ChevronLeft
            size={fontPx(24)}
            color={COLOR['secondary']}
            strokeWidth={2.5}
          />
        </TouchableOpacity>
        <BaseText
          weight="bold"
          size={18}
          style={styles.headerTitle}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </BaseText>
        {onSearch ? (
          <TouchableOpacity
            onPress={onSearch}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="상세 정보에서 찾기"
            accessibilityHint="검색어를 입력해 본문에서 찾습니다"
          >
            <Search
              size={fontPx(16)}
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
