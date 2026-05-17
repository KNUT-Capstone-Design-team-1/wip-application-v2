import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { styles } from './styles';
// import MenuSvg from '@assets/images/menu.svg';
import LeftArrow from '@assets/images/arrow-left.svg';

interface SubHeaderProps {
  title: string;
}

const SubHeader = ({ title }: SubHeaderProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  // 메뉴 버튼 클릭 핸들러 (추후 구현)
  // const handleMenuPress = () => {};

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <LeftArrow width={10} height={18} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.menuButton} />
      </View>
    </View>
  );
};

export default SubHeader;
