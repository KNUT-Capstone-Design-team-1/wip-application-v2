import { View, Text, TouchableOpacity } from 'react-native';
import { SEARCH_LIST } from '../constants/setting_list';
import { useRouter } from 'expo-router';
import { ISettingListType } from '../types/setting_type';
import { styles } from '../styles/SettingList';
import { useEffect, useState } from 'react';
import { loadPillStorageCount, clearPillStorage, clearRecentSearch } from '../hooks/use_setting';

const SettingList = () => {
  const router = useRouter();
  const [settingList, setSettingList] = useState<ISettingListType[]>(SEARCH_LIST);

  const loadData = async () => {
    const updatedList = await loadPillStorageCount();
    setSettingList(updatedList);
  };

  useEffect(() => {
    loadData();
  }, []);

  // 각 버튼 터치 시 동작 결정해주는 함수
  const settingListClickHandler = (list: ISettingListType) => {
    if (list.path !== '') {
      router.push(`/${list.path}`);
      return;
    }

    // 기능별 처리
    if (list.title === '보관함 초기화') {
      clearPillStorage(setSettingList);
    } else if (list.title === '기록 삭제') {
      clearRecentSearch();
    }
  };

  return (
    <View style={styles.settingList}>
      {settingList.map((list: ISettingListType, index: number) => {
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
