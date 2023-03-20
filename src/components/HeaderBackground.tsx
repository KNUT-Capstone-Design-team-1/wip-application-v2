import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const HeaderBackground = ({ children }: object): JSX.Element => {

    const styles = StyleSheet.create({
        headerBackground: {
            flex: 1,
            paddingTop: 140, // header 높이.
        },
    });

    return (
        <LinearGradient
            colors={['#5757DB', '#4545AB']}
            style={styles.headerBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.15 }}>
            {children}
        </LinearGradient>
    )
}

export default HeaderBackground;