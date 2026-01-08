import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

const IdentificationSearchScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    ></View>
  );
};

export default IdentificationSearchScreen;
