import HeaderLogo from '@/components/atoms/HeaderLogo';

const initScreenOptions = (): object => {
    const screenOptions: object = {
        headerTitle: '',
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTransparent: true,
        headerStyle: { backgroundColor: 'transparent' }
    }

    return screenOptions;
}

export default { initScreenOptions };