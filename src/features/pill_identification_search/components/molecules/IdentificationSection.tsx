import { Text, View } from 'react-native';
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
      <Text style={styles.titleText}>{title}</Text>
      <View style={styles.childrenContainer}>{children}</View>
    </View>
  );
};

export default IdentificationSection;
