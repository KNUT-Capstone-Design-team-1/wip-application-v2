import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

export const AD_UNITS = {
  BANNER: __DEV__
    ? TestIds.BANNER
    : Platform.select({
        android: process.env.EXPO_PUBLIC_ADMOB_ANDROID_BANNER_ID || '',
        ios: process.env.EXPO_PUBLIC_ADMOB_IOS_BANNER_ID || '',
        default: '',
      }),
  INTERSTITIAL: __DEV__
    ? TestIds.INTERSTITIAL
    : Platform.select({
        android: process.env.EXPO_PUBLIC_ADMOB_ANDROID_INTERSTITIAL_ID || '',
        ios: process.env.EXPO_PUBLIC_ADMOB_IOS_INTERSTITIAL_ID || '',
        default: '',
      }),
};
