import { styles } from '../styles/screens/Setting';
import { View } from 'react-native';
import SettingList from '../components/SettingList';

const Setting = () => {
  return (
    <View style={styles.container}>
      <SettingList />
    </View>
  );
};

export default Setting;
