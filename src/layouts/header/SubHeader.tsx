import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { styles } from './styles';
import { px, fontPx } from '@utils/responsive';
import { COLOR_PRIMARY } from '@constants/color';
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
      <View style={styles.content}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ChevronLeft
            size={fontPx(24)}
            color={COLOR_PRIMARY[200]}
            strokeWidth={2.5}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.menuButton} />
      </View>
    </View>
  );
};

export default SubHeader;
