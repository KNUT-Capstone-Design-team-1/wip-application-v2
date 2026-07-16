import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from './styles';
import { fontPx } from '@utils/responsive';
import { COLOR } from '@constants/color';
import { ChevronLeft } from 'lucide-react-native';
import { GlobalBannerAd } from '@features/ads/components/GlobalBannerAd';
import { BannerAdSize } from 'react-native-google-mobile-ads';

/** 주변 약국 화면 전용 헤더 (중앙에 배너 광고 노출) */
const NearbyPharmacyHeader = () => {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.subHeaderContent}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ChevronLeft
            size={fontPx(24)}
            color={COLOR['secondary']}
            strokeWidth={2.5}
          />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <GlobalBannerAd
            size={BannerAdSize.BANNER}
            style={{ paddingVertical: 0, transform: [{ scale: 0.85 }] }}
          />
        </View>
      </View>
    </View>
  );
};

export default NearbyPharmacyHeader;
