import { useCallback } from 'react';
import NearbyPharmacyScreen from '@features/nearby_pharmacy/screens/NearbyPharmacy';
import { useHeaderTitleStore } from '@layouts/header/store/header_title_store';
import { useFocusEffect } from 'expo-router';

// 알약 재고 문의 전용 주변 약국 스택 라우트
export default function NearbyPharmacyInquiryRoute() {
  const { setTitle, resetTitle } = useHeaderTitleStore();

  useFocusEffect(
    useCallback(() => {
      setTitle('');
      return () => resetTitle();
    }, [resetTitle, setTitle]),
  );

  return <NearbyPharmacyScreen />;
}
