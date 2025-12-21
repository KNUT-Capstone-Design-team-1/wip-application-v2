import { useCallback, useEffect, useRef } from 'react';
import UpdateText from '@/components/atoms/UpdateText';
import SearchButtonList from '@/components/organisms/SearchButtonList';
import LastSearchPill from '@/components/organisms/LastSearchPill';
import MenuList from '@/components/organisms/MenuList';
import TakeGuide from '@/components/organisms/TakeGuide';
import BottomSheet from '@/components/molecules/BottomSheet';
import { View, StyleSheet, BackHandler, Modal } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { gstyles } from '@/style/globalStyle';
import Layout from '@/components/organisms/Layout';
import { exitApp } from '@logicwind/react-native-exit-app';
import { useScreenStore } from '@/store/screen';
import { useNotices } from '@/hooks/useNotices';
import { useNoticeStore } from '@store/noticeStore';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import Toast from 'react-native-toast-message';

// 앱 종료 버튼 누르고 나서 다시 누르기 전까지의 시간 간격
const EXIT_APP_GAP = 2000;

const Home = (): React.JSX.Element => {
  const nav: any = useNavigation();
  const setScreen = useScreenStore((state) => state.setScreen);
  const { getNoticeBottomSheet } = useNotices();
  const mainBottomSheetData = useNoticeStore(
    (state) => state.mainBottomSheetData,
  );
  const isNoticeLoading = useNoticeStore((state) => state.isNoticeLoading);
  const { isVisible, handleClose, handleNeverShowAgain, checkShouldShow } =
    useBottomSheet();

  const lastBackPress = useRef(0);

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
    const unsubscribe = nav.addListener('focus', () => handleSetScreen());

    return () => {
      unsubscribe();
    };
  }, [handleSetScreen, nav]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (isVisible) {
            handleClose();
            return true;
          }

          const now = Date.now();

          if (
            lastBackPress.current > 0 &&
            now - lastBackPress.current < EXIT_APP_GAP
          ) {
            exitApp();
          } else {
            lastBackPress.current = now;
            Toast.show({
              type: 'noteToast',
              text1: '뒤로가기를 한번 더 누르면 앱이 종료됩니다.',
            });
          }
          return true;
        },
      );

      return () => {
        backHandler.remove();
      };
    }, [handleClose, isVisible]),
  );

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
