import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../../styles/organisms/MenuList';
import { BUTTON_LIST } from '../../constants/MenuList';
import ImageButton from '../../components/atoms/ImageButton';

const MenuList = () => {
  const router = useRouter();

  return (
    <View style={styles.menuListWrapper}>
      {BUTTON_LIST.map((button, index) => (
        <ImageButton
          key={index}
          imageSource={button.img}
          width={166}
          height={140}
          onPress={() => router.push(button.path)}
        />
      ))}
    </View>
  );
};

export default MenuList;
