import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AD_UNITS } from '../constants/ad_units';
import logger from '@utils/logger';

interface IGlobalBannerAdProps {
  size?: BannerAdSize | string;
  style?: object;
}

export const GlobalBannerAd = ({
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
  style,
}: IGlobalBannerAdProps) => {
  const [isError, setIsError] = useState(false);
  const adUnitId = AD_UNITS.BANNER;

  // Web이거나 에러 발생, 혹은 ID가 없을 시 렌더링하지 않음
  if (Platform.OS === 'web' || isError || !adUnitId) return null;

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={adUnitId}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // 필요 시 GDPR/CCPA 대응
        }}
        onAdFailedToLoad={(error) => {
          logger.error(`BannerAd Failed to load: ${error}`);
          setIsError(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 10,
  },
});
