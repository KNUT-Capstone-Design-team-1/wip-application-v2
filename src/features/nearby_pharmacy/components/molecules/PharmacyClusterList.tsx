import React, { memo } from 'react';
import { View, ScrollView } from 'react-native';
import { IPharmacyClusterListProps } from '@features/nearby_pharmacy/types/pharmacy_ui_type';
import PharmacyClusterListHeader from '@features/nearby_pharmacy/components/atoms/PharmacyClusterListHeader';
import { styles } from '@features/nearby_pharmacy/styles/PharmacyClusterList';
import PharmacyClusterListItem from '@features/nearby_pharmacy/components/atoms/PharmacyClusterListItem';
import { getFormattedDistance } from '@utils/location';
import { isPharmacyOpenNow } from '@features/nearby_pharmacy/utils/business_hours';
import { usePharmacyCurrentTime } from '@features/nearby_pharmacy/hooks/use_pharmacy_current_time';

// 클러스터 마커를 클릭했을 때 겹쳐 있는 약국들의 목록을 하단에 보여주는 리스트 컴포넌트
const PharmacyClusterList = ({
  pharmacies,
  onPharmacyPress,
  onClosePress,
}: IPharmacyClusterListProps) => {
  // 리스트 전체에서 단 1회만 시간 구독 (개별 아이템 다중 구독 방지)
  const currentTime = usePharmacyCurrentTime();

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

          const hasDistance = typeof item.distance === 'number';

          const distanceText = hasDistance
            ? getFormattedDistance(item.distance as number)
            : '';

          const isOpen = isPharmacyOpenNow(
            item.openTime,
            item.closeTime,
            currentTime,
          );

          return (
            <PharmacyClusterListItem
              key={item.id}
              pharmacy={item}
              isLast={isLast}
              isOpen={isOpen}
              distanceText={distanceText}
              onPress={onPharmacyPress}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default memo(PharmacyClusterList);
