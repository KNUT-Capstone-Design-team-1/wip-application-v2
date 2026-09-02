import { BaseText } from '@components/common/BaseText';
import { usePillImageActions } from '@features/pill_image_search/hooks/usePillImageActions';
import { TouchableOpacity, View } from 'react-native';
import { styles } from '@features/pill_image_search/styles/organisms/ImageSearchButton';
import { usePillImageStore } from '@features/pill_image_search/store/pill_image_store';
import { COLOR_BG, COLOR_TEXT } from '@constants/color';

// 검색하기 버튼
const ImageSearchButton = () => {
  const { handleSearch } = usePillImageActions();
  const { front, back } = usePillImageStore(
    (state) => state.isImageLoadComplete,
  );

  const isSearchDisabled = () => {
    if (front && back) {
      return false;
    }
    return true;
  };

  return (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.searchButton,
          isSearchDisabled() && { backgroundColor: COLOR_BG['btnDisabled'] },
        ]}
        onPress={handleSearch}
        disabled={isSearchDisabled()}
      >
        <BaseText
          size={20}
          weight="bold"
          style={[
            styles.searchButtonText,
            isSearchDisabled() && { color: COLOR_TEXT['disabled'] },
          ]}
        >
          검색하기
        </BaseText>
      </TouchableOpacity>
    </View>
  );
};

export default ImageSearchButton;
