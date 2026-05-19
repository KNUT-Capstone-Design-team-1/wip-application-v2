import React from 'react';
import { View } from 'react-native';
import PillIdentificationSearchForm from '../components/organisms/PillIdentificationSearchForm';

const PillIdentificationSearchScreen: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <PillIdentificationSearchForm />
    </View>
  );
};

export default PillIdentificationSearchScreen;
