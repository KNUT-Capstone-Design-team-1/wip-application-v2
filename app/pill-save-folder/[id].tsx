import PillSaveFolderDetail from '@features/pill_save/screens/PillSaveFolderDetail';
import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useHeaderTitleStore } from '@layouts/header/store/header_title_store';
import { useCallback } from 'react';

export default function FolderDetailRoute() {
  const { name } = useLocalSearchParams();
  const folderName = Array.isArray(name) ? name[0] : name;
  const { setTitle, resetTitle } = useHeaderTitleStore();

  useFocusEffect(
    useCallback(() => {
      if (folderName) {
        setTitle(folderName);
      }
      return () => resetTitle();
    }, [folderName, resetTitle, setTitle]),
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PillSaveFolderDetail />
    </>
  );
}
