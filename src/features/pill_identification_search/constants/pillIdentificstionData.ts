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

// 식별 검색에 들어갈 데이터들
export const pillIdentificstionData = {
  // 앞면, 뒷면 식별 문자
  sideLabelText: {
    type: 'textInput',
    title: '식별 문자',
    datas: [
      {
        placeholder: '앞면 문자',
        width: '50%',
        parsingDataName: '',
      },
      {
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
      },
      {
        iconUrl: capsult,
        iconColor: '',
        label: '정제',
      },
      {
        iconUrl: hardCapsult,
        iconColor: '',
        label: '경질캡슐',
      },
      {
        iconUrl: softCapsult,
        iconColor: '',
        label: '연질캡슐',
      },
      {
        iconUrl: capsultEtc,
        iconColor: '',
        label: '기타',
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
      },
      {
        iconUrl: circle,
        iconColor: '',
        label: '선없음',
      },
      {
        iconUrl: cross,
        iconColor: '',
        label: '십자(+)형',
      },
      {
        iconUrl: straight,
        iconColor: '',
        label: '일자(-)형',
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
      },
      {
        iconUrl: circle,
        iconColor: '',
        label: '원형',
      },
      {
        iconUrl: ellipse,
        iconColor: '',
        label: '타원형',
      },
      {
        iconUrl: long,
        iconColor: '',
        label: '장방형',
      },
      {
        iconUrl: half,
        iconColor: '',
        label: '반원형',
      },
      {
        iconUrl: triangle,
        iconColor: '',
        label: '삼각형',
      },
      {
        iconUrl: rectangle,
        iconColor: '',
        label: '사각형',
      },
      {
        iconUrl: diamond,
        iconColor: '',
        label: '마름모형',
      },
      {
        iconUrl: pentagon,
        iconColor: '',
        label: '오각형',
      },
      {
        iconUrl: hexagon,
        iconColor: '',
        label: '육각형',
      },
      {
        iconUrl: octagon,
        iconColor: '',
        label: '팔각형',
      },
      {
        iconUrl: total,
        iconColor: '',
        label: '기타',
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
      },
      {
        iconUrl: '',
        iconColor: '#fff',
        label: '흰색',
      },
      {
        iconUrl: '',
        iconColor: '#FCEC60',
        label: '노란색',
      },
      {
        iconUrl: '',
        iconColor: '#F19D38',
        label: '주황색',
      },
      {
        iconUrl: '',
        iconColor: '#ED6FD0',
        label: '분홍색',
      },
      {
        iconUrl: '',
        iconColor: '#EA3323',
        label: '빨간색',
      },
      {
        iconUrl: '',
        iconColor: '#9F4D2E',
        label: '갈색',
      },
      {
        iconUrl: '',
        iconColor: '#97C15C',
        label: '연두색',
      },
      {
        iconUrl: '',
        iconColor: '#42943E',
        label: '초록색',
      },
      {
        iconUrl: '',
        iconColor: '#377EA5',
        label: '청록색',
      },
      {
        iconUrl: '',
        iconColor: '#4B68F6',
        label: '파란색',
      },
      {
        iconUrl: '',
        iconColor: '#1627A6',
        label: '남색',
      },
      {
        iconUrl: '',
        iconColor: '#A92274',
        label: '자주색',
      },
      {
        iconUrl: '',
        iconColor: '#8E1BAF',
        label: '보라색',
      },
      {
        iconUrl: '',
        iconColor: '#9E9E9E',
        label: '회색',
      },
      {
        iconUrl: '',
        iconColor: '#1E1E1E',
        label: '검정색',
      },
      {
        iconUrl: '',
        iconColor: '#E7E7E7',
        label: '투명색',
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
      },
      {
        iconUrl: '',
        iconColor: '#fff',
        label: '흰색',
      },
      {
        iconUrl: '',
        iconColor: '#FCEC60',
        label: '노란색',
      },
      {
        iconUrl: '',
        iconColor: '#F19D38',
        label: '주황색',
      },
      {
        iconUrl: '',
        iconColor: '#ED6FD0',
        label: '분홍색',
      },
      {
        iconUrl: '',
        iconColor: '#EA3323',
        label: '빨간색',
      },
      {
        iconUrl: '',
        iconColor: '#9F4D2E',
        label: '갈색',
      },
      {
        iconUrl: '',
        iconColor: '#97C15C',
        label: '연두색',
      },
      {
        iconUrl: '',
        iconColor: '#42943E',
        label: '초록색',
      },
      {
        iconUrl: '',
        iconColor: '#377EA5',
        label: '청록색',
      },
      {
        iconUrl: '',
        iconColor: '#4B68F6',
        label: '파란색',
      },
      {
        iconUrl: '',
        iconColor: '#1627A6',
        label: '남색',
      },
      {
        iconUrl: '',
        iconColor: '#A92274',
        label: '자주색',
      },
      {
        iconUrl: '',
        iconColor: '#8E1BAF',
        label: '보라색',
      },
      {
        iconUrl: '',
        iconColor: '#9E9E9E',
        label: '회색',
      },
      {
        iconUrl: '',
        iconColor: '#1E1E1E',
        label: '검정색',
      },
      {
        iconUrl: '',
        iconColor: '#E7E7E7',
        label: '투명색',
      },
    ],
  },
  // 마크명
  mark: {
    type: 'other',
    title: '마크명',
  },
};
