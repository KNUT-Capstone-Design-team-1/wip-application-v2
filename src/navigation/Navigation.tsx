import 'react-native-gesture-handler';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ScreenOptions from '@navigation/ScreenOptions'
import StatusBarStyle from '@/components/atoms/StatusBarStyle';

import Home from '@/components/screens/Home';
import Search from '@/components/screens/Search';
import Storage from '@/components/screens/Storage';
import Settings from '@/components/screens/Settings';
import SearchCamera from '@/components/screens/SearchCamera';
import SearchCrop from '@/components/screens/SearchCrop';
import SearchResult from '@/components/screens/SearchResult';


const Navigation = (): JSX.Element => {
    const Stack: any = createStackNavigator();
    const screenOptions = ScreenOptions.initScreenOptions();

    const theme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: 'transparent',
        },
    };


    /* 상태바 스타일 변경 */
    StatusBarStyle.initStyle();

    /* 바텀 네비게이션 스타일 변경. */
    changeNavigationBarColor('white', true);

    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator screenOptions={screenOptions} >
                {/* Home 화면 */}
                <Stack.Screen
                    name="홈"
                    component={Home}
                    options={{
                        headerShown: false,
                    }}
                />
                {/* 알약 검색 화면 */}
                <Stack.Screen
                    name="알약 검색"
                    component={Search}
                    options={{
                        headerShown: false,
                    }}
                />
                {/* 알약 보관함 화면 */}
                <Stack.Screen
                    name="보관함"
                    component={Storage}
                    options={{
                        headerShown: false,
                    }}
                />
                {/* 설정 화면 */}
                <Stack.Screen
                    name="설정"
                    component={Settings}
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
            </Stack.Navigator>
        </NavigationContainer>
    );
}


export default Navigation;
