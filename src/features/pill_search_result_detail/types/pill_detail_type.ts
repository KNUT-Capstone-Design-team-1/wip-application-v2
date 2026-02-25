export interface IPillDetail {
  [key: string]: string | undefined;
}

export interface IPillDetailInfoProps {
  data: IPillDetail;
  saveState: boolean;
  onSaveToggle: () => void;
}
