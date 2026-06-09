import { Tabs } from 'expo-router';
import BottomTab from '@layouts/bottomTab/BottomTab';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomTab {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: '홈' }} />
      <Tabs.Screen
        name="pill-identification-search"
        options={{ title: '식별검색' }}
      />
      <Tabs.Screen name="pill-image-search" options={{ title: '이미지검색' }} />
      <Tabs.Screen name="pill-save" options={{ title: '보관함' }} />
      <Tabs.Screen name="setting" options={{ title: '설정' }} />
    </Tabs>
  );
}
