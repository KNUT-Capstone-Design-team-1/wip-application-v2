import React, { useState, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Region } from 'react-native-maps';
import { useNearbyPharmacy } from '@features/nearby_pharmacy/hooks/use_nearby_pharmacy';
import { usePharmacyClusters } from '@features/nearby_pharmacy/hooks/use_pharmacy_clusters';
import { useClusterSelection } from '@features/nearby_pharmacy/hooks/use_cluster_selection';
import { useResearchPharmacy } from '@features/nearby_pharmacy/hooks/use_research_pharmacy';
import { useStockInquiry } from '@features/nearby_pharmacy/hooks/use_stock_inquiry';
import { usePharmacyOpenFilter } from '@features/nearby_pharmacy/hooks/use_pharmacy_open_filter';
import { styles } from '@features/nearby_pharmacy/styles/NearbyPharmacyScreen';
import { COLOR } from '@constants/color';
import { bottomTabSize } from '@constants/size';
import ResearchHereButton from '@features/nearby_pharmacy/components/atoms/ResearchHereButton';
import PharmacyMap from '@features/nearby_pharmacy/components/organisms/PharmacyMap';
import PharmacyMapBottomOverlay from '@features/nearby_pharmacy/components/organisms/PharmacyMapBottomOverlay';
import StockInquirySummaryModal from '@features/nearby_pharmacy/components/molecules/StockInquirySummaryModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 주변 약국 지도 화면 컴포넌트
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
  const { isStockInquiryMode, pillContext, handleStockInquiryCall } =
    useStockInquiry();

  // 재고 문의 요약 모달 표시 여부 상태
  const [inquiryModalVisible, setInquiryModalVisible] = useState(false);

  // 안전 영역(노치 등) 여백 값
  const insets = useSafeAreaInsets();

  // 현재 지도 화면의 위경도 및 줌(Delta) 상태
  const [region, setRegion] = useState<Region>(initialRegion);

  // 영업 중인 약국만 표시 필터 상태 및 필터링된 약국 목록 훅
  const { isOpenOnly, displayedPharmacies, handleToggleOpenOnly } =
    usePharmacyOpenFilter(pharmacies, handleCloseInfoCard);

  // 필터링된 약국 데이터를 기반으로 클러스터(묶음) 생성
  const { clusters, getClusterPharmacyIds } = usePharmacyClusters(
    displayedPharmacies,
    region,
  );

  // 클러스터 마커 선택 시 하단 리스트 노출 로직
  const { pharmaciesById, handleClusterPress } = useClusterSelection({
    pharmacies: displayedPharmacies,
    getClusterPharmacyIds,
    openClusterList,
  });

  // 사용자가 지도를 일정 거리 이상 이동했을 때 "현재 지도에서 검색" 버튼 표시 로직
  const { shouldResearch, handleResearchHere } = useResearchPharmacy(
    region,
    lastFetchedCenter,
    fetchPharmacies,
    handleCloseInfoCard,
    isOpenOnly,
  );

  // 재고 문의 모달 열기 핸들러
  const handleOpenInquiryModal = useCallback(() => {
    setInquiryModalVisible(true);
  }, []);

  // 재고 문의 모달 닫기 핸들러
  const handleCloseInquiryModal = useCallback(() => {
    setInquiryModalVisible(false);
  }, []);

  // 초기 로딩 중이며 위치 정보가 아직 없을 때만 로딩 스피너 표시
  const shouldShowLoading = loading && !location;

  if (shouldShowLoading) {
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
        selectedPharmacy={selectedPharmacy}
        getClusterPharmacyIds={getClusterPharmacyIds}
        onPharmacyPress={handleMarkerPress}
        onClusterPress={handleClusterPress}
      />

      {/* 일정 거리 이동 시 나타나는 재검색 버튼 */}
      {shouldResearch && (
        <ResearchHereButton loading={loading} onPress={handleResearchHere} />
      )}

      {/* 하단 플로팅 컨트롤 및 약국 정보 오버레이 (재고 문의 모달 열림 시 숨김) */}
      {!inquiryModalVisible && (
        <PharmacyMapBottomOverlay
          bottomInset={bottomTabSize.height + insets.bottom}
          isOpenOnly={isOpenOnly}
          onToggleOpenOnly={handleToggleOpenOnly}
          onLocate={handleLocate}
          clusterPharmacies={clusterPharmacies}
          selectedPharmacy={selectedPharmacy}
          onClusterPharmacySelect={handleClusterPharmacySelect}
          onCloseClusterList={closeClusterList}
          onCopyPharmacyInfo={handleCopy}
          onClosePharmacyCard={handleCloseInfoCard}
          isStockInquiryMode={isStockInquiryMode}
          onOpenInquiryModal={handleOpenInquiryModal}
        />
      )}

      {/* 재고 문의 요약 및 원터치 전화 모달 */}
      <StockInquirySummaryModal
        isVisible={inquiryModalVisible}
        pharmacy={selectedPharmacy}
        pillContext={pillContext}
        onClose={handleCloseInquiryModal}
        onCall={handleStockInquiryCall}
      />
    </View>
  );
};

export default NearbyPharmacyScreen;
