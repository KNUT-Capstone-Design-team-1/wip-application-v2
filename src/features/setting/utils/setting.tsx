import AsyncStorage from '@react-native-async-storage/async-storage';

export const getPillStorage = async () => {
  try {
    const savePillData = await AsyncStorage.getItem('saveData');

    if (!savePillData) {
      return 0;
    }

    const parseSavePillData = JSON.parse(savePillData);

    return Array.isArray(parseSavePillData) ? parseSavePillData.length : 0;
  } catch (error) {
    console.error('Failed to get pill storage:', error);
    return 0;
  }
};
