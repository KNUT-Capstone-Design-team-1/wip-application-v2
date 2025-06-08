import { useState } from 'react'
import _ from 'lodash'
import { TItemData } from '@/constants/data'
import { useNavigation } from '@react-navigation/native'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import {
  searchIdBackState,
  searchIdColorState,
  searchIdFrontState,
  searchIdShapeState
} from '@/atoms/searchId'
import { disableWord, makeNewList } from '@/utils/checker'
import { searchIdItems, searchIdStates } from '@/selectors/searchId'


export const useSelectSearchId = () => {
  const [btnState, setBtnState] = useState<boolean>(false)
  const [idFrontText, setIdFrontText] = useRecoilState(searchIdFrontState)
  const [idBackText, setIdBackText] = useRecoilState(searchIdBackState)
  const [shapeSelected, setShapeSelected] = useRecoilState(searchIdShapeState)
  const [colorSelected, setColorSelected] = useRecoilState(searchIdColorState)
  const data = useRecoilValue(searchIdItems)
  const handlePressInit = useResetRecoilState(searchIdStates)

  const setIdText = {
    "front": setIdFrontText,
    "back": setIdBackText,
  }

  const nav: any = useNavigation()

  const handleSetIdText = ({ text, direction }: { text: string, direction: ('front' | 'back') }) => {
    setBtnState(disableWord(text))
    setIdText[direction](text)
  }

  const handlePressItem = (item: TItemData) => {
    const k = item.category + item.key
    switch (item.category) {
      case 'shape':
        const newShapeSelected = makeNewList(shapeSelected, k, 'shape0')
        setShapeSelected(newShapeSelected)
        break
      case 'color':
        const newColorSelected = makeNewList(colorSelected, k, 'color0')
        setColorSelected(newColorSelected)
        break
    }
  }

  const handlePressSearch = () => {
    nav.navigate('알약 검색 결과', { data: data, mode: 0 })
  }

  return {
    btnState,
    idFrontText,
    idBackText,
    handleSetIdText,
    shapeSelected,
    colorSelected,
    handlePressItem,
    handlePressInit,
    handlePressSearch
  }
}