import _ from 'lodash';

const regexPattern = /[*?]/;

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
