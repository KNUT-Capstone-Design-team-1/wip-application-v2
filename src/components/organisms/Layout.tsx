import HeaderBackground from "@/components/atoms/HeaderBackground"
import HeaderLogo from "@/components/atoms/HeaderLogo"
import { Platform, StatusBar, StyleSheet, View } from "react-native"
import { getStatusBarHeight } from "react-native-safearea-height";


const Layout = {
  default: ({ children }: any) => {
    /* 기기 별 상태바 높이 계산 */
    const StatusBarHeight: number = (Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight) ?? 0;
    /* OS 별 헤더 높이 */
    const HeaderHeight: number = (Platform.OS === 'ios' ? 8 : 40) ?? 0;

    const styles = StyleSheet.create({
      headerTitleWrapper: {
        height: StatusBarHeight + HeaderHeight,
        marginTop: StatusBarHeight + (HeaderHeight / 2),
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
      },
    })

    return (
      <HeaderBackground>
        <View style={styles.headerTitleWrapper}>
          <HeaderLogo />
        </View>
        {children}
      </HeaderBackground>
    )
  }
}


export default Layout;