import { memo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useStore } from 'zustand';
import { BaseText } from '@components/common/BaseText';
import { COLOR_TEXT } from '@constants/color';
import { GlobalNativeAd } from '@features/ads/components/GlobalNativeAd';
import { usePillDetailContext } from '../../hooks/use_pill_detail_context';
import { styles } from '../../styles/organisms/PillDetailInfo';
import PillBasicHeader from '../molecules/PillBasicHeader';
import PillDescriptionSection from '../molecules/PillDescriptionSection';
import PillSafetySection from '../molecules/PillSafetySection';
import PillSpecsSection from '../molecules/PillSpecsSection';

// 원격 상세 정보 로딩·문서 표시 격리.
const PillDetailDocuments = () => {
  const store = usePillDetailContext();

  const loading = useStore(store, (state) => state.detailLoading);
  const data = useStore(store, (state) => state.pillData);

  if (loading) {
    return (
      <View style={styles.detailInfoContainer}>
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLOR_TEXT.sub} />
          <BaseText weight="medium" size={14} style={styles.emptyText}>
            상세 데이터를 불러오는 중입니다...
          </BaseText>
        </View>
      </View>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <View style={styles.detailInfoContainer}>
      <PillSafetySection data={data} />
      <GlobalNativeAd banner />
      <PillDescriptionSection data={data} />
    </View>
  );
};

// 헤더·제원·상세 문서 레이아웃 구성.
const PillDetailInfo = () => (
  <View style={styles.infoContainer}>
    <PillBasicHeader />
    <PillSpecsSection />
    <PillDetailDocuments />
  </View>
);

export default memo(PillDetailInfo);
