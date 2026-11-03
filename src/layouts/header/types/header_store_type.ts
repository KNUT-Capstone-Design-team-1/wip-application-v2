export interface HeaderActionState {
  onHelp: (() => void) | null;
  setHelp: (onHelp: (() => void) | null) => void;
  onSearch: (() => void) | null;
  isSearchOpen: boolean;
  setSearchOpen: (isSearchOpen: boolean) => void;
  setSearch: (onSearch: (() => void) | null) => void;
}

export interface IHeaderTitleStore {
  title: string;
  setTitle: (title: string) => void;
  resetTitle: () => void;
}
