import React, { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { IPharmacyHoursHeaderRowProps } from '@features/nearby_pharmacy/types/business_hours_type';
import { styles } from '@features/nearby_pharmacy/styles/PharmacyInfoCard';

// 영업시간 요약 정보 표시 및 펼치기/접기 토글 행 컴포넌트
const PharmacyHoursHeaderRow = ({
  label,
  text,
  isExpanded,
  onToggle,
}: IPharmacyHoursHeaderRowProps) => {
  return (
    <TouchableOpacity
      style={styles.pharmacyHoursRow}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <BaseText weight="semiBold" size={14} style={styles.pharmacyHoursText}>
        {label}: {text}
      </BaseText>

      {isExpanded ? (
        <ChevronUp size={fontPx(14)} color={COLOR_TEXT.sub} />
      ) : (
        <ChevronDown size={fontPx(14)} color={COLOR_TEXT.sub} />
      )}
    </TouchableOpacity>
  );
};

export default memo(PharmacyHoursHeaderRow);
