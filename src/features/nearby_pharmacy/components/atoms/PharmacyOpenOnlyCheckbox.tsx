import React, { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { IPharmacyOpenOnlyCheckboxProps } from '@features/nearby_pharmacy/types/pharmacy_ui_type';
import { styles } from '@features/nearby_pharmacy/styles/PharmacyOpenOnlyCheckbox';

// 영업 중인 약국만 필터링하는 토글 체크박스 컴포넌트
const PharmacyOpenOnlyCheckbox = ({
  checked,
  onToggle,
}: IPharmacyOpenOnlyCheckboxProps) => {
  return (
    // 터치 시 컴포넌트 전체 영역에서 토글 이벤트 수신
    <TouchableOpacity
      style={styles.container}
      onPress={onToggle}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {/* 필터 라벨 텍스트 ('현재 지도에서 검색'과 동일한 스타일 적용) */}
      <BaseText weight="bold" size={13} style={styles.label}>
        영업 중인 약국만 표시
      </BaseText>

      {/* 우측 체크박스 아이콘 박스 */}
      <View
        style={[
          styles.checkboxWrapper,
          checked ? styles.checkboxChecked : styles.checkboxUnchecked,
        ]}
      >
        {/* 체크 상태일 때만 체크마크 텍스트 표시 */}
        {checked && (
          <BaseText style={styles.checkboxCheckmark} size={12} weight="bold">
            ✓
          </BaseText>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default memo(PharmacyOpenOnlyCheckbox);
