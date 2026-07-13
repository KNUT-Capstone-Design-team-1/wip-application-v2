import { View } from 'react-native';
import SettingList from '../components/SettingList';
import { screenPadding } from '@constants/size';
import { COLOR_BG } from '@constants/color';

const Setting = () => {
  return (
    <View
      style={{
        paddingHorizontal: screenPadding.horizontal,
        paddingTop: screenPadding.top,
        backgroundColor: COLOR_BG['surface'],
      }}
    >
      <SettingList />
    </View>
  );
};

export default Setting;
