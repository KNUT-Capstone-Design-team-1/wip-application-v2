import { useCallback } from 'react';
import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useHeaderTitleStore } from '@layouts/header/store/header_title_store';
import { PillReminderSettingScreen } from '@features/pill_reminder/screens/PillReminderSettingScreen';

export default function PillReminderSettingRoute() {
  const { reminderId } = useLocalSearchParams<{ reminderId?: string }>();
  const { setTitle, resetTitle } = useHeaderTitleStore();

  useFocusEffect(
    useCallback(() => {
      setTitle(reminderId ? '복용 알림 수정' : '알약 복용 알림 설정');
      return () => resetTitle();
    }, [reminderId, resetTitle, setTitle]),
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PillReminderSettingScreen />
    </>
  );
}
