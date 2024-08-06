import { LogBox } from 'react-native';

export const clearLogBoxLogs = () => {
  if (__DEV__) {
    // 개발 모드에서만 실행
    console.log('Clearing LogBox logs');
    LogBox.ignoreAllLogs(true);
    LogBox.ignoreAllLogs(false);
    console.log('LogBox logs cleared');
  }
};

export const ignoreSpecificLogs = () => {
  if (__DEV__) {
    LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.']);
  }
};