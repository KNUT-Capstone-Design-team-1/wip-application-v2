import { normalizeChemicalText } from './substance_names';
import {
  ProhibitedDocument,
  PreparedProhibitedDocument,
} from './prohibited_types';

const EXCLUDED_DOCUMENT =
  /table of contents|^introduction\b|^summary of major|washout period|the following clarification|were added to the S6|^prohibited methods|^\*?the world anti-doping code|^\s*•\s*it is clarified/i;
const EXCEPTION_BOUNDARIES: Record<string, RegExp> = {
  S3: /The presence in urine|\bNOTE\b|\bEXCEPTIONS\b/i,
  S5: /DIURETICS AND MASKING AGENTS|\bNOTE\b|\bEXCEPTIONS\b/,
  S6: /\*\s*Bupropion|S6\.B:\s*SPECIFIED|EXCEPTIONS/i,
  S8: /•\s*Cannabidiol|EXCEPTIONS/i,
  S9: /PROHIBITED IN-COMPETITION|\bNOTE\b/i,
};
const SECTION_NOTES: Record<string, string> = {
  P1: 'P1: 특정 종목에서 금지되며 종목별 경기기간 적용 범위를 확인해야 합니다.',
  S3: 'S3: 상시 금지. 일부 흡입 성분에는 용량에 따른 예외가 있습니다.',
  S5: 'S5: 상시 금지. 일부 성분에는 투여 경로에 따른 예외가 있습니다.',
  S6: 'S6: 경기기간 중 금지. 일부 성분은 소변 농도 또는 투여 경로에 따라 적용됩니다.',
  S9: 'S9: 경기기간 중 주사·경구·직장 투여 시 금지됩니다. 다른 투여 경로에는 예외가 있습니다.',
};

// 문서·성분 표기 정규화.
export const normalizeProhibitedPhrase = (value: string) =>
  normalizeChemicalText(value)
    .replace(/([a-z])-\s+([a-z])/g, '$1$2')
    .replace(/metamfetamine/g, 'methamphetamine')
    .replace(/amfetamine/g, 'amphetamine')
    .replace(/\s+/g, ' ')
    .trim();

// 영문 금지 본문 추출.
const extractPositiveContent = (content: string, section: string): string => {
  const korean = content.search(/[가-힣]/);
  const english = korean >= 0 ? content.slice(0, korean) : content;
  const boundary = EXCEPTION_BOUNDARIES[section];

  if (!boundary) {
    return english;
  }

  return english.split(boundary)[0];
};

// 목차·예외·모니터링을 제외한 본문 준비.
export const prepareProhibitedDocument = <T extends ProhibitedDocument>(
  source: T,
): PreparedProhibitedDocument<T> | null => {
  const content = (source.contents || '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();

  if (EXCLUDED_DOCUMENT.test(content)) {
    return null;
  }

  const section = content.match(/\b(S[0-9]|P1)(?=[\s.])/i)?.[1]?.toUpperCase();

  if (!section) {
    return null;
  }

  return {
    source,
    section,
    searchable: normalizeProhibitedPhrase(
      extractPositiveContent(content, section),
    ),
  };
};

// 분류별 적용 조건 안내.
export const sectionNote = (section: string): string => {
  const note = SECTION_NOTES[section];

  if (note) {
    return note;
  }

  if (['S7', 'S8'].includes(section)) {
    return section + ': 경기기간 중 금지됩니다.';
  }

  return section + ': 상시 금지(경기기간 중 및 경기기간 외) 목록에 해당합니다.';
};
