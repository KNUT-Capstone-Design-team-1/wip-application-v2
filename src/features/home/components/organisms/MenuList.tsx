import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../../styles/organisms/MenuList';
import { BUTTON_LIST } from '../../constants/MenuList';
import ImageButton from '../../components/atoms/ImageButton';

interface IMenuListProps {
  onPillIdentificationPress?: () => void;
}

const MenuList = ({ onPillIdentificationPress }: IMenuListProps) => {
  const router = useRouter();

  const handlePress = (path: string, index: number) => {
    // 첫 번째 버튼(식별 검색)은 모달로 열기
    if (index === 0 && onPillIdentificationPress) {
      onPillIdentificationPress();
    } else {
      router.push(path);
    }
  };

  return (
    <View style={styles.menuListWrapper}>
      {BUTTON_LIST.map((button, index) => (
        <ImageButton
          key={index}
          imageSource={button.img}
          width={166}
          height={140}
          onPress={() => handlePress(button.path, index)}
        />
      ))}
    </View>
  );
};

export default MenuList;
