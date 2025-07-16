import dayjs from 'dayjs';
import { toastConfig } from '@/constants/toast';
import { clearLogBoxLogs, ignoreSpecificLogs } from '@/utils/logBox';
import Navigation from '@navigation/Navigation';
import { useEffect, useState } from 'react';
import { AppState, LogBox, Platform } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { RecoilRoot } from 'recoil';
import { updateCheck } from '@/api/update';
import UpdateDB from '@/components/screens/UpdateDB';
import { RealmProvider } from '@realm/react';
import { dbConfig } from '@/api/db/config';
import { AlertProvider } from '@/provider/AlertProvider';
import { checkAppVersion } from '@/utils/versionChecker';
import wipConfig from '../wip_config.json';
import { GLOBAL_STATE } from './global_state';

// TODO: android 구버전 권한 및 사용 테스트 필요 target < android 13

// TODO: ios 동작 확인
// TODO: ios 앨범 선택 동작확인 => 기존 PhotoLibrary 권한 없음

// TODO: initDB 표시 로직 확인
// TODO: 전체 코드 jsdoc 작성
const App = (): React.JSX.Element => {
  const [updateDB, setUpdateDB] = useState(false);

  useEffect(() => {
    ignoreSpecificLogs();

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: any) => {
    if (nextAppState === 'active') {
      clearLogBoxLogs();
    }
  };

  useEffect(() => {
    // 앱 버전 체크
    checkAppVersion();

    const checkDB = async () => {
      const result = await updateCheck();

      const { schemaVersion, minorVersion } = wipConfig.database;
      GLOBAL_STATE.dbResourceVersion = `${schemaVersion}_${dayjs(GLOBAL_STATE.curDBdate).format('YYYYMMDD')}_${minorVersion}`;

      if (result) {
        setUpdateDB(true);
      }
    };
    checkDB();
    SplashScreen.hide();
  }, []);

  return (
    <RealmProvider {...dbConfig}>
      <AlertProvider>
        <RecoilRoot>
          {updateDB ? <UpdateDB /> : <Navigation />}
          <Toast config={toastConfig} position="bottom" bottomOffset={130} />
        </RecoilRoot>
      </AlertProvider>
    </RealmProvider>
  );
};

export default App;
