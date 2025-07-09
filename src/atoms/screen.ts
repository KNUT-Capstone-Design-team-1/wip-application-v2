import { atom } from 'recoil';

export const screenState = atom({ key: 'screenState', default: '홈' });

export const cameraScreenState = atom({
  key: 'cameraScreenState',
  default: false,
});
