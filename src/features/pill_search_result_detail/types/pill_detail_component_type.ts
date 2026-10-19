import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import type { IBaseTextProps } from '@components/common/BaseText';
import type { IPillDetail, PillSpecField } from './pill_detail_type';
import type {
  PillDocument,
  PillArticle,
  PillParagraph,
} from './pill_document_type';

export type SafetyExternalUrlKey = 'nifdsUrl' | 'kadaUrl';
export interface PillDetailDataProps {
  data: IPillDetail;
}
export interface WarningKeywordsProps {
  items?: string[] | null;
}
export interface DocumentArticleProps {
  article: PillArticle;
  targetPrefix: string;
}
export interface DocumentParagraphProps {
  paragraph: PillParagraph;
  targetId: string;
}

export interface KeywordTextProps extends IBaseTextProps {
  text: string;
  targetId?: string;
}

export interface TableWebViewProps {
  html: string;
  targetId?: string;
}

export interface SafetyExternalLinkButtonProps {
  title: string;
  urlKey: SafetyExternalUrlKey;
  materialEngName?: string;
}

export interface PillSpecsToggleProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export interface SkeletonBoxProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export interface KeywordInfoRowProps {
  label: string;
  text?: string;
  targetId: string;
}

export interface DetailSectionProps {
  title: string;
  content?: string;
}

export interface SectionItemProps {
  targetPrefix?: string;
  sectionItem: PillDocument | null;
}

export interface WarningRowProps {
  label: string;
  isWarning?: boolean;
  prefixLabel?: string;
  items?: string[] | null;
  footerNote?: string;
}

export interface PillSpecRowsProps {
  fields: readonly PillSpecField[];
  targetPrefix: string;
}
