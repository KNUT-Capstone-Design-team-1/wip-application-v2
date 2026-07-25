import { TDataTable } from '@services/database/types';

export interface IDatabaseVersionInfo {
  table: TDataTable;
  label: string;
  schemaVersion: string;
  dataVersion: string;
}
