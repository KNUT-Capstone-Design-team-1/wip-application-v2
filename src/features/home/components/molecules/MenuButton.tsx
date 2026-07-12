import {
  DimensionValue,
  ImageSourcePropType,
  Pressable,
  View,
} from 'react-native';
import { styles } from '../../styles/molecules/MenuButton';
import { BaseText } from '@components/common/BaseText';
import { Image } from '@components/common/CustomImage';
import { LinearGradient } from 'expo-linear-gradient';
import { COLOR } from '@constants/color';

interface MenuButtonProps {
  imageSource: ImageSourcePropType;
  onPress: () => void;
  disabled?: boolean;
  width: DimensionValue;
  height: DimensionValue;
  title?: string;
  content?: string;
}

const MenuButton = ({
  imageSource,
  onPress,
  width,
  height,
  title,
  content,
}: MenuButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          width: width,
          height: height,
          opacity: pressed ? 0.8 : 1,
        },
        styles.menuButton,
      ]}
      onPress={onPress}
    >
      <LinearGradient
        colors={[COLOR['primary'], COLOR['tertiary']]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBg}
      />
      <View style={styles.menuContainer}>
        <View style={styles.buttonImgWrapper}>
          <Image
            style={styles.buttonImg}
            contentFit="contain"
            source={imageSource}
          />
        </View>
        <View style={styles.buttonContentWrapper}>
          <BaseText weight={'bold'} size={22} style={styles.title}>
            {title}
          </BaseText>
          <BaseText weight={'medium'} size={12} style={styles.content}>
            {content}
          </BaseText>
        </View>
      </View>
    </Pressable>
  );
};

export default MenuButton;
