import HeaderLogo from '@components/HeaderLogo';

const initScreenOptions = (): object => {
    const screenOptions: object = {
        headerTitle: () => <HeaderLogo />,
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTransparent: true,
        headerStyle: { backgroundColor: 'transparent' }
    }

    return screenOptions;
}

export default { initScreenOptions };