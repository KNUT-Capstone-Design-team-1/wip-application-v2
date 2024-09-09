import { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SearchImageButton from "../atoms/SearchImageButton";
import Layout from "@/components/organisms/Layout";
import { useRecoilState } from "recoil";
import { screenState } from "@/atoms/screen";
import SearchIdButton from "../atoms/SearchIdButton";

const SearchSelect = (): JSX.Element => {
  const nav: any = useNavigation();
  const [screen, setScreen] = useRecoilState(screenState);

  const handleSetScreen = () => {
    setScreen('검색 선택');
  }
  useEffect(() => {
    nav.addListener('focus', () => handleSetScreen());
    return () => {
      nav.removeListener('focus', () => handleSetScreen());
    }
  }, []);

  const styles = StyleSheet.create({
    viewWrapper: {
      flex: 1,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      overflow: 'hidden',
      paddingHorizontal: 15,
      paddingBottom: 15 + (Platform.OS === 'ios' ? 28 : 0),
      backgroundColor: '#fff',
    },
  })
  return (
    <Layout.default>
      <View style={styles.viewWrapper}>
        <SearchIdButton />
        <SearchImageButton />
      </View>
    </Layout.default>
  )
}

export default SearchSelect;