import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { IPharmacyInfoCardProps } from '@features/nearby_pharmacy/types/nearby_pharmacy';
import { X } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { usePharmacyCall } from '@features/nearby_pharmacy/hooks/use_pharmacy_call';
import PharmacyInfoRow from '@features/nearby_pharmacy/components/atoms/PharmacyInfoRow';
import { styles } from '@features/nearby_pharmacy/styles/PharmacyInfoCard';

// 지도에서 단일 약국 마커를 선택했을 때 하단에 나타나는 상세 정보 카드
const PharmacyInfoCard = ({
  pharmacy,
  onCopyPress,
  onClosePress,
}: IPharmacyInfoCardProps) => {
  const { callPharmacy } = usePharmacyCall();

  return (
    <View style={styles.infoContainer}>
      <View style={styles.infoContent}>
        <PharmacyInfoRow
          text={pharmacy.name}
          onPress={() => onCopyPress(pharmacy.name)}
          weight="bold"
          size={18}
          textStyle={styles.pharmacyName}
        />

        <PharmacyInfoRow
          text={pharmacy.telephone || '전화번호 없음'}
          onPress={() => callPharmacy(pharmacy.telephone)}
          disabled={!pharmacy.telephone}
          weight="medium"
          size={14}
          textStyle={[
            styles.pharmacyPhone,
            !pharmacy.telephone && {
              color: COLOR_TEXT['disabled'],
            },
          ]}
        />

        <PharmacyInfoRow
          text={pharmacy.address}
          onPress={() => onCopyPress(pharmacy.address)}
          disabled={!pharmacy.address}
          weight="semiBold"
          size={14}
          textStyle={styles.pharmacyAddress}
        />
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClosePress}>
        <X size={fontPx(16)} color={COLOR_TEXT['sub']} strokeWidth={4} />
      </TouchableOpacity>
    </View>
  );
};

export default PharmacyInfoCard;
