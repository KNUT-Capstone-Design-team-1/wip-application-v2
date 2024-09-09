import { useEffect } from "react"
import { StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useRecoilState } from "recoil"
import Layout from "@/components/organisms/Layout"
import SearchIdList from "@/components/organisms/SearchIdList"
import { screenState } from "@/atoms/screen"
import { gstyles } from "@/style/globalStyle"

const SearchId = ({ route }: any): JSX.Element => {
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

  const styles = StyleSheet.create({
    scrollViewWrapper: {
      flex: 1,
      backgroundColor: 'white',
      //marginTop: totalHeaderHeight + StatusBarHeight,
      zIndex: 1000,
      ...gstyles.screenBorder,
    },
  })

  return (
    <Layout.default>
      <SearchIdList />
    </Layout.default>
  )
}

export default SearchId