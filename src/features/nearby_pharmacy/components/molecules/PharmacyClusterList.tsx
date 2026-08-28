import React from 'react';
import { View, ScrollView } from 'react-native';
import { IPharmacyClusterListProps } from '@features/nearby_pharmacy/types/nearby_pharmacy';
import PharmacyClusterListHeader from '@features/nearby_pharmacy/components/atoms/PharmacyClusterListHeader';
import { styles } from '@features/nearby_pharmacy/styles/PharmacyClusterList';
import { usePharmacyCall } from '@features/nearby_pharmacy/hooks/use_pharmacy_call';
import PharmacyClusterListItem from '@features/nearby_pharmacy/components/atoms/PharmacyClusterListItem';
import {
  getDistance,
  getFormattedDistance,
} from '@features/nearby_pharmacy/utils/location';
import { usePharmacyDistanceSort } from '@features/nearby_pharmacy/hooks/use_pharmacy_distance_sort';

// 클러스터 마커를 클릭했을 때, 해당 위치에 겹쳐 있는 약국들의 목록을 하단에 보여주는 리스트 컴포넌트
const PharmacyClusterList = ({
  pharmacies,
  onPharmacyPress,
  onClosePress,
  userLocation,
}: IPharmacyClusterListProps) => {
  const { callPharmacy } = usePharmacyCall();
  const sortedPharmacies = usePharmacyDistanceSort(pharmacies, userLocation);

  return (
    <View style={styles.clusterListContainer}>
      <PharmacyClusterListHeader
        count={sortedPharmacies.length}
        onClosePress={onClosePress}
      />
      <ScrollView
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        {sortedPharmacies.map((item, index) => {
          const isLast = index === sortedPharmacies.length - 1;

          let distanceText = '';
          if (userLocation) {
            const dist = getDistance(
              userLocation.coords.latitude,
              userLocation.coords.longitude,
              parseFloat(item.Y),
              parseFloat(item.X),
            );
            distanceText = getFormattedDistance(dist);
          }

          return (
            <PharmacyClusterListItem
              key={item.id}
              pharmacy={item}
              isLast={isLast}
              distanceText={distanceText}
              onPress={onPharmacyPress}
              onCallPress={callPharmacy}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default PharmacyClusterList;
