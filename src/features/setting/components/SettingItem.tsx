import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
        <Text style={styles.text}>{item.title}</Text>
        <Text style={styles.text}>{item.value}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(SettingItem);
