import { toastConfig } from '@/constans/toast';
import Navigation from '@navigation/Navigation';
import { LogBox } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { RecoilRoot } from 'recoil';

const App = (): React.JSX.Element => {
  /* 화면 전환 시 뜨는 경고문 무시('stack' 라이브러리 버그) */
  LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.']);

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