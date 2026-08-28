import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { INearbyPharmacies } from '@services/database/types';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/nearby_pharmacy/styles/PharmacyClusterList';

interface IPharmacyClusterListItemProps {
  pharmacy: INearbyPharmacies;
  isLast: boolean;
  distanceText: string;
  onPress: (pharmacy: INearbyPharmacies) => void;
  onCallPress: (telephone: string) => void;
}

// 클러스터 마커 클릭 시 나타나는 리스트 내의 개별 약국 아이템 렌더링 컴포넌트
const PharmacyClusterListItem = ({
  pharmacy,
  isLast,
  distanceText,
  onPress,
  onCallPress,
}: IPharmacyClusterListItemProps) => {
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
          {!!distanceText && (
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
      {!!pharmacy.telephone && (
        <TouchableOpacity
          style={styles.clusterListItemPhoneButton}
          onPress={() => onCallPress(pharmacy.telephone)}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          activeOpacity={0.6}
        >
          <BaseText
            weight="medium"
            size={13}
            style={styles.clusterListItemPhone}
          >
            {pharmacy.telephone}
          </BaseText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PharmacyClusterListItem;
