import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { IPharmacyInfoCardProps } from '@features/nearby_pharmacy/types/nearby_pharmacy';
import { styles } from '@features/nearby_pharmacy/styles/NearbyPharmacyScreen';
import { X } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { BaseText } from '@components/common/BaseText';
import { usePharmacyCall } from '@features/nearby_pharmacy/hooks/use_pharmacy_call';

const PharmacyInfoCard = ({
  pharmacy,
  onCopyPress,
  onClosePress,
}: IPharmacyInfoCardProps) => {
  const { callPharmacy } = usePharmacyCall();

  return (
    <View style={styles.infoContainer}>
      <View style={styles.infoContent}>
        <TouchableOpacity
          style={styles.copyButton}
          onPress={() => onCopyPress(pharmacy.name)}
        >
          <BaseText weight="bold" size={18} style={styles.pharmacyName}>
            {pharmacy.name}
          </BaseText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.copyButton}
          disabled={!pharmacy.telephone}
          onPress={() => callPharmacy(pharmacy.telephone)}
        >
          <BaseText
            weight="medium"
            size={14}
            style={[
              styles.pharmacyPhone,
              !pharmacy.telephone && {
                color: COLOR_TEXT['disabled'],
              },
            ]}
          >
            {pharmacy.telephone || '전화번호 없음'}
          </BaseText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.copyButton}
          disabled={!pharmacy.address}
          onPress={() => onCopyPress(pharmacy.address)}
        >
          <BaseText weight="semiBold" size={14} style={styles.pharmacyAddress}>
            {pharmacy.address}
          </BaseText>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClosePress}>
        <X size={fontPx(16)} color={COLOR_TEXT['sub']} strokeWidth={4} />
      </TouchableOpacity>
    </View>
  );
};

export default PharmacyInfoCard;
