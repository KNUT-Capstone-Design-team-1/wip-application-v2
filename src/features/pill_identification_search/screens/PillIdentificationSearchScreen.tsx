import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

const IdentificationSearchScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>IdentificationSearchScreen</Text>
    </View>
  );
};

export default IdentificationSearchScreen;
