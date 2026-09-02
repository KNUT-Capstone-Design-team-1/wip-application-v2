import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { INearbyPharmacies } from '@services/database/types';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/nearby_pharmacy/styles/PharmacyClusterList';

interface IPharmacyClusterListItemProps {
  pharmacy: INearbyPharmacies;
  isLast: boolean;
  distanceText: string;
  onPress: (pharmacy: INearbyPharmacies) => void;
}

// 클러스터 마커 클릭 시 나타나는 리스트 내의 개별 약국 아이템 렌더링 컴포넌트
const PharmacyClusterListItem = ({
  pharmacy,
  isLast,
  distanceText,
  onPress,
}: IPharmacyClusterListItemProps) => {
  const hasDistance = Boolean(distanceText);

  return (
    <View
      style={[styles.clusterListItem, isLast && styles.clusterListItemLast]}
    >
      <TouchableOpacity onPress={() => onPress(pharmacy)} activeOpacity={0.7}>
        <View style={styles.clusterListItemHeader}>
          <BaseText
            weight="bold"
            size={15}
            style={styles.clusterListItemName}
            numberOfLines={1}
          >
            {pharmacy.name}
          </BaseText>
          {hasDistance && (
            <BaseText
              weight="medium"
              size={12}
              style={styles.clusterListItemDistance}
            >
              {distanceText}
            </BaseText>
          )}
        </View>
        <BaseText
          weight="medium"
          size={13}
          style={styles.clusterListItemAddress}
          numberOfLines={1}
        >
          {pharmacy.address}
        </BaseText>
      </TouchableOpacity>
    </View>
  );
};

export default memo(PharmacyClusterListItem);
