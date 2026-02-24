import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PillSaveContent from '../molecules/PillSaveContent';
import { IPillSaveData, IPillSaveListProps } from '@/src/features/pill_save/types/pill_save_type';
import { styles } from '../../styles/organisms/PillSaveList';
import { getPillDatasByItemSeq } from '@/src/services/database/queries/pill_data';

const SAVE_DATA_KEY = 'saveData';

const PillSaveList = ({ pillSaveData, onDataChange }: IPillSaveListProps) => {
  const handlePressDetail = async (itemSeq: string, itemImage: string) => {
    const result = await getPillDatasByItemSeq([itemSeq]);
    if (result.length > 0) {
      const pillData = result[0];

      router.push({
        pathname: '/pill-search-result-detail',
        params: {
          itemDetail: JSON.stringify(pillData),
          itemImage: itemImage,
        },
      });
    }
  };

  const handlePressDelete = async (itemSeq: string) => {
    const raw = await AsyncStorage.getItem(SAVE_DATA_KEY);

    if (!raw) return;

    const savedList = JSON.parse(raw);
    const updatedList = savedList.filter((item: IPillSaveData) => {
      return item.ITEM_SEQ !== itemSeq;
    });

    await AsyncStorage.setItem(SAVE_DATA_KEY, JSON.stringify(updatedList));
    onDataChange?.();
  };

  return (
    <ScrollView
      style={styles.pillSaveListWrapper}
      contentContainerStyle={styles.pillSaveListContent}
    >
      {pillSaveData.map((saveData, index) => {
        return (
          <View key={saveData.ITEM_SEQ} style={styles.pillSaveItemWrapper}>
            <PillSaveContent
              saveData={saveData}
              onPressDetail={() => handlePressDetail(saveData.ITEM_SEQ, saveData.ITEM_IMAGE)}
              onPressDelete={() => handlePressDelete(saveData.ITEM_SEQ)}
            />
          </View>
        );
      })}
    </ScrollView>
  );
};

export default PillSaveList;
