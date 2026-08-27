import { View } from 'react-native';
import React, { useCallback } from 'react';
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
  const { handleSettingClick } = useSetting();

  const onPressItem = useCallback(
    (item: ISettingListType) => {
      handleSettingClick(item);
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
        {SEARCH_LIST.map((list: ISettingListType) => (
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
