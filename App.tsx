import 'expo-router/entry'; // Expo Router entry
import 'react-native-get-random-values';
import '@services/background'; // 앱 공통 백그라운드 태스크 정의 등록
import '@features/database_update/services/background_sync_task'; // DB 동기화 백그라운드 핸들러 등록

const App = () => {
  return null; // Expo Router 파일을 자동인식하여 폴더스캔
};

export default App;
