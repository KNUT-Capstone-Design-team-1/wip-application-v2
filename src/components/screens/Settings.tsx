import { screenState } from "@/atoms/screen";
import Layout from "@/components/organisms/Layout";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useRecoilState } from "recoil";

const Settings = (): JSX.Element => {
    const nav: any = useNavigation();
    const [screen, setScreen]: any = useRecoilState(screenState);

    const handleSetScreen = () => {
        setScreen('설정');
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
            flex: 1,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            overflow: 'hidden',
            backgroundColor: 'white',
            paddingHorizontal: 15,
        },
    });

    return (
        <Layout.default>
            <ScrollView style={styles.scrollViewWrapper}>
                <View style={styles.viewWrapper}>
                </View>
            </ScrollView>
        </Layout.default>
    )
}

export default Settings;