import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../../styles/organisms/MenuList';
import { BUTTON_LIST } from '../../constants/MenuList';
import Toast from '@components/common/Toast';
import { useToast } from '@hooks/use_toast';
import MenuButton from '../molecules/MenuButton';
import { px } from '@utils/responsive';

interface IMenuListProps {
  onPillIdentificationPress?: () => void;
}

const MenuList = ({ onPillIdentificationPress }: IMenuListProps) => {
  const router = useRouter();
  const { showToast, hideToast, toastState } = useToast();

  const handlePress = (path: string, index: number) => {
    // path가 dev 이면 개발 중 toast 추가
    if (path === 'dev') {
      showToast('아직 개발 중인 기능입니다.');
      return;
    }
    // 첫 번째 버튼(식별 검색)은 모달로 열기
    if (index === 0 && onPillIdentificationPress) {
      onPillIdentificationPress();
    } else {
      router.push(path);
    }
  };

  return (
    <>
      <View style={styles.menuListWrapper}>
        {BUTTON_LIST.map((button, index) => (
          <MenuButton
            key={index}
            imageSource={button.img}
            width={'48%'}
            height={px(140)}
            title={button.title}
            content={button.content}
            backgroundColor={button.backgroundColor}
            onPress={() => handlePress(button.path, index)}
          />
        ))}
      </View>
      <Toast
        message={toastState.message}
        visible={toastState.visible}
        onHide={hideToast}
      />
    </>
  );
};

export default MenuList;
