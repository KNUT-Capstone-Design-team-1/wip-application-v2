import Home from "@/components/screens/Home";
import PillDetail from "@/components/screens/PillDetail";
import SearchId from "@/components/screens/SearchId";
import SearchImage from "@/components/screens/SearchImage";
import SearchCamera from "@/components/screens/SearchCamera";
import SearchCrop from "@/components/screens/SearchCrop";
import SearchResult from "@/components/screens/SearchResult";
import ScreenOptions from "@/navigation/ScreenOptions";
import { createStackNavigator } from "@react-navigation/stack";

const HomeStack: React.FC = () => {
  const Stack: any = createStackNavigator();
  const screenOptions = ScreenOptions.initScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions} >
      {/* Home 화면 */}
      <Stack.Screen
        name="홈"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      {/* 알약 식별 검색 화면 */}
      <Stack.Screen
        name="알약 식별 검색"
        component={SearchId}
        options={{
          headerShown: false,
        }}
      />
      {/* 알약 이미지 검색 화면 */}
      <Stack.Screen
        name="알약 이미지 검색"
        component={SearchImage}
        options={{
          headerShown: false,
        }}
      />
      {/* 카메라 화면 */}
      <Stack.Screen
        name="카메라"
        component={SearchCamera}
        presentation='modal'
        options={{
          headerShown: false,
          gestureEnabled: false,
          detachPreviousScreen: true,
        }}
      />
      <Stack.Screen
        name="알약 촬영"
        component={SearchCrop}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="알약 검색 결과"
        component={SearchResult}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="알약 정보"
        component={PillDetail}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}

export default HomeStack;