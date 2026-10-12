import { Linking, TouchableOpacity } from 'react-native';
import { Search } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BaseText } from '@components/common/BaseText';
import { COLOR } from '@constants/color';
import { useExternalUrlStore } from '@store/external_url_store';
import logger from '@utils/logger';
import { fontPx, px } from '@utils/responsive';
import { styles } from '../../styles/atoms/FoodSafetyKoreaFloatingButton';

const FoodSafetyKoreaFloatingButton = () => {
  const insets = useSafeAreaInsets();
  const foodSafetyKoreaUrl = useExternalUrlStore(
    (state) => state.foodSafetyKoreaUrl,
  );

  const handlePress = async () => {
    try {
      await Linking.openURL(foodSafetyKoreaUrl);
    } catch (error) {
      logger.error(
        `Failed to open FoodSafetyKorea URL. ${(error as Error).stack || error}`,
      );
    }
  };

  return (
    <TouchableOpacity
      style={[styles.floatingButton, { bottom: px(30) + insets.bottom }]}
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="식품안전나라에서 검색 결과에 없는 약 검색"
    >
      <Search size={fontPx(18)} color={COLOR.white} strokeWidth={2} />
      <BaseText style={styles.buttonText} weight="semiBold" size={14}>
        검색 결과에 없는 약 검색
      </BaseText>
    </TouchableOpacity>
  );
};

export default FoodSafetyKoreaFloatingButton;
