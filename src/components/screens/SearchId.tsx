import { Suspense, useEffect, lazy } from "react"
import { Platform, StyleSheet, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useRecoilState } from "recoil"
import Layout, { defaultHeaderHeight, StatusBarHeight, windowHeight } from "@/components/organisms/Layout"
import { screenState } from "@/atoms/screen"

const SearchIdList = lazy(() => import("@/components/organisms/SearchIdList"))

const SearchId = (): JSX.Element => {
  const nav: any = useNavigation();
  const [screen, setScreen] = useRecoilState(screenState);

  const handleSetScreen = () => {
    setScreen('식별 검색');
  }

  useEffect(() => {
    nav.addListener('focus', () => handleSetScreen());
    return () => {
      nav.removeListener('focus', () => handleSetScreen());
    }
  }, []);

  return (
    <Layout.default>
      <Suspense fallback={<View style={styles.viewWrapper} />}>
        <SearchIdList />
      </Suspense>
    </Layout.default>
  )
}

const styles = StyleSheet.create({
  viewWrapper: {
    minHeight: windowHeight - (defaultHeaderHeight + StatusBarHeight),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    paddingTop: 21,
    paddingBottom: 15 + (Platform.OS === 'ios' ? 28 : 0),
    backgroundColor: '#ffffff',
  },
})

export default SearchId