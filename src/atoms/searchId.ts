import { atom } from "recoil";

export const searchIdShapeState = atom<string[]>({
  key: 'searchIdShapeState',
  default: ['shape0'],
})

export const searchIdColorState = atom<string[]>({
  key: 'searchIdColorState',
  default: ['color0'],
})

export const searchIdFrontState = atom<string>({
  key: 'searchIdFrontState',
  default: '',
})

export const searchIdBackState = atom<string>({
  key: 'searchIdBackState',
  default: '',
})