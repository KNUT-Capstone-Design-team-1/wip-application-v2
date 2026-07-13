import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { useRouter } from 'expo-router';
import { styles } from './styles';
import { fontPx } from '@utils/responsive';
import { COLOR } from '@constants/color';
import { ChevronLeft } from 'lucide-react-native';
import { useHeaderTitleStore } from '@layouts/header/store/header_title_store';

const SubHeader = () => {
  const router = useRouter();

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
        {/* 이게 없으면 title이 우측으로 치우침 */}
        <View style={styles.menuButton} />
      </View>
    </View>
  );
};

export default SubHeader;
