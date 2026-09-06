import { View, Pressable } from 'react-native';
import { COLOR } from '@constants/color';
import { BaseText } from '@components/common/BaseText';
import { ChevronRight } from 'lucide-react-native';
import { fontPx } from '@utils/responsive';
import { styles } from '../../styles/organisms/ImageSearchInfo';
import { useRouter } from 'expo-router';

const ImageSearchInfo = () => {
  const router = useRouter();
  const handlePressLink = () => {
    router.replace('/pill-identification-search');
  };
  return (
    <View style={styles.container}>
      <BaseText size={14} weight="semiBold" style={styles.infoText}>
        사진 상태에 따라 검색 결과가 다를 수 있어요
      </BaseText>
      <Pressable
        style={({ pressed }) => ({
          ...styles.identificationSearchLink,
          opacity: pressed ? 0.6 : 1,
        })}
        onPress={handlePressLink}
      >
        <BaseText
          size={14}
          weight="bold"
          style={styles.identificationSearchLinkText}
        >
          식별검색으로 찾아보기
        </BaseText>
        <ChevronRight
          size={fontPx(16)}
          color={COLOR['tertiary']}
          strokeWidth={fontPx(3)}
        />
      </Pressable>
    </View>
  );
};

export default ImageSearchInfo;
