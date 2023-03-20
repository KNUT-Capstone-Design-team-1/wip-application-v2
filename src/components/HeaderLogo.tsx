import { StyleSheet, View, Image } from 'react-native';

const HeaderLogo = () => {
    
    const styles = StyleSheet.create({
        headerLogo: { width: 120, height: 55, marginTop: 10 },
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