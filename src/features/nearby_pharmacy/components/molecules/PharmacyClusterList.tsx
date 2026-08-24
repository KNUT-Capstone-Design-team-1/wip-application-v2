import React, { useCallback } from 'react';
import { View, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { X } from 'lucide-react-native';
import { IPharmacyClusterListProps } from '@features/nearby_pharmacy/types/nearby_pharmacy';
import { styles } from '@features/nearby_pharmacy/styles/NearbyPharmacyScreen';
import { COLOR_TEXT } from '@constants/color';
import { BaseText } from '@components/common/BaseText';
import { fontPx } from '@utils/responsive';
import { useToast } from '@hooks/use_toast';
import logger from '@utils/logger';

const PharmacyClusterList = ({
  pharmacies,
  onPharmacyPress,
  onClosePress,
}: IPharmacyClusterListProps) => {
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
        {pharmacies.map((item, index) => {
          const isLast = index === pharmacies.length - 1;

          return (
            <View
              key={item.id}
              style={[
                styles.clusterListItem,
                isLast && styles.clusterListItemLast,
              ]}
            >
              <TouchableOpacity
                onPress={() => onPharmacyPress(item)}
                activeOpacity={0.7}
              >
                <BaseText
                  weight="bold"
                  size={15}
                  style={styles.clusterListItemName}
                  numberOfLines={1}
                >
                  {item.name}
                </BaseText>
                <BaseText
                  weight="medium"
                  size={13}
                  style={styles.clusterListItemAddress}
                  numberOfLines={1}
                >
                  {item.address}
                </BaseText>
              </TouchableOpacity>
              {!!item.telephone && (
                <TouchableOpacity
                  style={styles.clusterListItemPhoneButton}
                  onPress={() => handleCallPress(item.telephone)}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  activeOpacity={0.6}
                >
                  <BaseText
                    weight="medium"
                    size={13}
                    style={styles.clusterListItemPhone}
                  >
                    {item.telephone}
                  </BaseText>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default PharmacyClusterList;
