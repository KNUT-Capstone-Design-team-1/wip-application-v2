import HeaderLogo from '@/components/HeaderLogo';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const HeaderBackground = ({ children }: any): JSX.Element => {

    const styles = StyleSheet.create({
        headerBackground: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            flex: 1,
        },
    });

    return (
        <LinearGradient
            colors={['#6060dd', '#4545a7']}
            style={styles.headerBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.15 }}
        >
            {children}
        </LinearGradient>
    )
}

export default HeaderBackground;