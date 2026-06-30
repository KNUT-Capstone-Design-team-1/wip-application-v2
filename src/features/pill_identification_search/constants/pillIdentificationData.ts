import all from '@assets/images/all.png';
import capsult from '@assets/images/capsult/capsult.png';
import hardCapsult from '@assets/images/capsult/hard-capsult.png';
import softCapsult from '@assets/images/capsult/soft-capsult.png';
import capsultEtc from '@assets/images/capsult/etc.png';
import circle from '@assets/images/shape/circle.png';
import cross from '@assets/images/shape/cross.png';
import diamond from '@assets/images/shape/diamond.png';
import ellipse from '@assets/images/shape/ellipse.png';
import half from '@assets/images/shape/half.png';
import hexagon from '@assets/images/shape/hexagon.png';
import long from '@assets/images/shape/long.png';
import octagon from '@assets/images/shape/octagon.png';
import pentagon from '@assets/images/shape/pentagon.png';
import rectangle from '@assets/images/shape/rectangle.png';
import straight from '@assets/images/shape/straight.png';
import triangle from '@assets/images/shape/triangle.png';
import total from '@assets/images/shape/total.png';
import { IIdentificationSearchData } from '../types/search_id_types';
import {
  SEARCH_CONDITION_LABELS,
  SEARCH_FORM_OPTIONS,
  SEARCH_LINE_OPTIONS,
  SEARCH_SHAPE_OPTIONS,
  SEARCH_COLOR_OPTIONS,
} from '@constants/search';

// section key → store 배열 변수 매핑
export const SECTION_KEY_TO_STORE_KEY: { [key: string]: string } = {
  manufacturerName: 'manufacturerName',
  dividerLineData: 'dividerLineData',
  shape: 'shape',
  colors: 'colors',
};

// section key → textInput store 변수 매핑 (data index 기준)
export const SECTION_KEY_TO_TEXT_STORE_KEYS: { [key: string]: string[] } = {
  sideLabelText: ['sideLabelFrontText', 'sideLabelBackText'],
  productNameText: ['productNameText'],
  companyName: ['companyName'],
};

// 식별 검색에 들어갈 데이터들
export const pillIdentificationData: IIdentificationSearchData = {
  // 앞면, 뒷면 식별 문자
  sideLabelText: {
    type: 'textInput',
    title: SEARCH_CONDITION_LABELS.SIDE_LABEL,
    datas: [
      {
        key: 'front',
        placeholder: '앞면 문자',
        width: '50%',
        parsingDataName: '',
      },
      {
        key: 'back',
        placeholder: '뒷면 문자',
        width: '50%',
        parsingDataName: '',
      },
    ],
  },
  // 제품명
  productNameText: {
    type: 'textInput',
    title: SEARCH_CONDITION_LABELS.ITEM_NAME,
    datas: [
      {
        key: 'product',
        placeholder: '제품명',
        parsingDataName: '',
      },
    ],
  },
  // 제조사명
  companyName: {
    type: 'textInput',
    title: SEARCH_CONDITION_LABELS.ENTP_NAME,
    datas: [
      {
        key: 'company',
        placeholder: '제조사명',
        parsingDataName: '',
      },
    ],
  },

  // 제형
  manufacturerName: {
    type: 'iconButton',
    title: SEARCH_CONDITION_LABELS.FORM,
    datas: [
      {
        iconUrl: all,
        iconColor: '',
        label: SEARCH_FORM_OPTIONS.ALL,
        value: null,
      },
      {
        iconUrl: capsult,
        iconColor: '',
        label: SEARCH_FORM_OPTIONS.PILL,
        value: '정제',
      },
      {
        iconUrl: hardCapsult,
        iconColor: '',
        label: SEARCH_FORM_OPTIONS.HARD_CAPSULE,
        value: '경질캡슐',
      },
      {
        iconUrl: softCapsult,
        iconColor: '',
        label: SEARCH_FORM_OPTIONS.SOFT_CAPSULE,
        value: '연질캡슐',
      },
      {
        iconUrl: capsultEtc,
        iconColor: '',
        label: SEARCH_FORM_OPTIONS.ETC,
        value: '기타',
      },
    ],
  },
  // 분할선
  dividerLineData: {
    type: 'iconButton',
    title: SEARCH_CONDITION_LABELS.LINE,
    datas: [
      {
        iconUrl: all,
        iconColor: '',
        label: SEARCH_LINE_OPTIONS.ALL,
        value: null,
      },
      {
        iconUrl: circle,
        iconColor: '',
        label: SEARCH_LINE_OPTIONS.NONE,
        value: '없음',
      },
      {
        iconUrl: cross,
        iconColor: '',
        label: SEARCH_LINE_OPTIONS.CROSS,
        value: '+',
      },
      {
        iconUrl: straight,
        iconColor: '',
        label: SEARCH_LINE_OPTIONS.STRAIGHT,
        value: '-',
      },
      {
        iconUrl: total,
        iconColor: '',
        label: SEARCH_LINE_OPTIONS.ETC,
      },
    ],
  },
  // 모양
  shape: {
    type: 'iconButton',
    title: SEARCH_CONDITION_LABELS.SHAPE,
    datas: [
      {
        iconUrl: all,
        iconColor: '',
        label: SEARCH_SHAPE_OPTIONS.ALL,
        value: null,
      },
      {
        iconUrl: circle,
        iconColor: '',
        label: SEARCH_SHAPE_OPTIONS.CIRCLE,
        value: '원형',
      },
      {
        iconUrl: ellipse,
        iconColor: '',
        label: SEARCH_SHAPE_OPTIONS.ELLIPSE,
        value: '타원형',
      },
      {
        iconUrl: long,
        iconColor: '',
        label: SEARCH_SHAPE_OPTIONS.LONG,
        value: '장방형',
      },
      {
        iconUrl: half,
        iconColor: '',
        label: SEARCH_SHAPE_OPTIONS.HALF_CIRCLE,
        value: '반원형',
      },
      {
        iconUrl: triangle,
        iconColor: '',
        label: SEARCH_SHAPE_OPTIONS.TRIANGLE,
        value: '삼각형',
      },
      {
        iconUrl: rectangle,
        iconColor: '',
        label: SEARCH_SHAPE_OPTIONS.RECTANGLE,
        value: '사각형',
      },
      {
        iconUrl: diamond,
        iconColor: '',
        label: SEARCH_SHAPE_OPTIONS.DIAMOND,
        value: '마름모형',
      },
      {
        iconUrl: pentagon,
        iconColor: '',
        label: SEARCH_SHAPE_OPTIONS.PENTAGON,
        value: '오각형',
      },
      {
        iconUrl: hexagon,
        iconColor: '',
        label: SEARCH_SHAPE_OPTIONS.HEXAGON,
        value: '육각형',
      },
      {
        iconUrl: octagon,
        iconColor: '',
        label: SEARCH_SHAPE_OPTIONS.OCTAGON,
        value: '팔각형',
      },
      {
        iconUrl: total,
        iconColor: '',
        label: SEARCH_SHAPE_OPTIONS.ETC,
        value: '',
      },
    ],
  },
  // 색상
  colors: {
    type: 'iconButton',
    title: SEARCH_CONDITION_LABELS.COLOR,
    datas: [
      {
        iconUrl: all,
        iconColor: '',
        label: SEARCH_COLOR_OPTIONS.ALL,
        value: null,
      },
      {
        iconUrl: '',
        iconColor: '#fff',
        label: SEARCH_COLOR_OPTIONS.WHITE,
        value: '하양',
      },
      {
        iconUrl: '',
        iconColor: '#FCEC60',
        label: SEARCH_COLOR_OPTIONS.YELLOW,
        value: '노랑',
      },
      {
        iconUrl: '',
        iconColor: '#F19D38',
        label: SEARCH_COLOR_OPTIONS.ORANGE,
        value: '주황',
      },
      {
        iconUrl: '',
        iconColor: '#ED6FD0',
        label: SEARCH_COLOR_OPTIONS.PINK,
        value: '분홍',
      },
      {
        iconUrl: '',
        iconColor: '#EA3323',
        label: SEARCH_COLOR_OPTIONS.RED,
        value: '빨강',
      },
      {
        iconUrl: '',
        iconColor: '#9F4D2E',
        label: SEARCH_COLOR_OPTIONS.BROWN,
        value: '갈색',
      },
      {
        iconUrl: '',
        iconColor: '#97C15C',
        label: SEARCH_COLOR_OPTIONS.YELLOW_GREEN,
        value: '연두',
      },
      {
        iconUrl: '',
        iconColor: '#42943E',
        label: SEARCH_COLOR_OPTIONS.GREEN,
        value: '초록',
      },
      {
        iconUrl: '',
        iconColor: '#377EA5',
        label: SEARCH_COLOR_OPTIONS.BLUE_GREEN,
        value: '청록',
      },
      {
        iconUrl: '',
        iconColor: '#4B68F6',
        label: SEARCH_COLOR_OPTIONS.BLUE,
        value: '파랑',
      },
      {
        iconUrl: '',
        iconColor: '#1627A6',
        label: SEARCH_COLOR_OPTIONS.NAVY,
        value: '남색',
      },
      {
        iconUrl: '',
        iconColor: '#A92274',
        label: SEARCH_COLOR_OPTIONS.PURPLE_RED,
        value: '자주',
      },
      {
        iconUrl: '',
        iconColor: '#8E1BAF',
        label: SEARCH_COLOR_OPTIONS.PURPLE,
        value: '보라',
      },
      {
        iconUrl: '',
        iconColor: '#9E9E9E',
        label: SEARCH_COLOR_OPTIONS.GRAY,
        value: '회색',
      },
      {
        iconUrl: '',
        iconColor: '#1E1E1E',
        label: SEARCH_COLOR_OPTIONS.BLACK,
        value: '검정',
      },
      {
        iconUrl: '',
        iconColor: '#E7E7E7',
        label: SEARCH_COLOR_OPTIONS.TRANSPARENT,
        value: '투명',
      },
    ],
  },
  // 마크
  mark: {
    type: 'other',
    title: SEARCH_CONDITION_LABELS.MARK,
  },
};
