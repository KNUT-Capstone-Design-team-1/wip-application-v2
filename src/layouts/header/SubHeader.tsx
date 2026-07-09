import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { styles } from './styles';
import { fontPx } from '@utils/responsive';
import { COLOR } from '@constants/color';
import { ChevronLeft } from 'lucide-react-native';

interface SubHeaderProps {
  title: string;
}

const SubHeader = ({ title }: SubHeaderProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.subHeaderContent}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ChevronLeft
            size={fontPx(24)}
            color={COLOR['secondary']}
            strokeWidth={2.5}
          />
        </TouchableOpacity>
        <BaseText weight="bold" size={18} style={styles.headerTitle}>
          {title}
        </BaseText>
        {/* 이게 없으면 title이 우측으로 치우침 */}
        <View style={styles.menuButton} />
      </View>
    </View>
  );
};

export default SubHeader;
