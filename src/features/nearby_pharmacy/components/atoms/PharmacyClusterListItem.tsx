import React, { memo, useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/nearby_pharmacy/styles/PharmacyClusterList';
import { IPharmacyClusterListItemProps } from '@features/nearby_pharmacy/types/pharmacy_ui_type';

// 클러스터 마커 클릭 시 하단 목록에 표시되는 개별 약국 항목 컴포넌트
const PharmacyClusterListItem = ({
  pharmacy,
  isLast,
  isOpen,
  distanceText,
  onPress,
}: IPharmacyClusterListItemProps) => {
  // 거리 정보 존재 여부
  const hasDistance = Boolean(distanceText);

  // 약국 선택 핸들러
  const handleItemPress = useCallback(() => {
    onPress(pharmacy);
  }, [onPress, pharmacy]);

  return (
    <View
      style={[styles.clusterListItem, isLast && styles.clusterListItemLast]}
    >
      <TouchableOpacity onPress={handleItemPress} activeOpacity={0.7}>
        {/* 첫 번째 줄: 약국 이름 / 거리 (좌측) & 영업 상태 (우측 끝) */}
        <View style={styles.clusterListItemHeader}>
          {/* 좌측: 약국명 및 거리 정보 묶음 */}
          <View style={styles.clusterListItemNameRow}>
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

          {/* 우측 끝: 영업 상태 뱃지 텍스트 (영업 중 / 영업 종료) */}
          <BaseText
            weight="bold"
            size={13}
            style={[
              styles.clusterListItemStatus,
              isOpen ? styles.statusOpen : styles.statusClosed,
            ]}
          >
            {isOpen ? '영업 중' : '영업 종료'}
          </BaseText>
        </View>

        {/* 두 번째 줄: 약국 주소 */}
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
