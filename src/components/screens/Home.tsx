import HeaderBackground from "@/components/atoms/HeaderBackground";
import HeaderLogo from "@/components/atoms/HeaderLogo";
import SearchPillButton from "@/components/atoms/SearchPillButton";
import UpdateText from "@/components/atoms/UpdateText";
import BottomNavagation from "@/components/organisms/BottomNavigation";
import LastSearchPill from "@/components/organisms/LastSearchPill";
import Layout from "@/components/organisms/Layout";
import MenuList from "@/components/organisms/MenuList";
import TakeGuide from "@/components/organisms/TakeGuide";
import { View, ScrollView, StyleSheet, Platform, StatusBar } from "react-native";
import { getStatusBarHeight } from "react-native-safearea-height";

const Home = (): JSX.Element => {
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
                    {/* 정보 업데이트 날짜 뷰 */}
                    <UpdateText />
                    {/* 알약 검색 버튼 */}
                    <SearchPillButton />
                    {/* 최근 검색 알약 */}
                    <LastSearchPill />
                    {/* 메뉴 리스트 */}
                    <MenuList />
                    {/* 복용법 */}
                    <TakeGuide />
                </View>
            </ScrollView>
            <BottomNavagation />
        </Layout.default>
    )
}

export default Home;