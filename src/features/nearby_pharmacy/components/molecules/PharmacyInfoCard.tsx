import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { IPharmacyInfoCardProps } from '@features/nearby_pharmacy/types/nearby_pharmacy';
import { styles } from '@features/nearby_pharmacy/styles/NearbyPharmacyScreen';

const PharmacyInfoCard = ({
  pharmacy,
  onCopyPress,
  onClosePress,
}: IPharmacyInfoCardProps) => {
  return (
    <View style={styles.infoContainer}>
      <View style={styles.infoContent}>
        <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
        <TouchableOpacity onPress={() => onCopyPress(pharmacy.telephone)}>
          <Text style={styles.pharmacyPhone}>
            {pharmacy.telephone || '전화번호 없음'} (누르면 복사)
          </Text>
        </TouchableOpacity>
        <Text style={styles.pharmacyAddress}>{pharmacy.address}</Text>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClosePress}>
        <Text style={styles.closeButtonText}>닫기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PharmacyInfoCard;
