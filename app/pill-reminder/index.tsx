import { useCallback } from 'react';
import { Stack, useFocusEffect } from 'expo-router';
import { useHeaderTitleStore } from '@layouts/header/store/header_title_store';
import { PillReminderListScreen } from '@features/pill_reminder/screens/PillReminderListScreen';

export default function PillReminderRoute() {
  const { setTitle, resetTitle } = useHeaderTitleStore();

  useFocusEffect(
    useCallback(() => {
      setTitle('복용 알림');
      return () => resetTitle();
    }, [resetTitle, setTitle]),
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PillReminderListScreen />
    </>
  );
}
