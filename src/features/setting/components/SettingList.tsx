import { View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { SEARCH_LIST } from '@features/setting/constants/setting_list';
import { ISettingListType } from '@features/setting/types/setting_type';
import { styles } from '@features/setting/styles/SettingList';
import { useSetting } from '@features/setting/hooks/use_setting';
import SettingItem from '@features/setting/components/SettingItem';
import { GlobalBannerAd } from '@features/ads/components/GlobalBannerAd';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bottomTabSize } from '@constants/size';
import { px } from '@utils/responsive';

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
      <GlobalBannerAd size={BannerAdSize.LARGE_BANNER} />
    </View>
  );
};

export default SettingList;
