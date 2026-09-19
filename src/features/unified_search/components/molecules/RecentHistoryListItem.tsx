import { BaseText } from '@components/common/BaseText';
import { COLOR_BG, COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { X } from 'lucide-react-native';
import { View, Pressable } from 'react-native';
import { styles } from '../../styles/molecules/RecentHistoryListItem';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

interface IRecentHistoryListItem {
  text: string;
  onPress?: () => void;
  onRemove?: () => void;
}

const RecentHistoryListItem = ({
  text,
  onPress,
  onRemove,
}: IRecentHistoryListItem) => {
  const isPressed = useSharedValue(false);
  const wrapperStyle = useAnimatedStyle(() => ({
    backgroundColor: isPressed.value ? COLOR_BG['base'] : COLOR_BG['surface'],
  }));
  return (
    <Animated.View style={[styles.itemWrapper, wrapperStyle]}>
      <Pressable
        style={styles.itemTextBtn}
        onPress={onPress}
        onPressIn={() => (isPressed.value = true)}
        onPressOut={() => (isPressed.value = false)}
      >
        <View style={styles.itemTextPlaceholder}>
          <BaseText
            size={14}
            weight="semiBold"
            style={styles.itemText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {text}
          </BaseText>
        </View>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.6 : 1,
          },
        ]}
        onPress={onRemove}
      >
        <X size={fontPx(16)} strokeWidth={3} color={COLOR_TEXT['sub']} />
      </Pressable>
    </Animated.View>
  );
};

export default RecentHistoryListItem;
