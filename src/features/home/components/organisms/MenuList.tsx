import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../../styles/organisms/MenuList';
import { BUTTON_LIST } from '../../constants/MenuList';
import { useToast } from '@hooks/use_toast';
import MenuButton from '../molecules/MenuButton';
import { px } from '@utils/responsive';

const MenuList = () => {
  const router = useRouter();
  const { showToast } = useToast();

  const handlePress = (path: string) => {
    // path가 dev 이면 개발 중 toast 추가
    if (path === 'dev') {
      showToast({ message: '아직 개발 중인 기능입니다.' });
      return;
    }
    router.push(path);
  };

  return (
    <View style={styles.menuListWrapper}>
      {BUTTON_LIST.map((button, index) => (
        <MenuButton
          key={index}
          imageSource={button.img}
          width={'100%'}
          height={px(110)}
          title={button.title}
          content={button.content}
          onPress={() => handlePress(button.path)}
        />
      ))}
    </View>
  );
};

export default MenuList;
