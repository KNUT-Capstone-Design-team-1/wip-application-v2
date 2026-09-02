import { useEffect } from 'react';
import NearbyPharmacyScreen from '@features/nearby_pharmacy/screens/NearbyPharmacy';
import { useHeaderTitleStore } from '@layouts/header/store/header_title_store';
import { useLocalSearchParams } from 'expo-router';

// 알약 재고 문의 전용 주변 약국 스택 라우트
export default function NearbyPharmacyInquiryRoute() {
  const { pillName } = useLocalSearchParams<{ pillName?: string }>();
  const { setTitle, resetTitle } = useHeaderTitleStore();

  useEffect(() => {
    const title = pillName ? pillName : '알약 재고 문의';
    setTitle(title);
    return () => resetTitle();
  }, [pillName, setTitle, resetTitle]);

  return <NearbyPharmacyScreen />;
}
