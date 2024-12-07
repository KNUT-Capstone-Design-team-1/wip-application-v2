import { toastConfig } from '@/constants/toast';
import { clearLogBoxLogs, ignoreSpecificLogs } from '@/utils/logBox';
import Navigation from '@navigation/Navigation';
import { useEffect, useState } from 'react';
import { AppState, LogBox } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { RecoilRoot } from 'recoil';
import { updateCheck } from '@/api/update';
import UpdateDB from '@/components/screens/UpdateDB';
import { RealmProvider } from '@realm/react';
import { dbConfig } from './api/db/config';

// TODO: initDB 표시 로직 확인
// TODO: 전체 코드 jsdoc 작성
const App = (): React.JSX.Element => {
  const [updateDB, setUpdateDB] = useState(false)

  useEffect(() => {
    ignoreSpecificLogs();

    const subscription = AppState.addEventListener('change', handleAppStateChange);

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
    const checkDB = async () => {
      const result = await updateCheck();
      if (result) {
        setUpdateDB(true)
      }
    }
    checkDB();
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);

  return (
    <RealmProvider {...dbConfig}>
      <RecoilRoot>
        {updateDB ? <UpdateDB /> :
          <Navigation />
        }
        <Toast
          config={toastConfig}
          position='bottom'
          bottomOffset={130}
        />
      </RecoilRoot>
    </RealmProvider>
  );
}

export default App;