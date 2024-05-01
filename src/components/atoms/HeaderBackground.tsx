import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const HeaderBackground = (): JSX.Element => {
    const styles = StyleSheet.create({
        headerBackground: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            flex: 1,
            zIndex: -1,
        },
    });

    return (
        <LinearGradient
            colors={['#6060dd', '#4545a7', '#4545a7', '#ffffff', '#ffffff']}
            style={styles.headerBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.15, 0.5, 0.5, 1]}
        />
    )
}

export default HeaderBackground;