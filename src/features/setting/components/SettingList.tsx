import React, { useCallback } from 'react';
import { View } from 'react-native';
import { ISettingListType } from '@features/setting/types/setting_type';
import { styles } from '@features/setting/styles/SettingList';
import { useSetting } from '@features/setting/hooks/use_setting';
import SettingItem from '@features/setting/components/SettingItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bottomTabSize } from '@constants/size';
import { px } from '@utils/responsive';
import { GlobalNativeAd } from '@features/ads/components/GlobalNativeAd';

// 설정 항목 리스트 컴포넌트
const SettingList = () => {
  const insets = useSafeAreaInsets();
  const { settingList, handleSettingClick } = useSetting();

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
