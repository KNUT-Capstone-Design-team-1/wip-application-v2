import React from 'react';
import { View, ScrollView } from 'react-native';
import { IPharmacyClusterListProps } from '@features/nearby_pharmacy/types/nearby_pharmacy';
import PharmacyClusterListHeader from '@features/nearby_pharmacy/components/atoms/PharmacyClusterListHeader';
import { styles } from '@features/nearby_pharmacy/styles/PharmacyClusterList';
import PharmacyClusterListItem from '@features/nearby_pharmacy/components/atoms/PharmacyClusterListItem';
import { getFormattedDistance } from '@utils/location';

// 클러스터 마커를 클릭했을 때, 해당 위치에 겹쳐 있는 약국들의 목록을 하단에 보여주는 리스트 컴포넌트
const PharmacyClusterList = ({
  pharmacies,
  onPharmacyPress,
  onClosePress,
}: IPharmacyClusterListProps) => {
  return (
    <View style={styles.clusterListContainer}>
      <PharmacyClusterListHeader
        count={pharmacies.length}
        onClosePress={onClosePress}
      />
      <ScrollView
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        {pharmacies.map((item, index) => {
          const isLast = index === pharmacies.length - 1;

          let distanceText = '';
          if (item.distance !== undefined) {
            distanceText = getFormattedDistance(item.distance);
          }

          return (
            <PharmacyClusterListItem
              key={item.id}
              pharmacy={item}
              isLast={isLast}
              distanceText={distanceText}
              onPress={onPharmacyPress}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default PharmacyClusterList;
