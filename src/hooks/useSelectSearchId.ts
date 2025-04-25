import { useState, useCallback } from 'react'
import _ from 'lodash'
import { idSelectData, TItemData } from '@/constants/data'
import { TPillSearchIdParam } from '@/api/db/query'
import { useNavigation } from '@react-navigation/native'


export const useSelectSearchId = () => {
  const [btnState, setBtnState] = useState<boolean>(false)
  const [idFrontText, setIdFrontText] = useState('')
  const [idBackText, setIdBackText] = useState('')
  const [shapeSelected, setShapeSelected] = useState(['shape0'])
  const [colorSelected, setColorSelected] = useState(['color0'])

  const setIdText = {
    "front": setIdFrontText,
    "back": setIdBackText,
  }

  const nav: any = useNavigation()

  const checkDisableWord = (text: string) => {
    const regex = /[*?]/;
    setBtnState(regex.test(text))
  }

  const handleSetIdText = ({ text, direction }: { text: string, direction: ('front' | 'back') }) => {
    checkDisableWord(text)
    setIdText[direction](text)
  }

  const handlePressItem = useCallback((item: TItemData) => {
    const k = item.category + item.key
    switch (item.category) {
      case 'shape':
        const newShapeSelected = _.xor(shapeSelected, [k])
        if (newShapeSelected.length === 0) {
          newShapeSelected.push('shape0')
        } else {
          if (item.default) {
            _.remove(newShapeSelected, (i) => i !== 'shape0')
          } else {
            _.pull(newShapeSelected, 'shape0')
          }
        }
        setShapeSelected(newShapeSelected)
        break;
      case 'color':
        const newColorSelected = _.xor(colorSelected, [k])
        if (newColorSelected.length === 0) {
          newColorSelected.push('color0')
        } else {
          if (item.default) {
            _.remove(newColorSelected, (i) => i !== 'color0')
          } else {
            _.pull(newColorSelected, 'color0')
          }
        }
        setColorSelected(newColorSelected)
        break;
    }
  }, [shapeSelected, colorSelected])

  const handlePressInit = () => {
    setIdFrontText('')
    setIdBackText('')
    setShapeSelected(['shape0'])
    setColorSelected(['color0'])
  }

  const handlePressSearch = () => {
    const data: TPillSearchIdParam = {
      PRINT_FRONT: '',
      PRINT_BACK: '',
      DRUG_SHAPE: [],
      COLOR_CLASS1: [],
      COLOR_CLASS2: []
    }

    if (idFrontText !== "") {
      data['PRINT_FRONT'] = '*' + idFrontText.replace(/(?<=.)|(?=.)/g, "*")
    }

    if (idBackText !== "") {
      data['PRINT_BACK'] = '*' + idBackText.replace(/(?<=.)|(?=.)/g, "*")
    }

    for (const item of idSelectData) {
      item.data.forEach((val) => {
        switch (val.category) {
          case 'shape':
            if (val.category + val.key == "shape0") {
              break
            }

            if (shapeSelected.includes(val.category + val.key)) {
              data["DRUG_SHAPE"]?.push(val.name)
            }
            break;
          case 'color':
            if (val.category + val.key == "color0") {
              break
            }

            if (colorSelected.includes(val.category + val.key)) {
              data["COLOR_CLASS1"]?.push(val.name)
              data["COLOR_CLASS2"]?.push(val.name)
            }
            break;
        }
      })
    }

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