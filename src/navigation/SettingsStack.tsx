import Settings from '@/components/screens/Settings';
import Terms from '@/components/screens/Terms';
import ScreenOptions from '@/navigation/ScreenOptions';
import { createStackNavigator } from '@react-navigation/stack';
import Notices from "@components/screens/Notices";

const SettingsStack: React.FC = () => {
  const Stack: any = createStackNavigator();
  const screenOptions = ScreenOptions.initScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {/* 설정 화면 */}
      <Stack.Screen
        name="설정"
        component={Settings}
        options={{ headerShown: false }}
      />
      {/* 이용약관 화면 */}
      <Stack.Screen
        name="이용약관"
        component={Terms}
        options={{ headerShown: false }}
      />
      {/* 이용약관 화면 */}
      <Stack.Screen
        name="공지사항"
        component={Notices}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default SettingsStack;
