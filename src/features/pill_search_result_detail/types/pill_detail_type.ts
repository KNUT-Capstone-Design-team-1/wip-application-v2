export interface IPillDetail {
  [key: string]: string | undefined;
}

export interface IPillDetailInfoProps {
  data: IPillDetail;
  saveState: boolean;
  onSaveToggle: () => void;
}

export interface IDetailSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  content?: string;
}
