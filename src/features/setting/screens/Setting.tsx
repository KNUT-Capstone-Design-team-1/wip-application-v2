import { View } from 'react-native';
import SettingList from '../components/SettingList';
import { screenPadding } from '@constants/size';
import { COLOR_BG } from '@constants/color';
import { GlobalBannerAd } from '@features/ads/components/GlobalBannerAd';

const Setting = () => {
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: screenPadding.horizontal,
        paddingTop: screenPadding.top,
        backgroundColor: COLOR_BG['surface'],
      }}
    >
      <SettingList />
      <GlobalBannerAd />
    </View>
  );
};

export default Setting;
