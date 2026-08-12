import React from 'react';
import { View, ActivityIndicator, Pressable } from 'react-native';
import MapView from 'react-native-maps';
import { useNearbyPharmacy } from '@features/nearby_pharmacy/hooks/use_nearby_pharmacy';
import { styles } from '@features/nearby_pharmacy/styles/NearbyPharmacyScreen';
import { COLOR } from '@constants/color';
import PharmacyMarkers from '@features/nearby_pharmacy/components/molecules/PharmacyMarkers';
import PharmacyInfoCard from '@features/nearby_pharmacy/components/molecules/PharmacyInfoCard';
import { px } from '@utils/responsive';
import { bottomTabSize } from '@constants/size';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LocateFixed } from 'lucide-react-native';
/*
TODO: Custom marker 필요
TODO: marker 위치가 정확한지 확인 필요
TODO: 현재 위치를 기준으로 반경 몇 m이내의 약국만 표시된다는 안내 필요
TODO: 확대/축소 기준에 맞게 클러스터링 필요
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
    handleLocate,
    handleCopy,
    handleMarkerPress,
    handleCloseInfoCard,
  } = useNearbyPharmacy();
  const insets = useSafeAreaInsets();

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
          pharmacies={pharmacies}
          onMarkerPress={handleMarkerPress}
        />
      </MapView>

      <View style={styles.bottomOverlay}>
        {selectedPharmacy && (
          <PharmacyInfoCard
            pharmacy={selectedPharmacy}
            onCopyPress={handleCopy}
            onClosePress={handleCloseInfoCard}
          />
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
