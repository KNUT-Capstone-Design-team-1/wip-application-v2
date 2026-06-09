import { View } from 'react-native';
import { HomeScreen } from '@features/home';
import MainNoticeBottomSheet from '@features/notice/components/MainNoticeBottomSheet';

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <HomeScreen />
      <MainNoticeBottomSheet />
    </View>
  );
}
