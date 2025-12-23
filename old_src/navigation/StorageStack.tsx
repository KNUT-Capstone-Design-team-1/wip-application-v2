import PillDetail from '@/components/screens/PillDetail';
import Storage from '@/components/screens/Storage';
import ScreenOptions from '@/navigation/ScreenOptions';
import { createStackNavigator } from '@react-navigation/stack';

const StorageStack: React.FC = () => {
  const Stack: any = createStackNavigator();
  const screenOptions = ScreenOptions.initScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {/* 알약 보관함 화면 */}
      <Stack.Screen
        name="보관함"
        component={Storage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="알약 정보"
        component={PillDetail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StorageStack;
