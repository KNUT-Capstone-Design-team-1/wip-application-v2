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

// section key → store 배열 변수 매핑
export const SECTION_KEY_TO_STORE_KEY: { [key: string]: string } = {
  manufacturerName: 'manufacturerName',
  dividerLineData: 'dividerLineData',
  shape: 'shape',
  frontColor: 'frontColor',
  backColor: 'backColor',
};

// section key → textInput store 변수 매핑 (data index 기준)
export const SECTION_KEY_TO_TEXT_STORE_KEYS: { [key: string]: string[] } = {
  sideLabelText: ['sideLabelFrontText', 'sideLabelBackText'],
  productNameText: ['productNameText'],
  companyName: ['companyName'],
};

// 식별 검색에 들어갈 데이터들
export const pillIdentificstionData = {
  // 앞면, 뒷면 식별 문자
  sideLabelText: {
    type: 'textInput',
    title: '식별 문자',
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
    title: '제품명',
    datas: [
      {
        key: 'product',
        placeholder: '제품명',
        parsingDataName: '',
      },
    ],
  },
  // 회사명
  companyName: {
    type: 'textInput',
    title: '제조사명',
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
    title: '제형',
    datas: [
      {
        iconUrl: all,
        iconColor: '',
        label: '전체',
        value: '전체',
      },
      {
        iconUrl: capsult,
        iconColor: '',
        label: '정제',
        value: '정제',
      },
      {
        iconUrl: hardCapsult,
        iconColor: '',
        label: '경질캡슐',
        value: '경질캡슐',
      },
      {
        iconUrl: softCapsult,
        iconColor: '',
        label: '연질캡슐',
        value: '연질캡슐',
      },
      {
        iconUrl: capsultEtc,
        iconColor: '',
        label: '기타',
        value: '기타',
      },
    ],
  },
  // 분할선
  dividerLineData: {
    type: 'iconButton',
    title: '분할선',
    datas: [
      {
        iconUrl: all,
        iconColor: '',
        label: '전체',
        value: '전체',
      },
      {
        iconUrl: circle,
        iconColor: '',
        label: '선없음',
        value: '없음',
      },
      {
        iconUrl: cross,
        iconColor: '',
        label: '십자(+)형',
        value: '+',
      },
      {
        iconUrl: straight,
        iconColor: '',
        label: '일자(-)형',
        value: '-',
      },
      {
        iconUrl: total,
        iconColor: '',
        label: '기타',
      },
    ],
  },
  // 모양
  shape: {
    type: 'iconButton',
    title: '모양',
    datas: [
      {
        iconUrl: all,
        iconColor: '',
        label: '전체',
        value: '전체',
      },
      {
        iconUrl: circle,
        iconColor: '',
        label: '원형',
        value: '원형',
      },
      {
        iconUrl: ellipse,
        iconColor: '',
        label: '타원형',
        value: '타원형',
      },
      {
        iconUrl: long,
        iconColor: '',
        label: '장방형',
        value: '장방형',
      },
      {
        iconUrl: half,
        iconColor: '',
        label: '반원형',
        value: '반원형',
      },
      {
        iconUrl: triangle,
        iconColor: '',
        label: '삼각형',
        value: '삼각형',
      },
      {
        iconUrl: rectangle,
        iconColor: '',
        label: '사각형',
        value: '사각형',
      },
      {
        iconUrl: diamond,
        iconColor: '',
        label: '마름모형',
        value: '마름모형',
      },
      {
        iconUrl: pentagon,
        iconColor: '',
        label: '오각형',
        value: '오각형',
      },
      {
        iconUrl: hexagon,
        iconColor: '',
        label: '육각형',
        value: '육각형',
      },
      {
        iconUrl: octagon,
        iconColor: '',
        label: '팔각형',
        value: '팔각형',
      },
      {
        iconUrl: total,
        iconColor: '',
        label: '기타',
        value: '',
      },
    ],
  },
  // 앞면 색상
  frontColor: {
    type: 'iconButton',
    title: '앞면 색상',
    datas: [
      {
        iconUrl: all,
        iconColor: '',
        label: '전체',
        value: '전체',
      },
      {
        iconUrl: '',
        iconColor: '#fff',
        label: '흰색',
        value: '하양',
      },
      {
        iconUrl: '',
        iconColor: '#FCEC60',
        label: '노란색',
        value: '노랑',
      },
      {
        iconUrl: '',
        iconColor: '#F19D38',
        label: '주황색',
        value: '주황',
      },
      {
        iconUrl: '',
        iconColor: '#ED6FD0',
        label: '분홍색',
        value: '분홍',
      },
      {
        iconUrl: '',
        iconColor: '#EA3323',
        label: '빨간색',
        value: '빨강',
      },
      {
        iconUrl: '',
        iconColor: '#9F4D2E',
        label: '갈색',
        value: '갈색',
      },
      {
        iconUrl: '',
        iconColor: '#97C15C',
        label: '연두색',
        value: '연두',
      },
      {
        iconUrl: '',
        iconColor: '#42943E',
        label: '초록색',
        value: '초록',
      },
      {
        iconUrl: '',
        iconColor: '#377EA5',
        label: '청록색',
        value: '청록',
      },
      {
        iconUrl: '',
        iconColor: '#4B68F6',
        label: '파란색',
        value: '파랑',
      },
      {
        iconUrl: '',
        iconColor: '#1627A6',
        label: '남색',
        value: '남색',
      },
      {
        iconUrl: '',
        iconColor: '#A92274',
        label: '자주색',
        value: '자주',
      },
      {
        iconUrl: '',
        iconColor: '#8E1BAF',
        label: '보라색',
        value: '보라',
      },
      {
        iconUrl: '',
        iconColor: '#9E9E9E',
        label: '회색',
        value: '회색',
      },
      {
        iconUrl: '',
        iconColor: '#1E1E1E',
        label: '검정색',
        value: '검정',
      },
      {
        iconUrl: '',
        iconColor: '#E7E7E7',
        label: '투명색',
        value: '투명',
      },
    ],
  },
  // 뒷면 색상
  backColor: {
    type: 'iconButton',
    title: '뒷면 색상',
    datas: [
      {
        iconUrl: all,
        iconColor: '',
        label: '전체',
        value: '전체',
      },
      {
        iconUrl: '',
        iconColor: '#fff',
        label: '흰색',
        value: '하양',
      },
      {
        iconUrl: '',
        iconColor: '#FCEC60',
        label: '노란색',
        value: '노랑',
      },
      {
        iconUrl: '',
        iconColor: '#F19D38',
        label: '주황색',
        value: '주황',
      },
      {
        iconUrl: '',
        iconColor: '#ED6FD0',
        label: '분홍색',
        value: '분홍',
      },
      {
        iconUrl: '',
        iconColor: '#EA3323',
        label: '빨간색',
        value: '빨강',
      },
      {
        iconUrl: '',
        iconColor: '#9F4D2E',
        label: '갈색',
        value: '갈색',
      },
      {
        iconUrl: '',
        iconColor: '#97C15C',
        label: '연두색',
        value: '연두',
      },
      {
        iconUrl: '',
        iconColor: '#42943E',
        label: '초록색',
        value: '초록',
      },
      {
        iconUrl: '',
        iconColor: '#377EA5',
        label: '청록색',
        value: '청록',
      },
      {
        iconUrl: '',
        iconColor: '#4B68F6',
        label: '파란색',
        value: '파랑',
      },
      {
        iconUrl: '',
        iconColor: '#1627A6',
        label: '남색',
        value: '남색',
      },
      {
        iconUrl: '',
        iconColor: '#A92274',
        label: '자주색',
        value: '자주',
      },
      {
        iconUrl: '',
        iconColor: '#8E1BAF',
        label: '보라색',
        value: '보라',
      },
      {
        iconUrl: '',
        iconColor: '#9E9E9E',
        label: '회색',
        value: '회색',
      },
      {
        iconUrl: '',
        iconColor: '#1E1E1E',
        label: '검정색',
        value: '검정',
      },
      {
        iconUrl: '',
        iconColor: '#E7E7E7',
        label: '투명색',
        value: '투명',
      },
    ],
  },
  // 마크명
  mark: {
    type: 'other',
    title: '마크명',
  },
};
