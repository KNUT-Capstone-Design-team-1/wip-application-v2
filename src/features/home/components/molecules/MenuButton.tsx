import {
  DimensionValue,
  Image,
  ImageSourcePropType,
  Pressable,
  View,
} from 'react-native';
import { styles } from '../../styles/molecules/MenuButton';
import { BaseText } from '@components/common/BaseText';

interface MenuButtonProps {
  imageSource: ImageSourcePropType;
  onPress: () => void;
  disabled?: boolean;
  width: DimensionValue;
  height: DimensionValue;
  backgroundColor: string;
  title?: string;
  content?: string;
}

const MenuButton = ({
  imageSource,
  onPress,
  width,
  height,
  backgroundColor = '#fff',
  title,
  content,
}: MenuButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          width: width,
          height: height,
          backgroundColor: backgroundColor,
          opacity: pressed ? 0.8 : 1,
        },
        styles.menuButton,
      ]}
      onPress={onPress}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <View style={styles.buttonImgWrapper}>
          <Image source={imageSource} />
        </View>
        <View style={styles.buttonContentWrapper}>
          <BaseText weight={'bold'} size={16} style={styles.title}>
            {title}
          </BaseText>
          <BaseText weight={'medium'} size={11} style={styles.content}>
            {content}
          </BaseText>
        </View>
      </View>
    </Pressable>
  );
};

export default MenuButton;
