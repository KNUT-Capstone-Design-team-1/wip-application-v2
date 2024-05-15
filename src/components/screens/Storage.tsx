import { screenState } from "@/atoms/screen";
import Layout, { StatusBarHeight, defaultHeaderHeight, windowHeight } from "@/components/organisms/Layout";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { View, ScrollView, StyleSheet, Platform } from "react-native";
import { useRecoilState } from "recoil";

const Storage = (): JSX.Element => {
    const nav: any = useNavigation();
    const [screen, setScreen]: any = useRecoilState(screenState);

    const handleSetScreen = () => {
        setScreen('보관함');
    }

    useEffect(() => {
        nav.addListener('focus', () => handleSetScreen());
        return () => {
            nav.removeListener('focus', () => handleSetScreen());
        }
    }, []);

    const styles = StyleSheet.create({
        scrollViewWrapper: {
            flex: 1,
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
        },
        viewWrapper: {
            minHeight: windowHeight - (defaultHeaderHeight + StatusBarHeight),
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            overflow: 'hidden',
            paddingHorizontal: 15,
            paddingBottom: 15 + (Platform.OS === 'ios' ? 28 : 0),
            backgroundColor: '#ffffff',
        },
    });

    return (
        <Layout.default>
            <View style={styles.viewWrapper}>

            </View>
        </Layout.default>
    )
}

export default Storage;