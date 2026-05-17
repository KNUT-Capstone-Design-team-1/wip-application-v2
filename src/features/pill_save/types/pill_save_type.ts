export interface IPillSaveData {
  CHART: string;
  ENTP_NAME: string;
  ITEM_NAME: string;
  ITEM_SEQ: string;
  ITEM_IMAGE: string;
}

export interface IPillSaveListProps {
  pillSaveData: IPillSaveData[];
  onDataChange?: () => void;
}

export interface IPillSaveContentProps {
  saveData: IPillSaveData;
  onPressDetail: () => void;
  onPressDelete: () => void;
}
