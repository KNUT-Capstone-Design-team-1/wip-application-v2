import React, { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { IPharmacyBusinessHourRowProps } from '@features/nearby_pharmacy/types/business_hours_type';
import { pharmacyBusinessHoursStyles as styles } from '@features/nearby_pharmacy/styles/PharmacyBusinessHours';

// 요일별 영업시간 개별 항목 행 컴포넌트
const PharmacyBusinessHourRow = ({ item }: IPharmacyBusinessHourRowProps) => {
  const dayLabelStyle = [
    styles.hoursDayLabel,
    item.isToday && styles.hoursDayLabelToday,
  ];

  const timeTextStyle = [
    styles.hoursTimeText,
    item.isToday && styles.hoursTimeTextToday,
  ];

  return (
    <View style={styles.hoursRow}>
      {/* 요일 레이블 및 오늘 뱃지 */}
      <View style={styles.hoursDayLabelContainer}>
        <BaseText weight="regular" size={13} style={dayLabelStyle}>
          {item.dayLabel}
        </BaseText>

        {item.isToday && (
          <View style={styles.hoursTodayBadge}>
            <BaseText
              weight="bold"
              size={10}
              style={styles.hoursTodayBadgeText}
            >
              오늘
            </BaseText>
          </View>
        )}
      </View>

      {/* 영업 시간 텍스트 */}
      <BaseText weight="regular" size={13} style={timeTextStyle}>
        {item.timeText}
      </BaseText>
    </View>
  );
};

export default memo(PharmacyBusinessHourRow);
