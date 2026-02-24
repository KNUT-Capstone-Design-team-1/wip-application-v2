import { View, Text } from 'react-native';
import { styles } from '../styles/PillSave';
import PillSaveList from '@/src/features/pill_save/components/organisms/PillSaveList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const PillSave = () => {
  const [pillSaveData, setPillSaveData] = useState([]);
  const getSaveData = async () => {
    const saveData = await AsyncStorage.getItem('saveData');

    if (saveData != null) {
      setPillSaveData(JSON.parse(saveData));
    }
  };

  useEffect(() => {
    getSaveData();
  }, []);

  return (
    <View style={styles.pillSaveRoot}>
      <View>
        <Text>전체 개수 {pillSaveData.length}</Text>
      </View>
      <PillSaveList pillSaveData={pillSaveData} onDataChange={getSaveData} />
    </View>
  );
};

export default PillSave;
