import React, { memo } from 'react';
import { View } from 'react-native';
import PharmacyOpenOnlyCheckbox from '@features/nearby_pharmacy/components/atoms/PharmacyOpenOnlyCheckbox';
import PharmacyLocateButton from '@features/nearby_pharmacy/components/atoms/PharmacyLocateButton';
import PharmacyClusterList from '@features/nearby_pharmacy/components/molecules/PharmacyClusterList';
import PharmacyInfoCard from '@features/nearby_pharmacy/components/molecules/PharmacyInfoCard';
import { styles } from '@features/nearby_pharmacy/styles/NearbyPharmacyScreen';
import { IPharmacyMapBottomOverlayProps } from '@features/nearby_pharmacy/types/pharmacy_ui_type';

// 지도 하단 플로팅 컨트롤 및 상세 카드/클러스터 목록 오버레이
const PharmacyMapBottomOverlay = ({
  bottomInset,
  isOpenOnly,
  onToggleOpenOnly,
  onLocate,
  clusterPharmacies,
  selectedPharmacy,
  onClusterPharmacySelect,
  onCloseClusterList,
  onCopyPharmacyInfo,
  onClosePharmacyCard,
  isStockInquiryMode,
  onOpenInquiryModal,
}: IPharmacyMapBottomOverlayProps) => {
  return (
    <View
      style={[styles.bottomOverlay, { bottom: bottomInset }]}
      pointerEvents="box-none"
    >
      {/* 우측 하단 플로팅 컨트롤: 영업 중인 약국만 표시 체크박스 & 내 위치 이동 버튼 */}
      <View style={styles.floatingControlsContainer} pointerEvents="box-none">
        <PharmacyOpenOnlyCheckbox
          checked={isOpenOnly}
          onToggle={onToggleOpenOnly}
        />

        <PharmacyLocateButton onPress={onLocate} />
      </View>

      {/* 하단 약국 상세 정보 카드 또는 클러스터(묶음) 목록 */}
      {clusterPharmacies ? (
        <PharmacyClusterList
          pharmacies={clusterPharmacies}
          onPharmacyPress={onClusterPharmacySelect}
          onClosePress={onCloseClusterList}
        />
      ) : (
        selectedPharmacy && (
          <PharmacyInfoCard
            pharmacy={selectedPharmacy}
            onCopyPress={onCopyPharmacyInfo}
            onClosePress={onClosePharmacyCard}
            onStockInquiryPress={
              isStockInquiryMode ? onOpenInquiryModal : undefined
            }
          />
        )
      )}
    </View>
  );
};

export default memo(PharmacyMapBottomOverlay);
