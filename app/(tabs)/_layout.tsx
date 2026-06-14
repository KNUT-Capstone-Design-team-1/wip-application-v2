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
        name="pill-identification-search/index"
        options={{ title: '식별검색' }}
      />
      <Tabs.Screen
        name="pill-image-search/index"
        options={{ title: '이미지검색' }}
      />
      <Tabs.Screen
        name="nearby-pharmacy/index"
        options={{ title: '주변약국' }}
      />
      <Tabs.Screen name="pill-save/index" options={{ title: '보관함' }} />
    </Tabs>
  );
}
