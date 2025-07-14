import _ from 'lodash';
import { Platform } from 'react-native';

const regexPattern = /[*?]/;

export const isIos: boolean = Platform.OS === 'ios';

export const disableWord = (text: string) => {
  return regexPattern.test(text);
};

export const makeNewList = (
  items: string[],
  inputItem: string,
  defaultItem: string,
) => {
  const newList = _.xor(items, [inputItem]);
  if (newList.length === 0) {
    newList.push(defaultItem);
  } else {
    if (inputItem === defaultItem) {
      _.remove(newList, (i) => i !== defaultItem);
    } else {
      _.pull(newList, defaultItem);
    }
  }
  return newList;
};
