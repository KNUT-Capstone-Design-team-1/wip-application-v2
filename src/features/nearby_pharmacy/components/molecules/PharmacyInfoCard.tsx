import React, { useCallback } from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';
import { IPharmacyInfoCardProps } from '@features/nearby_pharmacy/types/nearby_pharmacy';
import { styles } from '@features/nearby_pharmacy/styles/NearbyPharmacyScreen';
import { X } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { BaseText } from '@components/common/BaseText';
import { useToast } from '@hooks/use_toast';
import logger from '@utils/logger';

const PharmacyInfoCard = ({
  pharmacy,
  onCopyPress,
  onClosePress,
}: IPharmacyInfoCardProps) => {
  const { showToast } = useToast();

  const handleCallPress = useCallback(
    async (telephone: string) => {
      const digits = telephone.replace(/[^0-9+*#]/g, '');
      if (!digits) return;

      try {
        await Linking.openURL(`tel:${digits}`);
      } catch (e) {
        logger.error(`Failed to open dialer. ${e?.stack || e}`);
        showToast({ type: 'error', message: '전화 앱을 열 수 없습니다.' });
      }
    },
    [showToast],
  );

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
          onPress={() => handleCallPress(pharmacy.telephone)}
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
