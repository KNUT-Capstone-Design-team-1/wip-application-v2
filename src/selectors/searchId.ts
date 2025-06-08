import { TPillSearchIdParam } from "@/api/db/query";
import { searchIdBackState, searchIdColorState, searchIdFrontState, searchIdShapeState } from "@/atoms/searchId";
import { idSelectData } from "@/constants/data";
import _ from "lodash";
import { selector } from "recoil";

export const searchIdStates = selector({
  key: "searchIdStates",
  get: ({ get }) => {
    const searchIdFront = get(searchIdFrontState)
    const searchIdBack = get(searchIdBackState)
    const searchIdShapes = get(searchIdShapeState)
    const searchIdColors = get(searchIdColorState)

    return {
      searchIdFront,
      searchIdBack,
      searchIdShapes,
      searchIdColors,
    }
  },
  set: ({ reset }) => {
    reset(searchIdFrontState)
    reset(searchIdBackState)
    reset(searchIdShapeState)
    reset(searchIdColorState)
  }
})

export const searchIdItems = selector({
  key: "searchIdItems",
  get: ({ get }) => {
    const searchIdShapes = get(searchIdShapeState)
    const searchIdColors = get(searchIdColorState)
    const searchIdFront = get(searchIdFrontState)
    const searchIdBack = get(searchIdBackState)

    const data: TPillSearchIdParam = {
      PRINT_FRONT: '',
      PRINT_BACK: '',
      DRUG_SHAPE: [],
      COLOR_CLASS1: [],
      COLOR_CLASS2: []
    }

    if (searchIdFront.length > 0) {
      data['PRINT_FRONT'] = '*' + searchIdFront.replace(/(?<=.)|(?=.)/g, "*")
    }

    if (searchIdBack.length > 0) {
      data['PRINT_BACK'] = '*' + searchIdBack.replace(/(?<=.)|(?=.)/g, "*")
    }

    for (const item of idSelectData) {
      item.data.forEach((val) => {
        switch (val.category) {
          case 'shape':
            if (val.category + val.key == "shape0") {
              break
            }

            if (searchIdShapes.includes(val.category + val.key)) {
              data["DRUG_SHAPE"]?.push(val.name)
            }
            break;
          case 'color':
            if (val.category + val.key == "color0") {
              break
            }

            if (searchIdColors.includes(val.category + val.key)) {
              data["COLOR_CLASS1"]?.push(val.name)
              data["COLOR_CLASS2"]?.push(val.name)
            }
            break;
        }
      })
    }

    return data
  },
})