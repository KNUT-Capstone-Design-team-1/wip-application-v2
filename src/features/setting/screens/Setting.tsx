import { View } from 'react-native';
import SettingList from '../components/SettingList';
import { px } from '@utils/responsive';

const Setting = () => {
  return (
    <View style={{ paddingHorizontal: px(20), backgroundColor: '#fff' }}>
      <SettingList />
    </View>
  );
};

export default Setting;
