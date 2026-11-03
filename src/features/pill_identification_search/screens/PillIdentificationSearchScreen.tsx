import { styles } from '../styles/PillIdentificationSearchScreen';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import PillIdentificationSearchForm from '../components/organisms/PillIdentificationSearchForm';
import { useHeaderActionStore } from '@layouts/header/store/header_action_store';
import { identificationGuide } from '../guide';

const PillIdentificationSearchScreen: React.FC = () => {
  const replay = identificationGuide.useReplay();

  useFocusEffect(
    useCallback(() => {
      useHeaderActionStore.getState().setHelp(replay);

      return () => {
        if (useHeaderActionStore.getState().onHelp === replay) {
          useHeaderActionStore.getState().setHelp(null);
        }
      };
    }, [replay]),
  );

  return (
    <View style={styles.container}>
      <PillIdentificationSearchForm />
    </View>
  );
};

export default identificationGuide.wrap(PillIdentificationSearchScreen);
