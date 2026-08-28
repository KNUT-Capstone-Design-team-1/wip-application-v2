import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { BaseText } from '@components/common/BaseText';
import { fontPx } from '@utils/responsive';
import { styles } from '@features/nearby_pharmacy/styles/PharmacyClusterList';

interface IPharmacyClusterListHeaderProps {
  count: number;
  onClosePress: () => void;
}

// 약국 클러스터 리스트 상단의 개수 및 닫기 버튼을 렌더링하는 헤더 컴포넌트
const PharmacyClusterListHeader = ({
  count,
  onClosePress,
}: IPharmacyClusterListHeaderProps) => {
  return (
    <View style={styles.clusterListHeader}>
      <BaseText weight="medium" size={12} style={styles.clusterListTitle}>
        {`${count}곳`}
      </BaseText>
      <TouchableOpacity
        style={styles.clusterListCloseButton}
        onPress={onClosePress}
      >
        <X size={fontPx(14)} color={COLOR_TEXT['sub']} strokeWidth={4} />
      </TouchableOpacity>
    </View>
  );
};

export default PharmacyClusterListHeader;
