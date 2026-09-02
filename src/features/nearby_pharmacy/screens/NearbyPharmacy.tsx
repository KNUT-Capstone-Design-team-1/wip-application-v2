import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Region } from 'react-native-maps';
import { useNearbyPharmacy } from '@features/nearby_pharmacy/hooks/use_nearby_pharmacy';
import { usePharmacyClusters } from '@features/nearby_pharmacy/hooks/use_pharmacy_clusters';
import { useClusterSelection } from '@features/nearby_pharmacy/hooks/use_cluster_selection';
import { useResearchPharmacy } from '@features/nearby_pharmacy/hooks/use_research_pharmacy';
import { useStockInquiry } from '@features/nearby_pharmacy/hooks/use_stock_inquiry';
import { styles } from '@features/nearby_pharmacy/styles/NearbyPharmacyScreen';
import { COLOR } from '@constants/color';
import PharmacyInfoCard from '@features/nearby_pharmacy/components/molecules/PharmacyInfoCard';
import PharmacyClusterList from '@features/nearby_pharmacy/components/molecules/PharmacyClusterList';
import ResearchHereButton from '@features/nearby_pharmacy/components/atoms/ResearchHereButton';
import PharmacyLocateButton from '@features/nearby_pharmacy/components/atoms/PharmacyLocateButton';
import PharmacyMap from '@features/nearby_pharmacy/components/organisms/PharmacyMap';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 주변 약국 지도 화면
const NearbyPharmacyScreen = () => {
  // 약국 데이터 및 위치 관련 전역 훅
  const {
    mapRef,
    initialRegion,
    location,
    pharmacies,
    loading,
    selectedPharmacy,
    clusterPharmacies,
    handleLocate,
    handleCopy,
    handleMarkerPress,
    handleCloseInfoCard,
    openClusterList,
    closeClusterList,
    handleClusterPharmacySelect,
    fetchPharmacies,
    lastFetchedCenter,
  } = useNearbyPharmacy();

  // 재고 문의 모드 훅
  const { isStockInquiryMode, handleStockInquiryCall } = useStockInquiry();

  // 안전 영역(노치 등) 여백 값
  const insets = useSafeAreaInsets();

  // 현재 지도 화면의 위경도 및 줌(Delta) 상태
  const [region, setRegion] = useState<Region>(initialRegion);

  // 약국 데이터를 기반으로 클러스터(묶음) 생성
  const { clusters, getClusterPharmacyIds } = usePharmacyClusters(
    pharmacies,
    region,
  );

  // 클러스터 마커 선택 시 하단 리스트를 띄우고 줌인하는 로직
  const { pharmaciesById, handleClusterPress } = useClusterSelection({
    pharmacies,
    mapRef,
    region,
    getClusterPharmacyIds,
    openClusterList,
  });

  // 사용자가 지도를 일정 거리 이상 이동했을 때 "현재 위치에서 검색" 버튼 표시 로직
  const { shouldResearch, handleResearchHere } = useResearchPharmacy(
    region,
    lastFetchedCenter,
    fetchPharmacies,
  );

  // 초기 로딩 중이며 위치 정보가 아직 없을 때만 로딩 스피너 표시
  if (loading && !location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLOR['primary']} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 지도 및 마커 렌더링 영역 */}
      <PharmacyMap
        mapRef={mapRef}
        initialRegion={initialRegion}
        onRegionChangeComplete={setRegion}
        insets={insets}
        clusters={clusters}
        pharmaciesById={pharmaciesById}
        selectedPharmacyId={selectedPharmacy?.id}
        onPharmacyPress={handleMarkerPress}
        onClusterPress={handleClusterPress}
      />

      {/* 일정 거리 이동 시 나타나는 재검색 버튼 */}
      {shouldResearch && (
        <ResearchHereButton loading={loading} onPress={handleResearchHere} />
      )}

      {/* 하단 약국 상세 정보 또는 클러스터(묶음) 목록 오버레이 */}
      <View style={styles.bottomOverlay}>
        {clusterPharmacies ? (
          <PharmacyClusterList
            pharmacies={clusterPharmacies}
            onPharmacyPress={handleClusterPharmacySelect}
            onClosePress={closeClusterList}
          />
        ) : (
          selectedPharmacy && (
            <PharmacyInfoCard
              pharmacy={selectedPharmacy}
              onCopyPress={handleCopy}
              onClosePress={handleCloseInfoCard}
              onStockInquiryPress={
                isStockInquiryMode ? handleStockInquiryCall : undefined
              }
            />
          )
        )}
      </View>

      {/* 현재 내 위치(GPS)로 카메라를 이동시키는 버튼 */}
      <PharmacyLocateButton onPress={handleLocate} insets={insets} />
    </View>
  );
};

export default NearbyPharmacyScreen;
