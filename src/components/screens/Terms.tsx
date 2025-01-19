import { screenState } from "@/atoms/screen";
import Layout from "@/components/organisms/Layout";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRecoilState } from "recoil";
import ArrowRightSvg from '@assets/svgs/arrow_right_bold.svg';
import { font, os } from "@/style/font";
import { getItem, setItem } from "@/utils/storage";
import { TERMS } from "@/constants/terms";

const Terms = (): JSX.Element => {
    const nav: any = useNavigation();
    const [screen, setScreen]: any = useRecoilState(screenState);

    const handleSetScreen = () => {
        setScreen('이용 약관');
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
            paddingHorizontal: 16,
            paddingTop: 12,
        },
        termsText: {
            color: '#000',
            fontSize: font(16),
            fontFamily: os.font(400, 400),
            includeFontPadding: false,
            paddingBottom: 100,
        }
    });

    return (
        <Layout.default>
            <ScrollView style={styles.scrollViewWrapper}>
                <Text style={styles.termsText}>{TERMS}</Text>
            </ScrollView>
        </Layout.default>
    )
}

export default Terms;