import { View, Text, TouchableOpacity } from 'react-native';
import { SEARCH_LIST } from '../constants/setting_list';
import { useRouter } from 'expo-router';
import { ISettingListType } from '../types/setting_type';
import { styles } from '../styles/SettingList';

const SettingList = () => {
  const router = useRouter();

  // 각 버튼 터치 시 동작 결정해주는 함수
  const settingListClickHandler = (list: ISettingListType) => {
    if (list.path !== '') router.push(`/${list.path}`);
    // TODO : 기록 삭제, 보관함 초기화 기능 넣어야됨
  };

  return (
    <View style={styles.settingList}>
      {SEARCH_LIST.map((list: ISettingListType, index: number) => {
        return (
          <TouchableOpacity
            style={styles.settingItem}
            key={index}
            onPress={() => settingListClickHandler(list)}
          >
            <View style={styles.settingItemTextBox}>
              <Text style={styles.text}>{list.title}</Text>
              <Text style={styles.text}>{list.value}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SettingList;
