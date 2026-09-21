import React, { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { IPharmacyOpenOnlyCheckboxProps } from '@features/nearby_pharmacy/types/business_hours_type';
import { styles } from '@features/nearby_pharmacy/styles/PharmacyOpenOnlyCheckbox';

// 지금 영업 중인(열려있는) 약국만 필터링하는 체크박스 컴포넌트
const PharmacyOpenOnlyCheckbox = ({
  checked,
  onToggle,
}: IPharmacyOpenOnlyCheckboxProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onToggle}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {/* 체크박스 박스 */}
      <View
        style={[
          styles.checkboxWrapper,
          checked ? styles.checkboxChecked : styles.checkboxUnchecked,
        ]}
      >
        {checked && (
          <BaseText style={styles.checkboxCheckmark} size={12} weight="bold">
            ✓
          </BaseText>
        )}
      </View>

      {/* 라벨 텍스트 */}
      <BaseText weight="medium" size={13} style={styles.label}>
        지금 열려있는 약국만 보기
      </BaseText>
    </TouchableOpacity>
  );
};

export default memo(PharmacyOpenOnlyCheckbox);
