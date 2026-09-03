import React from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { IIdentificationSectionProps } from '@features/pill_identification_search/types';
import { styles } from '../../styles/molecules/IdentificationSection';

// 식별 검색 섹션 래퍼 컴포넌트 (Molecule)
const IdentificationSection = ({
  children,
  title,
}: IIdentificationSectionProps) => {
  return (
    <View style={styles.identificationSection}>
      <BaseText style={styles.titleText} size={16} weight="semiBold">
        {title}
      </BaseText>
      <View style={styles.childrenContainer}>{children}</View>
    </View>
  );
};

export default IdentificationSection;
