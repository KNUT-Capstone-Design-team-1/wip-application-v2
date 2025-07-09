import 'react-native-gesture-handler';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

import StatusBarStyle from '@/components/atoms/StatusBarStyle';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from '@/navigation/HomeStack';
import StorageStack from '@/navigation/StorageStack';
import SettingsStack from '@/navigation/SettingsStack';

const Navigation = (): JSX.Element => {
  const Tab = createBottomTabNavigator();

  const theme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: 'transparent' },
  };

  /* 상태바 스타일 변경 */
  StatusBarStyle.initStyle();

  /* 바텀 네비게이션 스타일 변경. */
  changeNavigationBarColor('white', true);

  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        tabBar={() => <></>}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="HomeStack" component={HomeStack} />
        <Tab.Screen
          name="StorageStack"
          component={StorageStack}
          options={{ tabBarStyle: { display: 'none' } }}
        />
        <Tab.Screen
          name="SettingsStack"
          component={SettingsStack}
          options={{ tabBarStyle: { display: 'none' } }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
