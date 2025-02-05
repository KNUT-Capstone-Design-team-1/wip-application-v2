import { useEffect, useState } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-5138014230531110~3078755793';

const GoogleAdmob = () => {
  const [interstitialAd, setInterstitialAd] = useState<InterstitialAd | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const admob = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    setInterstitialAd(admob);

    const unsubscribeLoaded = admob.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    const unsubscribeClosed = admob.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      admob.load(); // 광고가 닫힌 후 새로운 광고 로드
    });

    admob.load(); // 광고 로드 시작

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  const showInterstitial = () => {
    if (loaded && interstitialAd) {
      interstitialAd.show();
    }
  };

  return { showInterstitial };
};

export default GoogleAdmob;
