import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { IPharmacyInfoCardProps } from '@features/nearby_pharmacy/types/nearby_pharmacy';
import { styles } from '@features/nearby_pharmacy/styles/NearbyPharmacyScreen';
import { X } from 'lucide-react-native';
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
        <TouchableOpacity
          style={styles.copyButton}
          onPress={() => onCopyPress(pharmacy.name)}
        >
          <Text
            style={[styles.pharmacyName, { textDecorationLine: 'underline' }]}
          >
            {pharmacy.name}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.copyButton}
          disabled={!pharmacy.telephone}
          onPress={() => onCopyPress(pharmacy.telephone)}
        >
          <Text
            style={[
              styles.pharmacyPhone,
              { textDecorationLine: 'underline' },
              !pharmacy.telephone && {
                color: COLOR_GRAY[300],
                textDecorationLine: 'none',
              },
            ]}
          >
            {pharmacy.telephone || '전화번호 없음'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.copyButton}
          disabled={!pharmacy.address}
          onPress={() => onCopyPress(pharmacy.address)}
        >
          <Text
            style={[
              styles.pharmacyAddress,
              { textDecorationLine: 'underline' },
            ]}
          >
            {pharmacy.address}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClosePress}>
        <X size={fontPx(16)} color={COLOR_PRIMARY[400]} strokeWidth={4} />
      </TouchableOpacity>
    </View>
  );
};

export default PharmacyInfoCard;
