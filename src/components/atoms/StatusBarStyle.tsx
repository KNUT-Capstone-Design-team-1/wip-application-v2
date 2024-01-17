import { Platform, StatusBar } from 'react-native';

const initStyle = (): void => {
    if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor("transparent"); // 상태바 배경 투명.
        StatusBar.setTranslucent(true); // 상태바 자리 무시.
    }
    StatusBar.setBarStyle("light-content"); // 상태바 글씨 밝게
}

export default { initStyle };