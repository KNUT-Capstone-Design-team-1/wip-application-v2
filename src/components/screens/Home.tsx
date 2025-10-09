import { useCallback, useEffect } from 'react';
import UpdateText from '@/components/atoms/UpdateText';
import SearchButtonList from '@/components/organisms/SearchButtonList';
import LastSearchPill from '@/components/organisms/LastSearchPill';
import MenuList from '@/components/organisms/MenuList';
import TakeGuide from '@/components/organisms/TakeGuide';
import BottomSheet from '@/components/molecules/BottomSheet';
import { View, StyleSheet, BackHandler, Modal } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { gstyles } from '@/style/globalStyle';
import Layout from '@/components/organisms/Layout';
import { exitApp } from '@logicwind/react-native-exit-app';
import { useScreenStore } from '@/store/screen';
import { useNotices } from '@/hooks/useNotices';
import { useNoticeStore } from '@store/noticeStore';
import { useBottomSheet } from '@/hooks/useBottomSheet';

const Home = (): React.JSX.Element => {
  const nav: any = useNavigation();
  const setScreen = useScreenStore((state) => state.setScreen);
  const { getNoticeBottomSheet } = useNotices();
  const mainBottomSheetData = useNoticeStore((state) => state.mainBottomSheetData);
  const { isVisible, handleClose, handleNeverShowAgain, checkShouldShow } = useBottomSheet();

  const handleSetScreen = useCallback(() => {
    setScreen('홈');
  }, [setScreen]);

  // main의 바텀시트에 필독 공지사항 데이터 세팅
  useEffect(() => {
    getNoticeBottomSheet();
  }, []);

  useEffect(() => {
    checkShouldShow(mainBottomSheetData && mainBottomSheetData.length > 0);
  }, [mainBottomSheetData]);

  useEffect(() => {
    nav.addListener('focus', () => handleSetScreen());
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        exitApp();
        return true;
      },
    );
    return () => {
      nav.removeListener('focus', () => handleSetScreen());
      backHandler.remove();
    };
  }, [handleSetScreen, nav]);

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
          {/* 바텀 시트 */}
          <Modal visible={isVisible} transparent={true} animationType="fade">
            <BottomSheet
              data={mainBottomSheetData}
              onClose={handleClose}
              onNeverShowAgain={handleNeverShowAgain}
            />
          </Modal>
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
