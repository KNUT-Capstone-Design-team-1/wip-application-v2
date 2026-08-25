import React, { useCallback, useMemo, useState } from 'react';
import { View, ActivityIndicator, Pressable } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { useNearbyPharmacy } from '@features/nearby_pharmacy/hooks/use_nearby_pharmacy';
import { usePharmacyClusters } from '@features/nearby_pharmacy/hooks/use_pharmacy_clusters';
import { useClusterSelection } from '@features/nearby_pharmacy/hooks/use_cluster_selection';
import { styles } from '@features/nearby_pharmacy/styles/NearbyPharmacyScreen';
import { COLOR } from '@constants/color';
import PharmacyMarkers from '@features/nearby_pharmacy/components/molecules/PharmacyMarkers';
import PharmacyInfoCard from '@features/nearby_pharmacy/components/molecules/PharmacyInfoCard';
import PharmacyClusterList from '@features/nearby_pharmacy/components/molecules/PharmacyClusterList';
import ResearchHereButton from '@features/nearby_pharmacy/components/atoms/ResearchHereButton';
import { px } from '@utils/responsive';
import { bottomTabSize } from '@constants/size';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LocateFixed } from 'lucide-react-native';
import {
  KM_PER_LAT_DEGREE,
  KM_PER_LON_DEGREE,
  RESEARCH_DISPLACEMENT_RATIO,
  RESEARCH_MAX_DISPLACEMENT_KM,
} from '@features/nearby_pharmacy/constants/nearby_pharmacy';
/*
TODO: marker 위치가 정확한지 확인 필요
TODO: 현재 위치를 기준으로 반경 몇 m이내의 약국만 표시된다는 안내 필요
*/

/**
 * 주변 약국 지도 화면
 */
const NearbyPharmacyScreen = () => {
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
  const insets = useSafeAreaInsets();

  const [region, setRegion] = useState<Region>(initialRegion);

  const { clusters, getClusterPharmacyIds } = usePharmacyClusters(
    pharmacies,
    region,
  );

  const { pharmaciesById, handleClusterPress } = useClusterSelection({
    pharmacies,
    mapRef,
    insets,
    getClusterPharmacyIds,
    openClusterList,
  });

  // 지도 중심이 임계값 이상 이동했는지 (zoom in은 비율, zoom out은 절대 상한 기준)
  const shouldResearch = useMemo(() => {
    if (!lastFetchedCenter) {
      return false;
    }

    const displacementKm = Math.max(
      Math.abs(region.latitude - lastFetchedCenter.lat) * KM_PER_LAT_DEGREE,
      Math.abs(region.longitude - lastFetchedCenter.lng) * KM_PER_LON_DEGREE,
    );
    const visibleHeightKm = region.latitudeDelta * KM_PER_LAT_DEGREE;
    const thresholdKm = Math.min(
      visibleHeightKm * RESEARCH_DISPLACEMENT_RATIO,
      RESEARCH_MAX_DISPLACEMENT_KM,
    );

    return displacementKm > thresholdKm;
  }, [region, lastFetchedCenter]);

  const handleResearchHere = useCallback(() => {
    fetchPharmacies({ x: region.longitude, y: region.latitude });
  }, [fetchPharmacies, region]);

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
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        userInterfaceStyle="light"
        mapPadding={{
          top: 0,
          bottom: bottomTabSize.height + insets.bottom,
          left: 0,
          right: 0,
        }}
      >
        <PharmacyMarkers
          clusters={clusters}
          pharmaciesById={pharmaciesById}
          selectedPharmacyId={selectedPharmacy?.id}
          onPharmacyPress={handleMarkerPress}
          onClusterPress={handleClusterPress}
        />
      </MapView>

      {shouldResearch && (
        <ResearchHereButton loading={loading} onPress={handleResearchHere} />
      )}

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
            />
          )
        )}
      </View>
      <Pressable
        onPress={handleLocate}
        style={({ pressed }) => [
          {
            position: 'absolute',
            bottom: bottomTabSize.height + insets.bottom,
            right: px(8),
            backgroundColor: 'rgba(255,255,255,0.8)',
            padding: px(8),
            borderRadius: px(13),
            opacity: pressed ? 0.5 : 1,
            zIndex: 990,
          },
        ]}
      >
        <LocateFixed size={px(32)} color={COLOR['secondary']} strokeWidth={2} />
      </Pressable>
    </View>
  );
};

export default NearbyPharmacyScreen;
