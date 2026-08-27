import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { INearbyPharmacies } from '@services/database/types';
import { styles } from '@features/nearby_pharmacy/styles/PharmacyClusterList';

interface IPharmacyClusterListItemProps {
  pharmacy: INearbyPharmacies;
  isLast: boolean;
  onPress: (pharmacy: INearbyPharmacies) => void;
}

// 클러스터 약국 리스트의 개별 아이템 컴포넌트
const PharmacyClusterListItem = ({
  pharmacy,
  isLast,
  onPress,
}: IPharmacyClusterListItemProps) => {
  return (
    <View
      style={[styles.clusterListItem, isLast && styles.clusterListItemLast]}
    >
      <TouchableOpacity onPress={() => onPress(pharmacy)} activeOpacity={0.7}>
        <BaseText
          weight="bold"
          size={15}
          style={styles.clusterListItemName}
          numberOfLines={1}
        >
          {pharmacy.name}
        </BaseText>
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
