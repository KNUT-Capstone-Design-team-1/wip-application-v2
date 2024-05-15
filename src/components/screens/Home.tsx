import { screenState } from "@/atoms/screen";
import { useRecoilState } from "recoil";
import SearchPillButton from "@/components/atoms/SearchPillButton";
import UpdateText from "@/components/atoms/UpdateText";
import LastSearchPill from "@/components/organisms/LastSearchPill";
import MenuList from "@/components/organisms/MenuList";
import TakeGuide from "@/components/organisms/TakeGuide";
import { View, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { gstyles } from "@/style/globalStyle";
import Layout, { StatusBarHeight, totalHeaderHeight } from "@/components/organisms/Layout";

const Home = (): JSX.Element => {
    const nav: any = useNavigation();
    const [screen, setScreen] = useRecoilState(screenState);

    const handleSetScreen = () => {
        setScreen('홈');
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
            backgroundColor: 'white',
            //marginTop: totalHeaderHeight + StatusBarHeight,
            zIndex: 1000,
            ...gstyles.screenBorder,
        },
        viewWrapper: {
            minHeight: '100%',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            overflow: 'hidden',
            paddingHorizontal: 15,
        },
    });

    return (
        <Layout.default>
            <ScrollView
                style={styles.scrollViewWrapper}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.viewWrapper}>
                    {/* 정보 업데이트 날짜 뷰 */}
                    <UpdateText />
                    {/* 알약 검색 버튼 */}
                    <SearchPillButton />
                    {/* 최근 검색 알약 */}
                    <LastSearchPill />
                    {/* 메뉴 리스트 */}
                    <MenuList />
                    {/* 여백 */}
                    <View style={{ flex: 1 }} />
                    {/* 복용법 */}
                    <TakeGuide />
                </View>
            </ScrollView>
        </Layout.default>
    )
}

export default Home;