import { create } from 'zustand';

interface IScreenStore {
  screen: string;
  setScreen: (screen: string) => void;
}

export const useScreenStore = create<IScreenStore>((set) => ({
  screen: '홈',
  setScreen: (screen) => set({ screen }),
}));

interface ICameraScreenStore {
  cameraScreen: boolean;
  setCameraScreen: (cameraScreen: boolean) => void;
}

export const useCameraScreenStore = create<ICameraScreenStore>((set) => ({
  cameraScreen: false,
  setCameraScreen: (cameraScreen) => set({ cameraScreen }),
}));
