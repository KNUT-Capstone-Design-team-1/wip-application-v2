import React, { memo } from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import PharmacyBusinessHourRow from '@features/nearby_pharmacy/components/atoms/PharmacyBusinessHourRow';
import PharmacyDataSourceFooter from '@features/nearby_pharmacy/components/atoms/PharmacyDataSourceFooter';
import { IPharmacyExpandedHoursListProps } from '@features/nearby_pharmacy/types/pharmacy_ui_type';
import { pharmacyBusinessHoursStyles as styles } from '@features/nearby_pharmacy/styles/PharmacyBusinessHours';

// 펼쳐진 전체 요일 영업시간 목록 및 출처 문구 컴포넌트
const PharmacyExpandedHoursList = ({
  businessHours,
}: IPharmacyExpandedHoursListProps) => {
  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      layout={LinearTransition.duration(200)}
      style={styles.hoursListContainer}
    >
      {/* 월요일~공휴일 영업시간 행 리스트 */}
      {businessHours.map((item) => (
        <PharmacyBusinessHourRow key={item.dayLabel} item={item} />
      ))}

      {/* 우측 하단 데이터 출처 문구 */}
      <PharmacyDataSourceFooter />
    </Animated.View>
  );
};

export default memo(PharmacyExpandedHoursList);
