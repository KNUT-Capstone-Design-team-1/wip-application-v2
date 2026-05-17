import { View, Text, TouchableOpacity } from 'react-native';
import { SEARCH_LIST } from '../constants/setting_list';
import { ISettingListType } from '../types/setting_type';
import { styles } from '../styles/SettingList';
import { useEffect, useState } from 'react';
import { useSetting } from '../hooks/use_setting';

const SettingList = () => {
  const [settingList, setSettingList] =
    useState<ISettingListType[]>(SEARCH_LIST);
  const { settingListClickHandler, loadPillStorageCount } = useSetting();

  const loadData = async () => {
    const updatedList = await loadPillStorageCount();
    setSettingList(updatedList);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={styles.settingList}>
      {settingList.map((list: ISettingListType, index: number) => {
        return (
          <TouchableOpacity
            style={styles.settingItem}
            key={index}
            onPress={() => settingListClickHandler(list, setSettingList)}
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
