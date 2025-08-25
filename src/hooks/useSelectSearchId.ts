import { useEffect, useState } from "react";
import _ from 'lodash';
import { TItemData } from '@/constants/data';
import { useNavigation } from '@react-navigation/native';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import {
  searchCompanyState,
  searchProductState,
  searchDividingLineState,
  searchDosageState,
  searchIdBackState,
  searchIdColorState,
  searchIdFrontState,
  searchIdShapeState,
  searchMarkState,
} from "@/atoms/searchId";
import { disableWord, makeNewList } from '@/utils/checker';
import { searchIdItems, searchIdStates } from '@/selectors/searchId';

export const useSelectSearchId = () => {
  const [btnState, setBtnState] = useState<boolean>(false);
  // 앞 / 뒷면 문자
  const [idFrontText, setIdFrontText] = useRecoilState(searchIdFrontState);
  const [idBackText, setIdBackText] = useRecoilState(searchIdBackState);
  // 제품명, 화사명
  const [productName, setProductName] = useRecoilState(searchProductState);
  const [companyName, setCompanyName] = useRecoilState(searchCompanyState);
  // 제형
  const [dosageNameSelected, setDosageNameSelected] = useRecoilState(searchDosageState);
  // 분할선
  const [dividingLineSelected, setDividingLineSelected] = useRecoilState(searchDividingLineState);
  // 모양
  const [shapeSelected, setShapeSelected] = useRecoilState(searchIdShapeState);
  // 색상
  const [colorSelected, setColorSelected] = useRecoilState(searchIdColorState);
  // 마크
  const [markSelected, setMarkSelected] = useRecoilState(searchMarkState);

  const data = useRecoilValue(searchIdItems);
  const handlePressInit = useResetRecoilState(searchIdStates);

  // 문자정보 데이터
  const setIdText = {
    front: setIdFrontText,
    back: setIdBackText,
    product: setProductName,
    company: setCompanyName,
  };

  const nav: any = useNavigation();
  const handleSetIdText = ({
    text,
    direction,
  }: {
    text: string;
    direction: 'front' | 'back' | 'product' | 'company';
  }) => {
    setBtnState(disableWord(text));
    setIdText[direction](text);
  };

  const handlePressItem = (item: TItemData, idx: number) => {
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
      case 'dividing':
        const newDividingSelected = makeNewList(dividingLineSelected, k, 'dividing0');
        setDividingLineSelected(newDividingSelected);
        break;
      case 'dosage':
        const newDosageSelected = makeNewList(dosageNameSelected, k, 'dosage0');
        setDosageNameSelected(newDosageSelected);
        break;
    }
  };

  const handlePressMarkData = (res: string) => {
    setMarkSelected(res);
  };

  const handlePressSearch = () => {
    console.log('결과', data);
    nav.navigate('알약 검색 결과', { data: data, mode: 0 });
  };

  return {
    btnState,
    idFrontText,
    idBackText,
    handleSetIdText,
    shapeSelected,
    colorSelected,
    productName,
    companyName,
    dosageNameSelected,
    dividingLineSelected,
    markSelected,
    handlePressItem,
    handlePressInit,
    handlePressSearch,
    handlePressMarkData,
  };
};
