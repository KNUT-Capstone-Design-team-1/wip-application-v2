import { View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { SEARCH_LIST } from '@features/setting/constants/setting_list';
import { ISettingListType } from '@features/setting/types/setting_type';
import { styles } from '@features/setting/styles/SettingList';
import { useSetting } from '@features/setting/hooks/use_setting';
import SettingItem from '@features/setting/components/SettingItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bottomTabSize } from '@constants/size';
import { px } from '@utils/responsive';
import { GlobalNativeAd } from '@features/ads/components/GlobalNativeAd';

// TODO: Native 광고로 교체 필요

const SettingList = () => {
  const insets = useSafeAreaInsets();
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
    <View
      style={[
        styles.settingList,
        { paddingBottom: insets.bottom + bottomTabSize.height + px(8) },
      ]}
    >
      <View>
        {settingList.map((list: ISettingListType) => (
          <SettingItem
            key={list.id + list.title}
            item={list}
            onPress={onPressItem}
          />
        ))}
      </View>
      <GlobalNativeAd />
    </View>
  );
};

export default SettingList;
