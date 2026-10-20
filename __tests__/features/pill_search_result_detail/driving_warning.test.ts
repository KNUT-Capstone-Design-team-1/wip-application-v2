import { getDrivingWarningKeywords } from '../../../src/features/pill_search_result_detail/services/driving_warning_service';

test('수면장애·진정·인지 기능 치료 설명은 운전 주의로 분류하지 않는다', () => {
  expect(
    getDrivingWarningKeywords(
      '수면장애 및 집중력 개선',
      '진정을 위한 투여',
      '이상반응: 어지러움, 복시',
    ),
  ).toEqual([]);
});

test('운전 문맥의 증상을 추출하고 수면장애를 키워드로 확장하지 않는다', () => {
  expect(
    getDrivingWarningKeywords(
      undefined,
      undefined,
      '수면장애가 나타날 수 있다. 졸음 및 어지러움이 나타날 수 있으므로 운전에 주의한다.',
    ),
  ).toEqual(['졸음', '어지러움', '운전']);
});

test('포괄어와 겹치는 짧은 증상 대신 실제 문구를 반환한다', () => {
  expect(
    getDrivingWarningKeywords(
      '기계 조작 시 판단력 저하, 어지럼증 및 진정작용에 주의한다.',
    ),
  ).toEqual(['기계 조작', '판단력 저하', '어지럼증', '진정작용']);
});

test('XML 속성과 다른 문단의 무관한 증상을 제외한다', () => {
  const xml =
    '<DOC title="운전"><PARAGRAPH>수면장애와 진정</PARAGRAPH><PARAGRAPH><![CDATA[자동차 운전 시 졸음에 주의한다.]]></PARAGRAPH></DOC>';
  expect(getDrivingWarningKeywords(xml)).toEqual(['자동차 운전', '졸음']);
  expect(
    getDrivingWarningKeywords(
      '<DOC title="운전"><PARAGRAPH>수면장애</PARAGRAPH></DOC>',
    ),
  ).toEqual([]);
});

test('표·띄어쓰기 변형과 실제 수면운전 경고를 보존하고 중복을 제거한다', () => {
  expect(
    getDrivingWarningKeywords(
      '<p>수면운전이 보고되었다.</p><table><tr><td>기계조작 시 의식 저하</td></tr></table>',
      '수면운전이 보고되었다.',
    ),
  ).toEqual(['수면운전', '기계조작', '의식 저하']);
});

test('빈 문서에는 키워드를 반환하지 않는다', () => {
  expect(getDrivingWarningKeywords()).toEqual([]);
});

test('탐색을 위해 원문 문구의 공백을 보존한다', () => {
  expect(
    getDrivingWarningKeywords('자동차  운전 시 의식  저하에 주의한다.'),
  ).toEqual(['자동차  운전', '의식  저하']);
});

test('문서 사이 띄어쓰기가 다른 같은 운전 주의 문구는 최초 원문으로 한 번만 표시한다', () => {
  expect(
    getDrivingWarningKeywords(
      '기계 조작 시 의식  저하에 주의한다.',
      '기계조작 시 의식 저하에 주의한다.',
      '<p>기계&nbsp;조작 시 의식 저하에 주의한다.</p>',
    ),
  ).toEqual(['기계 조작', '의식  저하']);
});
