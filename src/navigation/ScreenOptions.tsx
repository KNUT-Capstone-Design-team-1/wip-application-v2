import { Animated } from 'react-native';

const forFade = ({ current, next }: any) => {
    const progress = Animated.add(
        current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1.8],
            extrapolate: 'clamp',
        }),
        next
            ? next.progress.interpolate({
                inputRange: [0.9, 1],
                outputRange: [0.9, 1],
                extrapolate: 'clamp',
            })
            : 0
    );

    const duration = 10;


    return {
        cardStyle: {
            opacity: progress,
        },
        timing: {
            duration: duration, // 애니메이션 duration 설정
        },
        useNativeDriver: true,
    }
};

const initScreenOptions = (): object => {
    const screenOptions: object = {
        headerTitle: '',
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTransparent: true,
        headerStyle: { backgroundColor: 'transparent' },
        //animationEnabled: false,
        cardStyleInterpolator: forFade,
    }

    return screenOptions;
}

export default { initScreenOptions };