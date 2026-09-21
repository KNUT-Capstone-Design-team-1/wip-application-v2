import React, { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { IPharmacyDataSourceFooterProps } from '@features/nearby_pharmacy/types/business_hours_type';
import { PHARMACY_DATA_SOURCE_TEXT } from '@features/nearby_pharmacy/constants/business_hours';
import { pharmacyBusinessHoursStyles as styles } from '@features/nearby_pharmacy/styles/PharmacyBusinessHours';

// 약국 데이터 출처 안내 푸터 컴포넌트
const PharmacyDataSourceFooter = ({
  sourceText = PHARMACY_DATA_SOURCE_TEXT,
}: IPharmacyDataSourceFooterProps) => {
  return (
    <View style={styles.sourceContainer}>
      <BaseText weight="regular" size={11} style={styles.sourceText}>
        {sourceText}
      </BaseText>
    </View>
  );
};

export default memo(PharmacyDataSourceFooter);
