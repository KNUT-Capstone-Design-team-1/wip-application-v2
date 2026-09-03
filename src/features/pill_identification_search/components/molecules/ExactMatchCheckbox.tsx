import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR } from '@constants/color';
import { IExactMatchCheckboxProps } from '@features/pill_identification_search/types';
import { styles } from '../../styles/molecules/ExactMatchCheckbox';

// 식별문자 완전 일치 여부 선택 체크박스 컴포넌트
const ExactMatchCheckbox = memo(
  ({ isExactMatch, onToggle }: IExactMatchCheckboxProps) => {
    return (
      <TouchableOpacity
        style={styles.textInputLabelCheckbox}
        onPress={onToggle}
      >
        <View
          style={[
            styles.textInputLabelCheckboxWrapper,
            {
              backgroundColor: isExactMatch ? COLOR['primary'] : 'transparent',
            },
          ]}
        >
          {isExactMatch && (
            <BaseText
              style={styles.textInputLabelCheckboxText}
              size={12}
              weight="bold"
            >
              ✓
            </BaseText>
          )}
        </View>
        <BaseText style={styles.textInputLabelText} size={14} weight="regular">
          식별문자 일치 (정확히 일치하는 문자만 검색)
        </BaseText>
      </TouchableOpacity>
    );
  },
);

ExactMatchCheckbox.displayName = 'ExactMatchCheckbox';

export default ExactMatchCheckbox;
