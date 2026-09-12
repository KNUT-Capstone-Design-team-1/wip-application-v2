import { create } from 'zustand';
import { InitStatus, DatabaseUpdateStatus, AppInitState } from '../types';

const initialState = {
  status: 'IDLE' as InitStatus,
  updateStatus: 'idle' as DatabaseUpdateStatus,
  updateCurrentTable: null,
  updateCurrentPage: 1,
  totalPages: 1,
  overallProgress: 0,
  errorMessage: null,
  updateModalData: null,
  updateModalResolve: null,
  tablesToUpdate: [],
};

export const useAppInitStore = create<AppInitState>((set) => ({
  ...initialState,
  setStatus: (status) => set({ status }),
  setUpdateStatus: (updateStatus) => set({ updateStatus }),
  setUpdateCurrentTable: (table) => set({ updateCurrentTable: table }),
  setUpdateCurrentPage: (page) => set({ updateCurrentPage: page }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  setOverallProgress: (progress) => set({ overallProgress: progress }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  setUpdateModal: (data, resolve) =>
    set({ updateModalData: data, updateModalResolve: resolve }),
  setTablesToUpdate: (tables) => set({ tablesToUpdate: tables }),
  reset: () => set(initialState),
}));
