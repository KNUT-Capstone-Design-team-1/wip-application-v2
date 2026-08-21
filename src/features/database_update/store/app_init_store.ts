import { create } from 'zustand';
import { TDataTable } from '@services/database/types';
import { IUpdateNeeded } from '../utils/updateCheck';

export type InitStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'ERROR' | 'COMPLETED';

export interface AppInitState {
  status: InitStatus;
  updateCurrentTable: TDataTable | null;
  updateCurrentPage: number;
  totalPages: number;
  overallProgress: number;
  updateModalData: IUpdateNeeded[] | null;
  updateModalResolve: ((result: boolean) => void) | null;
  setStatus: (status: InitStatus) => void;
  setUpdateCurrentTable: (table: TDataTable | null) => void;
  setUpdateCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setOverallProgress: (progress: number) => void;
  setUpdateModal: (
    data: IUpdateNeeded[] | null,
    resolve: ((result: boolean) => void) | null,
  ) => void;
  tablesToUpdate: IUpdateNeeded[];
  setTablesToUpdate: (tables: IUpdateNeeded[]) => void;
}

export const useAppInitStore = create<AppInitState>((set) => ({
  status: 'IDLE',
  updateCurrentTable: null,
  updateCurrentPage: 1,
  totalPages: 1,
  overallProgress: 0,
  updateModalData: null,
  updateModalResolve: null,
  tablesToUpdate: [],
  setStatus: (status) => set({ status }),
  setUpdateCurrentTable: (table) => set({ updateCurrentTable: table }),
  setUpdateCurrentPage: (page) => set({ updateCurrentPage: page }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  setOverallProgress: (progress) => set({ overallProgress: progress }),
  setUpdateModal: (data, resolve) =>
    set({ updateModalData: data, updateModalResolve: resolve }),
  setTablesToUpdate: (tables) => set({ tablesToUpdate: tables }),
}));
