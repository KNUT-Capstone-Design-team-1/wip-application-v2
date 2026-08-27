import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { IPharmacyClusterListProps } from '@features/nearby_pharmacy/types/nearby_pharmacy';
import { COLOR_TEXT } from '@constants/color';
import { BaseText } from '@components/common/BaseText';
import { fontPx } from '@utils/responsive';
import PharmacyClusterListItem from '@features/nearby_pharmacy/components/atoms/PharmacyClusterListItem';
import { styles } from '@features/nearby_pharmacy/styles/PharmacyClusterList';

// 클러스터 마커를 클릭했을 때, 해당 위치에 겹쳐 있는 약국들의 목록을 하단에 보여주는 리스트 컴포넌트
const PharmacyClusterList = ({
  pharmacies,
  onPharmacyPress,
  onClosePress,
}: IPharmacyClusterListProps) => {
  return (
    <View style={styles.clusterListContainer}>
      <View style={styles.clusterListHeader}>
        <BaseText weight="medium" size={12} style={styles.clusterListTitle}>
          {`${pharmacies.length}곳`}
        </BaseText>
        <TouchableOpacity
          style={styles.clusterListCloseButton}
          onPress={onClosePress}
        >
          <X size={fontPx(14)} color={COLOR_TEXT['sub']} strokeWidth={4} />
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        {pharmacies.map((item, index) => (
          <PharmacyClusterListItem
            key={item.id}
            pharmacy={item}
            isLast={index === pharmacies.length - 1}
            onPress={onPharmacyPress}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default PharmacyClusterList;
