import { screenState } from '@/atoms/screen';
import { useRecoilState } from 'recoil';
import UpdateText from '@/components/atoms/UpdateText';
import SearchButtonList from '@/components/organisms/SearchButtonList';
import LastSearchPill from '@/components/organisms/LastSearchPill';
import MenuList from '@/components/organisms/MenuList';
import TakeGuide from '@/components/organisms/TakeGuide';
import { View, StyleSheet, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { gstyles } from '@/style/globalStyle';
import Layout from '@/components/organisms/Layout';
import RNExitApp from 'react-native-exit-app';

const Home = (): JSX.Element => {
  const nav: any = useNavigation();
  const [screen, setScreen] = useRecoilState(screenState);

  const handleSetScreen = () => {
    setScreen('홈');
  };

  useEffect(() => {
    nav.addListener('focus', () => handleSetScreen());
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        RNExitApp.exitApp();
        return true;
      },
    );
    return () => {
      nav.removeListener('focus', () => handleSetScreen());
      backHandler.remove();
    };
  }, []);

  return (
    <Layout.default>
      <View style={styles.homeViewWrapper}>
        <View style={styles.viewWrapper}>
          {/* 정보 업데이트 날짜 뷰 */}
          <UpdateText />
          {/* 알약 검색 버튼 */}
          <SearchButtonList />
          {/* 최근 조회 알약 */}
          <LastSearchPill />
          {/* 메뉴 리스트 */}
          <MenuList />
          {/* 복용법 */}
          <TakeGuide />
        </View>
      </View>
    </Layout.default>
  );
};

const styles = StyleSheet.create({
  homeViewWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    //marginTop: totalHeaderHeight + StatusBarHeight,
    zIndex: 1000,
    ...gstyles.screenBorder,
  },
  viewWrapper: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: '100%',
    overflow: 'hidden',
    paddingHorizontal: 15,
  },
});

export default Home;
