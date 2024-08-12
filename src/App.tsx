import { toastConfig } from '@/constans/toast';
import { clearLogBoxLogs, ignoreSpecificLogs } from '@/utils/logBox';
import Navigation from '@navigation/Navigation';
import { useEffect } from 'react';
import { AppState, LogBox } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { RecoilRoot } from 'recoil';

const App = (): React.JSX.Element => {
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
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  });

  return (
    <RecoilRoot>
      <Navigation />
      <Toast
        config={toastConfig}
        position='bottom'
        bottomOffset={130}
      />
    </RecoilRoot>
  );
}

export default App;