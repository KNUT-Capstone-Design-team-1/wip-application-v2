import type { ReactNode } from 'react';

/**
 * 스포트라이트 컷아웃 모양.
 * - `rectangle`: 둥근 사각형(`theme.spotlight.borderRadius` 적용)
 * - `circle`: 원형(타겟을 감싸는 반지름 = max(width,height)/2)
 */
export type Shape = 'rectangle' | 'circle';

/**
 * 말풍선 위치 지정.
 * - `auto`: 타겟 아래 공간이 더 넓으면 `'bottom'`, 아니면 `'top'`
 * - `top`: 타겟 위에 강제 배치
 * - `bottom`: 타겟 아래에 강제 배치
 */
export type TooltipPosition = 'auto' | 'top' | 'bottom';

/**
 * 말풍선 UI 종류.
 * - `button`: 이전/다음/건너뛰기 버튼 + 백드롭 탭으로도 다음 진행 (`GuideTooltip`)
 * - `slide`: 좌우 스와이프 슬라이드 + 페이지 인디케이터 (`GuideSlides`). 백드롭 탭 무시
 */
export type TooltipMode = 'button' | 'slide';

/**
 * 자동 노출 정책.
 * - `always`: `autoStart` 호출 시마다 노출
 * - `once`: 최초 1회만 자동 노출(`StorageAdapter`에 영구 저장). 이후엔 수동 `start()` 만
 * - `never`: 자동 노출 없음(수동 전용)
 *
 * 미지정 시 기본값은 `'once'` (`use_guide.ts` 참고).
 */
export type Visibility = 'always' | 'once' | 'never';

/**
 * 말풍선 등장 애니메이션.
 * - `fade`: opacity 0→1
 * - `scale`: opacity + 살짝 커지며 등장
 * - `none`: 즉시 표시
 */
export type EnterAnimation = 'fade' | 'scale' | 'none';

/**
 * 투어의 한 단계(스텝) 정의.
 */
export interface GuideStep {
  /** `<GuideTarget id>` 와 **정확히 일치**해야 매칭됨. 중복되면 가장 마지막 등록이 이김 */
  id: string;
  /** 말풍선 제목(선택). 생략 시 설명만 표시 */
  title?: string;
  /** 말풍선 본문(필수) */
  description: string;
  /** 컷아웃 모양. 기본 `'rectangle'` */
  shape?: Shape;
  /** 타겟 주변 추가 여백(px). 미지정 시 `theme.spotlight.padding`(기본 8) 사용 */
  padding?: number;
  /** 말풍선 위치. 기본 `'auto'` */
  tooltipPosition?: TooltipPosition;
}

/**
 * 하나의 기능 가이드(투어) 정의. 보통 `features/{feature}/constants/*_tour_constant.ts` 에서 작성.
 */
export interface GuideTour {
  /**
   * 투어 식별자. 영구 저장 키의 suffix 로 쓰임(`guide:seen:{id}`).
   * 다른 feature 와 겹치지 않게.
   */
  id: string;
  /** 스텝 배열. 선언된 순서대로 1→N 진행 */
  steps: GuideStep[];
  /** 자동 노출 정책. 기본 `'once'` */
  visibility?: Visibility;
  /**
   * 콘텐츠 버전. `visibility: 'once'` 와 함께 쓰여 "이미 봤음" 판단 시 비교.
   * 문구/스텝을 바꿨으면 **+1 올려서** 다시 1회 자동 노출. 기본 `1`
   */
  version?: number;
  /** 말풍선 UI. 기본 `'button'` */
  tooltipMode?: TooltipMode;
  /** 등장 애니메이션. 기본 `'fade'` */
  animation?: EnterAnimation;
}

/**
 * "최초 1회" 노출 기록 저장소 어댑터. AsyncStorage / MMKV / 메모리 어느 것이든 가능.
 * 동기/비동기 모두 지원.
 */
export interface StorageAdapter {
  getItem: (key: string) => Promise<string | null> | string | null;
  setItem: (key: string, value: string) => Promise<void> | void;
}

/**
 * 테마. 모든 필드가 선택. 미지정 필드는 `DEFAULT_THEME` 로 머지됨.
 */
export interface GuideTheme {
  /** dim 배경 색. 기본 `'#000'` */
  overlayColor?: string;
  /** dim 불투명도(0~1). 기본 `0.72` */
  overlayOpacity?: number;
  /** 스포트라이트(컷아웃) 스타일 */
  spotlight?: {
    /** 사각형 컷아웃 둥근 모서리(px). 기본 `12` */
    borderRadius?: number;
    /** 타겟 주변 여백(px). `GuideStep.padding` 이 있으면 그걸 우선. 기본 `8` */
    padding?: number;
  };
  /** 말풍선 카드 스타일 */
  tooltip?: {
    backgroundColor?: string;
    titleColor?: string;
    descriptionColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
  };
  /** 말풍선 하단 버튼 */
  button?: {
    /** '다음/완료' 버튼 배경 + 스텝 인디케이터(`1/N`) 색 */
    primaryColor?: string;
    /** '다음/완료' 글자색 */
    textColor?: string;
    /** '이전/건너뛰기' 글자색 */
    skipColor?: string;
  };
  /** 말풍선 꼬리(삼각 화살표) */
  arrow?: {
    /** 삼각 크기(px). `0` 이면 꼬리 렌더 생략. 기본 `8` */
    size?: number;
    /** 꼬리 색. 미지정 시 `tooltip.backgroundColor` 와 동일하게 그려짐 */
    color?: string;
  };
  /** `slide` 모드 페이지 인디케이터 — 비활성 점 색 */
  dotColor?: string;
  /** `slide` 모드 페이지 인디케이터 — 활성 점 색 */
  dotActiveColor?: string;
}

/**
 * 버튼/링크 라벨. 미지정 필드는 한국어 기본값(`DEFAULT_LABELS`)으로 머지됨.
 */
export interface GuideLabels {
  /** 기본 `'다음'` */
  next?: string;
  /** 기본 `'이전'` */
  prev?: string;
  /** 기본 `'건너뛰기'` */
  skip?: string;
  /** 마지막 스텝의 '다음' 자리 라벨. 기본 `'완료'` */
  done?: string;
}

/**
 * `measureInWindow` 결과를 오버레이 기준 좌표로 정규화한 사각형.
 * 플랫폼 상태바/edge-to-edge 오프셋은 측정 단계에서 이미 상쇄된 값.
 */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type GuideChildren = ReactNode;
