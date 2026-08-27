/**
 * bg-base,#F1F5F9
 * [배경] 앱의 메인 배경색, input 배경색
 *
 * text-title,#0F172A
 * [강조 텍스트] 리스트에서 선택된(Selected) 아이템 텍스트, 큰 헤더 제목, 전체 닫기(Global Close) 'X' 아이콘, 그림자 (opacity 0.1)
 *
 * text-subTitle,#006581
 * [서브 타이틀] 섹션 제목
 *
 * text-label,#2B464A
 * [라벨 텍스트] 콘텐츠 label, 메인 콘텐츠보다 낮은 중요도의 정보
 *
 * text-body,#222222
 * [기본 본문] 긴 성분표, 복용법, 주의사항 등 오랜 시간 읽어야 하는 상세 정보 텍스트 (눈부심 방지)
 *
 * text-sub,#64748B
 * [보조 텍스트] 선택되지 않은(Unselected) 아이템 텍스트, 캡션, 텍스트 인풋 내부의 지우기(Clear) 'X' 아이콘
 *
 * text-disabled,#94A3B8
 * [비활성/안내] 텍스트 인풋 플레이스홀더, 비활성화 버튼, 필터 칩 내부의 작은 삭제 'X' 아이콘
 */

const PALETTE = {
  'color-primary': '#2cb7de',
  'color-primary-pressed': '#249CBF',
  'color-secondary': '#006581',
  'color-secondary-pressed': '#004B61',
  'color-tertiary': '#004A94',
  'color-tertiary-pressed': '#003366',
  'bg-base': '#F1F5F9',
  'bg-surface': '#FFFFFF',
  'bg-tabbar': '#182729',
  'bg-toast': '#001b24',
  'bg-overlay': 'rgba(0, 0, 0, 0.5)', // 모바일 표준
  'bg-camera': '#070C0C',
  'bg-btn-dark': '#182729',
  'bg-btn-gray': '#778385',
  'bg-btn-disabled': '#E2E8F0',
  'text-title': '#0F172A',
  'text-subTitle': '#006581',
  'text-label': '#2B464A',
  'text-body': '#222222',
  'text-sub': '#64748B',
  'text-disabled': '#94A3B8',
  'line-border': '#E2E8F0',
  'line-separator': '#CBD5E1',

  // Highlight
  normal: '#15803D',
  error: '#DC2626',
  alert: '#EA580C',
  item: '#0369A1',
  guide: '#FACC15',

  // Default
  white: '#FFFFFF',
  black: '#000000',

  // Object
  marker: '#F43E1E',
  markerSelected: '#C92F17',
};

export const COLOR = {
  white: PALETTE['white'],
  black: PALETTE['black'],
  normal: PALETTE['normal'],
  error: PALETTE['error'],
  alert: PALETTE['alert'],
  item: PALETTE['item'],
  guide: PALETTE['guide'],
  shadow: PALETTE['text-title'],
  primary: PALETTE['color-primary'],
  primaryPressed: PALETTE['color-primary-pressed'],
  secondary: PALETTE['color-secondary'],
  secondaryPressed: PALETTE['color-secondary-pressed'],
  tertiary: PALETTE['color-tertiary'],
  tertiaryPressed: PALETTE['color-tertiary-pressed'],
  marker: PALETTE['marker'],
  markerSelected: PALETTE['markerSelected'],
};

export const COLOR_BG = {
  base: PALETTE['bg-base'],
  surface: PALETTE['bg-surface'],
  overlay: PALETTE['bg-overlay'],
  tabbar: PALETTE['bg-tabbar'],
  toast: PALETTE['bg-toast'],
  camera: PALETTE['bg-camera'],
  btnDark: PALETTE['bg-btn-dark'],
  btnGray: PALETTE['bg-btn-gray'],
  btnPrimary: PALETTE['color-primary'],
  btnSecondary: PALETTE['color-secondary'],
  btnTertiary: PALETTE['color-tertiary'],
  btnDisabled: PALETTE['bg-btn-disabled'],
  sheetNotice: '#2B464A',
};

export const COLOR_TEXT = {
  title: PALETTE['text-title'],
  subTitle: PALETTE['text-subTitle'],
  label: PALETTE['text-label'],
  body: PALETTE['text-body'],
  sub: PALETTE['text-sub'],
  disabled: PALETTE['text-disabled'],
  white: PALETTE['white'],
};

export const COLOR_LINE = {
  border: PALETTE['line-border'],
  separator: PALETTE['line-separator'],
};
