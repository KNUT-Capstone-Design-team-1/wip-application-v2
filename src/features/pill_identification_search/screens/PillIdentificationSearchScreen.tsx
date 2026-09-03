import { styles } from '../styles/PillIdentificationSearchScreen';
import React from 'react';
import { View } from 'react-native';
import PillIdentificationSearchForm from '../components/organisms/PillIdentificationSearchForm';

// 알약 식별 검색 메인 화면 컴포넌트 (Presentation Layer)
const PillIdentificationSearchScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <PillIdentificationSearchForm />
    </View>
  );
};

export default PillIdentificationSearchScreen;
