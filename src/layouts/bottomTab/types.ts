export interface TabItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onPress: () => void;
  isCenter?: boolean;
  size?: number;
}

export interface TabConfig {
  key: string;
  label: string;
  icon: (isActive: boolean) => React.ReactNode;
  path: string;
  isCenter: boolean;
  size?: number;
}
