import { useCallback, useEffect } from 'react';
import UpdateText from '@/components/atoms/UpdateText';
import SearchButtonList from '@/components/organisms/SearchButtonList';
import LastSearchPill from '@/components/organisms/LastSearchPill';
import MenuList from '@/components/organisms/MenuList';
import TakeGuide from '@/components/organisms/TakeGuide';
import BottomSheet from '@/components/molecules/BottomSheet';
import { View, StyleSheet, BackHandler, Modal } from 'react-native';
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
  const isNoticeLoading = useNoticeStore((state) => state.isNoticeLoading);
  const { isVisible, handleClose, handleNeverShowAgain, checkShouldShow } =
    useBottomSheet();

  const handleSetScreen = useCallback(() => {
    setScreen('홈');
  }, [setScreen]);

  // main의 바텀시트에 필독 공지사항 데이터 세팅
  useEffect(() => {
    getNoticeBottomSheet();
  }, []);

  // 로딩 상태가 변경될 때마다 바텀시트 표시 여부 확인
  useEffect(() => {
    checkShouldShow();
  }, [isNoticeLoading, mainBottomSheetData]);

  useEffect(() => {
    nav.addListener('focus', () => handleSetScreen());
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // 바텀시트가 열려있으면 바텀시트를 닫고, 앱 종료는 막음
        if (isVisible) {
          handleClose();
          return true;
        }
        // 바텀시트가 닫혀있으면 앱 종료
        exitApp();
        return true;
      },
    );
    return () => {
      nav.removeListener('focus', () => handleSetScreen());
      backHandler.remove();
    };
  }, [handleSetScreen, nav, isVisible, handleClose]);

  return (
    <>
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
      {/* 바텀 시트 */}
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <BottomSheet
          data={mainBottomSheetData}
          onClose={handleClose}
          onNeverShowAgain={handleNeverShowAgain}
        />
      </Modal>
    </>
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
