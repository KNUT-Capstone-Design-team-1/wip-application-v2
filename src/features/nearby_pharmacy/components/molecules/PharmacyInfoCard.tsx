import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { IPharmacyInfoCardProps } from '@features/nearby_pharmacy/types/nearby_pharmacy';
import { styles } from '@features/nearby_pharmacy/styles/NearbyPharmacyScreen';
import { Copy, X } from 'lucide-react-native';
import { COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';
import { fontPx } from '@utils/responsive';

const PharmacyInfoCard = ({
  pharmacy,
  onCopyPress,
  onClosePress,
}: IPharmacyInfoCardProps) => {
  return (
    <View style={styles.infoContainer}>
      <View style={styles.infoContent}>
        <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
        <TouchableOpacity
          style={styles.pharmacyPhoneCopyButton}
          disabled={!pharmacy.telephone}
          onPress={() => onCopyPress(pharmacy.telephone)}
        >
          <Text
            style={[
              styles.pharmacyPhone,
              !pharmacy.telephone && { color: COLOR_GRAY[300] },
            ]}
          >
            {pharmacy.telephone || '전화번호 없음'}
          </Text>
          {pharmacy.telephone && (
            <Copy
              size={fontPx(14)}
              color={COLOR_PRIMARY[200]}
              strokeWidth={3}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.pharmacyAddress}>{pharmacy.address}</Text>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClosePress}>
        <X size={fontPx(16)} color={COLOR_PRIMARY[400]} strokeWidth={4} />
      </TouchableOpacity>
    </View>
  );
};

export default PharmacyInfoCard;
