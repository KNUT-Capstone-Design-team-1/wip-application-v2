import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ScreenOptions from '@navigation/ScreenOptions'
import StatusBarStyle from '@components/StatusBarStyle';

import Home from '@screens/Home';


const Navigation = (): JSX.Element => {

    const Stack: any = createNativeStackNavigator();
    const screenOptions = ScreenOptions.initScreenOptions();

    /* 상태바 스타일 변경 */
    StatusBarStyle.initStyle();

    /* 바텀 네비게이션 스타일 변경. */
    changeNavigationBarColor('white', true);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={screenOptions}>

                {/* Home 화면 */}
                <Stack.Screen name="Home" component={Home} />

            </Stack.Navigator>
        </NavigationContainer>
    );
}


export default Navigation;
