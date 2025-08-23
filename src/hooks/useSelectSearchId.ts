import { useState } from 'react';
import { TItemData } from '@/constants/data';
import { useNavigation } from '@react-navigation/native';
import { disableWord, makeNewList } from '@/utils/checker';
import { useSearchIdStore } from '@/store/searchIdStore';

export const useSelectSearchId = () => {
  const [btnState, setBtnState] = useState<boolean>(false);
  const idFrontText = useSearchIdStore((state) => state.searchIdFront);
  const idBackText = useSearchIdStore((state) => state.searchIdBack);
  const shapeSelected = useSearchIdStore((state) => state.searchIdShapes);
  const colorSelected = useSearchIdStore((state) => state.searchIdColors);
  const setIdFrontText = useSearchIdStore((state) => state.setSearchIdFront);
  const setIdBackText = useSearchIdStore((state) => state.setSearchIdBack);
  const setShapeSelected = useSearchIdStore((state) => state.setSearchIdShapes);
  const setColorSelected = useSearchIdStore((state) => state.setSearchIdColors);
  const getSearchIdItems = useSearchIdStore((state) => state.getSearchIdItems);
  const handlePressInit = useSearchIdStore((state) => state.resetSearchId);

  const setIdText = { front: setIdFrontText, back: setIdBackText };

  const nav: any = useNavigation();

  const handleSetIdText = ({
    text,
    direction,
  }: {
    text: string;
    direction: 'front' | 'back';
  }) => {
    setBtnState(disableWord(text));
    setIdText[direction](text);
  };

  const handlePressItem = (item: TItemData) => {
    const k = item.category + item.key;
    switch (item.category) {
      case 'shape':
        const newShapeSelected = makeNewList(shapeSelected, k, 'shape0');
        setShapeSelected(newShapeSelected);
        break;
      case 'color':
        const newColorSelected = makeNewList(colorSelected, k, 'color0');
        setColorSelected(newColorSelected);
        break;
    }
  };

  const handlePressSearch = () => {
    const data = getSearchIdItems();
    nav.navigate('알약 검색 결과', { data, mode: 0 });
  };

  return {
    btnState,
    idFrontText,
    idBackText,
    handleSetIdText,
    shapeSelected,
    colorSelected,
    handlePressItem,
    handlePressInit,
    handlePressSearch,
  };
};
