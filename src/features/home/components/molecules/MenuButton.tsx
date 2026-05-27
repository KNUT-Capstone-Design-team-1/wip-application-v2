import {
  DimensionValue,
  Image,
  ImageSourcePropType,
  Pressable,
  View,
  Text,
} from 'react-native';
import { styles } from '../../styles/molecules/MenuButton';

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
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.content}>{content}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default MenuButton;
