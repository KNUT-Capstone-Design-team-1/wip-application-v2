import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '@utils/logger';

export const getPillStorage = async () => {
  try {
    const savePillData = await AsyncStorage.getItem('saveData');

    if (!savePillData) {
      return 0;
    }

    const parseSavePillData = JSON.parse(savePillData);

    return Array.isArray(parseSavePillData) ? parseSavePillData.length : 0;
  } catch (e) {
    logger.error(`Failed to get pill storage. ${e.stack || e}`);
    return 0;
  }
};
