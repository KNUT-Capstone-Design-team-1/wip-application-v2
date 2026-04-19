import { View, Text } from 'react-native';
import { styles } from '../styles/PillSave';
import PillSaveList from '../components/organisms/PillSaveList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { IPillSaveData } from '../types/pill_save_type';

const PillSave = () => {
  const [pillSaveData, setPillSaveData] = useState<IPillSaveData[]>([]);
  const [loading, setLoading] = useState(true);

  const getSaveData = async () => {
    try {
      setLoading(true);
      const saveData = await AsyncStorage.getItem('saveData');

      if (saveData) {
        const parsedData = JSON.parse(saveData);
        setPillSaveData(Array.isArray(parsedData) ? parsedData : []);
      } else {
        setPillSaveData([]);
      }
    } catch (error) {
      console.error('Failed to load save data:', error);
      setPillSaveData([]);
    } finally {
      setLoading(false);
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
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text>로딩 중...</Text>
        </View>
      ) : (
        <PillSaveList pillSaveData={pillSaveData} onDataChange={getSaveData} />
      )}
    </View>
  );
};

export default PillSave;
