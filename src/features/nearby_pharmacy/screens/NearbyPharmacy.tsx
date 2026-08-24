import React, { useCallback, useMemo, useState } from 'react';
import { View, ActivityIndicator, Pressable } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { useNearbyPharmacy } from '@features/nearby_pharmacy/hooks/use_nearby_pharmacy';
import { usePharmacyClusters } from '@features/nearby_pharmacy/hooks/use_pharmacy_clusters';
import { styles } from '@features/nearby_pharmacy/styles/NearbyPharmacyScreen';
import { COLOR } from '@constants/color';
import PharmacyMarkers from '@features/nearby_pharmacy/components/molecules/PharmacyMarkers';
import PharmacyInfoCard from '@features/nearby_pharmacy/components/molecules/PharmacyInfoCard';
import PharmacyClusterList from '@features/nearby_pharmacy/components/molecules/PharmacyClusterList';
import { px } from '@utils/responsive';
import { bottomTabSize } from '@constants/size';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LocateFixed } from 'lucide-react-native';
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
  } = useNearbyPharmacy();
  const insets = useSafeAreaInsets();

  const [region, setRegion] = useState<Region>(initialRegion);

  const { clusters, getClusterPharmacyIds } = usePharmacyClusters(
    pharmacies,
    region,
  );

  const pharmaciesById = useMemo(() => {
    const map = new Map<string, (typeof pharmacies)[number]>();
    for (const p of pharmacies) map.set(p.id, p);
    return map;
  }, [pharmacies]);

  const handleClusterPress = useCallback(
    (clusterId: number) => {
      const ids = getClusterPharmacyIds(clusterId);
      const list = ids
        .map((id) => pharmaciesById.get(id))
        .filter((p): p is (typeof pharmacies)[number] => !!p);

      if (list.length === 0) return;

      const coordinates = list
        .map((p) => ({
          latitude: parseFloat(p.Y),
          longitude: parseFloat(p.X),
        }))
        .filter((c) => !isNaN(c.latitude) && !isNaN(c.longitude));

      if (coordinates.length > 0) {
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: {
            top: insets.top + px(80),
            right: px(60),
            bottom: bottomTabSize.height + insets.bottom + px(360),
            left: px(60),
          },
          animated: true,
        });
      }

      openClusterList(list);
    },
    [getClusterPharmacyIds, pharmaciesById, openClusterList, mapRef, insets],
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
