import { View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { SEARCH_LIST } from '@features/setting/constants/setting_list';
import { ISettingListType } from '@features/setting/types/setting_type';
import { styles } from '@features/setting/styles/SettingList';
import { useSetting } from '@features/setting/hooks/use_setting';
import SettingItem from '@features/setting/components/SettingItem';

const SettingList = () => {
  const [settingList, setSettingList] =
    useState<ISettingListType[]>(SEARCH_LIST);

  const { handleSettingClick, loadPillStorageCount } = useSetting();

  const loadData = useCallback(async () => {
    const updatedList = await loadPillStorageCount();
    setSettingList(updatedList);
  }, [loadPillStorageCount]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onPressItem = useCallback(
    (item: ISettingListType) => {
      handleSettingClick(item, setSettingList);
    },
    [handleSettingClick],
  );

  return (
    <View style={styles.settingList}>
      {settingList.map((list: ISettingListType) => (
        <SettingItem
          key={list.id + list.title}
          item={list}
          onPress={onPressItem}
        />
      ))}
    </View>
  );
};

export default SettingList;
