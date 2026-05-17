/**
 * 알약 식별 정보 → 약학정보원(health.kr) 검색 파라미터 매핑 유틸리티
 */

const mapShapeToCode = (shape: string): string => {
  const mapping: Record<string, string> = {
    원형: '1',
    타원형: '2',
    반원형: '3',
    삼각형: '4',
    사각형: '5',
    마름모형: '6',
    장방형: '7',
    오각형: '8',
    육각형: '9',
    팔각형: '10',
    기타: '11',
  };
  return mapping[shape] || '';
};

const mapColorToCode = (color: string): string => {
  const mapping: Record<string, string> = {
    하양: '1',
    노랑: '2',
    주황: '3',
    분홍: '4',
    빨강: '5',
    갈색: '6',
    연두: '7',
    초록: '8',
    청록: '9',
    파랑: '10',
    남색: '11',
    자주: '12',
    보라: '13',
    회색: '14',
    검정: '15',
    투명: '16',
  };
  return mapping[color] || '';
};

const mapLineToCode = (line: string): string => {
  const mapping: Record<string, string> = {
    없음: '1',
    '-': '2',
    '+': '3',
    기타: '4',
  };
  return mapping[line] || '';
};

const mapFormToCode = (form: string): string => {
  const mapping: Record<string, string> = {
    정제: '1',
    경질캡슐: '2',
    연질캡슐: '3',
    기타: '4',
  };
  return mapping[form] || '';
};

/**
 * 검색 조건을 약학정보원(health.kr) 검색 URL로 변환
 */
export const mapToHealthKrUrl = (
  searchParam: any,
  baseUrl: string = 'https://www.health.kr',
): string => {
  const HEALTH_KR_SEARCH_PATH = '/searchIdentity/search.asp';

  // baseUrl이 이미 전체 경로를 포함하고 있는지 확인 (잘못된 데이터 대비)
  let cleanBaseUrl = baseUrl.trim();
  if (cleanBaseUrl.includes(HEALTH_KR_SEARCH_PATH)) {
    cleanBaseUrl = cleanBaseUrl.split(HEALTH_KR_SEARCH_PATH)[0];
  }

  // trailing slash 제거
  if (cleanBaseUrl.endsWith('/')) {
    cleanBaseUrl = cleanBaseUrl.slice(0, -1);
  }

  const searchUrl = `${cleanBaseUrl}${HEALTH_KR_SEARCH_PATH}`;
  const params: string[] = [];

  // 제품명
  if (searchParam.ITEM_NAME) {
    params.push(`drug_name=${encodeURIComponent(searchParam.ITEM_NAME)}`);
  }

  // 업체명
  if (searchParam.ENTP_NAME) {
    params.push(`company_name=${encodeURIComponent(searchParam.ENTP_NAME)}`);
  }

  // 식별문자 (앞/뒤)
  if (searchParam.PRINT_FRONT) {
    params.push(`char_front=${encodeURIComponent(searchParam.PRINT_FRONT)}`);
  }
  if (searchParam.PRINT_BACK) {
    params.push(`char_back=${encodeURIComponent(searchParam.PRINT_BACK)}`);
  }

  // 모양
  if (searchParam.DRUG_SHAPE && searchParam.DRUG_SHAPE.length > 0) {
    const code = mapShapeToCode(searchParam.DRUG_SHAPE[0]);
    if (code) params.push(`id_shape=${code}`);
  }

  // 색상 (앞/뒤)
  if (searchParam.COLOR_CLASS1 && searchParam.COLOR_CLASS1.length > 0) {
    const code = mapColorToCode(searchParam.COLOR_CLASS1[0]);
    if (code) params.push(`id_color=${code}`);
  }
  if (searchParam.COLOR_CLASS2 && searchParam.COLOR_CLASS2.length > 0) {
    const code = mapColorToCode(searchParam.COLOR_CLASS2[0]);
    if (code) params.push(`color_back=${code}`);
  }

  // 분할선 (앞/뒤)
  if (searchParam.LINE_FRONT && searchParam.LINE_FRONT.length > 0) {
    const code = mapLineToCode(searchParam.LINE_FRONT[0]);
    if (code) params.push(`id_line=${code}`);
  }
  if (searchParam.LINE_BACK && searchParam.LINE_BACK.length > 0) {
    const code = mapLineToCode(searchParam.LINE_BACK[0]);
    if (code) params.push(`line_back=${code}`);
  }

  // 제형
  if (searchParam.FORM_CODE && searchParam.FORM_CODE.length > 0) {
    const code = mapFormToCode(searchParam.FORM_CODE[0]);
    if (code) params.push(`id_form=${code}`);
  }

  return params.length > 0 ? `${searchUrl}?${params.join('&')}` : searchUrl;
};
