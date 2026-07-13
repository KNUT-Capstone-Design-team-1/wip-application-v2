import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { ISettingListType } from '@features/setting/types/setting_type';
import { styles } from '@features/setting/styles/SettingList';

interface SettingItemProps {
  item: ISettingListType;
  onPress: (item: ISettingListType) => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={() => onPress(item)}>
      <View style={styles.settingItemTextBox}>
        <BaseText weight="medium" size={16} style={styles.text}>
          {item.title}
        </BaseText>
        <BaseText weight="medium" size={16} style={styles.text}>
          {item.value}
        </BaseText>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(SettingItem);
