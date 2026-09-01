import { styles } from '../styles/PillIdentificationSearchScreen';
import React from 'react';
import { View } from 'react-native';
import PillIdentificationSearchForm from '../components/organisms/PillIdentificationSearchForm';

const PillIdentificationSearchScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <PillIdentificationSearchForm />
    </View>
  );
};

export default PillIdentificationSearchScreen;
