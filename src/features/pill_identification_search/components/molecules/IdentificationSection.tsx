import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import React, { ReactNode } from 'react';
import { styles } from '../../styles/molecules/IdentificationSection';

interface IIdentificationSectionProps {
  children: ReactNode;
  title: string;
  direction?: 'row' | 'column';
  selectedIndex?: number[];
}

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
