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
        name="nearby-pharmacy/index"
        options={{ title: '주변약국' }}
      />
      <Tabs.Screen name="pill-save/index" options={{ title: '보관함' }} />
      <Tabs.Screen name="setting/index" options={{ title: '설정' }} />
    </Tabs>
  );
}
