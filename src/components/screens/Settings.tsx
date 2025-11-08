import Layout from '@/components/organisms/Layout';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import VersionCheck from 'react-native-version-check-expo';
import ArrowRightSvg from '@assets/svgs/arrow_right_bold.svg';
import { font, os } from '@/style/font';
import { setItem } from '@/utils/storage';
import { useAlert } from '@/hooks/useAlert';
import { usePillBox } from '@/hooks/usePillBox';
import { useScreenStore } from '@/store/screen';

const Settings = (): React.JSX.Element => {
  const nav: any = useNavigation();
  const setScreen = useScreenStore((state) => state.setScreen);
  const { showAlert } = useAlert();
  const { getPillSize, delPillList } = usePillBox();

  const handleSetScreen = useCallback(() => {
    setScreen('설정');
  }, [setScreen]);

  const handlePressTerm = () => {
    nav.push('이용약관');
  };

  const noticesHandlePress = () => {
    nav.push('공지사항');
  };

  const handlePressStorageReset = () => {
    showAlert('보관함 초기화', `정말로 보관함을 '초기화'하시겠습니까?`, [
      { text: '취소' },
      { text: '초기화', onPress: () => handleResetStorage() },
    ]);
  };

  const handlePressHistoryReset = () => {
    showAlert('기록 삭제', `정말로 기록을 '삭제'하시겠습니까?`, [
      { text: '취소' },
      { text: '삭제', onPress: () => handleResetHistory() },
    ]);
  };

  const handleResetStorage = () => {
    delPillList();
  };

  const handleResetHistory = () => {
    setItem('latestSearchPill', '');
  };

  useEffect(() => {
    nav.addListener('focus', () => handleSetScreen());
    return () => {
      nav.removeListener('focus', () => handleSetScreen());
    };
  }, [handleSetScreen, nav]);

  return (
    <Layout.default>
      <ScrollView style={styles.scrollViewWrapper}>
        <View style={styles.settingItem}>
          <Text style={styles.settingItemLabel}>앱 버전</Text>
          <Text
            style={styles.settingItemText}
          >{`v${VersionCheck.getCurrentVersion()}`}</Text>
        </View>
        <TouchableOpacity style={styles.settingItem} onPress={handlePressTerm}>
          <Text style={styles.settingItemLabel}>이용약관</Text>
          <ArrowRightSvg style={styles.rightArrow} width={12} height={16} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={noticesHandlePress}>
          <Text style={styles.settingItemLabel}>공지사항</Text>
          <ArrowRightSvg style={styles.rightArrow} width={12} height={16} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={handlePressHistoryReset}
        >
          <Text style={[styles.settingItemLabel, styles.warningText]}>
            기록 삭제
          </Text>
          <ArrowRightSvg style={styles.rightArrow} width={12} height={16} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={handlePressStorageReset}
        >
          <Text style={[styles.settingItemLabel, styles.warningText]}>
            보관함 초기화
          </Text>
          <Text style={[styles.settingItemText, styles.subText]}>
            {getPillSize() + ' 개'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Layout.default>
  );
};

const styles = StyleSheet.create({
  rightArrow: {},
  scrollViewWrapper: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    paddingTop: 8,
  },
  settingItem: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 28,
    paddingVertical: 18,
  },
  settingItemLabel: {
    color: '#000',
    flex: 1,
    fontFamily: os.font(400, 400),
    fontSize: font(18),
    includeFontPadding: false,
    paddingBottom: 0,
  },
  settingItemText: {
    color: '#000',
    fontFamily: os.font(400, 400),
    fontSize: font(18),
    includeFontPadding: false,
    paddingBottom: 0,
  },
  subText: { color: '#444' },
  viewWrapper: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    overflow: 'hidden',
    paddingHorizontal: 15,
  },
  warningText: { color: '#b81b1b' },
});

export default Settings;
