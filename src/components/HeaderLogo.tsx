import { StyleSheet, View, Image } from 'react-native';

const HeaderLogo = () => {

    const styles = StyleSheet.create({
        headerLogo: { height: '95%', resizeMode: "contain" },
    });

    return (
        <View>
            <Image
                style={styles.headerLogo}
                source={require('@assets/images/logo_default.png')} // header에 들어갈 로고이미지.
            />
        </View>
    )
}

export default HeaderLogo;