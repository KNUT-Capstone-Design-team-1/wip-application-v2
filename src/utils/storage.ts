import AsyncStorage from '@react-native-async-storage/async-storage';

/** AsyncStorage 저장 */
export const setItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
    //console.log(`setItem... ${key} : ${value}`);
  } catch (e) {
    throw e;
  }
};

/** AsyncStorage 불러오기 */
export const getItem = async (key: string) => {
  try {
    const res = await AsyncStorage.getItem(key);
    return res || '';
  } catch (e) {
    throw e;
  }
};