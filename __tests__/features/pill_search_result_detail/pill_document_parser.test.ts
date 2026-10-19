import { XMLParser } from 'fast-xml-parser';
import { xmlToJson } from '../../../src/features/pill_search_result_detail/utils/xml_parser';

test('단일·반복 절과 조항·문단을 같은 구조로 변환한다', () => {
  const xml =
    '<DOC title="문서"><SECTION title="절"><ARTICLE title="조항"><PARAGRAPH tagName="p">첫 문단</PARAGRAPH><PARAGRAPH tagName="p">두 번째</PARAGRAPH></ARTICLE><ARTICLE title="빈 조항" /></SECTION></DOC>';
  const document = xmlToJson(xml).doc;
  expect(document?.title).toBe('문서');
  expect(
    document?.sections[0].articles[0].paragraphs.map(
      (paragraph) => paragraph.content,
    ),
  ).toEqual(['첫 문단', '두 번째']);
  expect(document?.sections[0].articles[1].paragraphs).toEqual([]);
});

test('표 원문과 텍스트 엔티티·들여쓰기·숫자 문단을 유지한다', () => {
  const xml =
    '<DOC><SECTION><ARTICLE><PARAGRAPH tagName="p" textIndent="0" marginLeft="8">&amp;lt;주의&amp;gt;</PARAGRAPH><PARAGRAPH tagName="table"><![CDATA[<table><tr><td>졸음</td></tr></table>]]></PARAGRAPH><PARAGRAPH tagName="p">123</PARAGRAPH></ARTICLE></SECTION></DOC>';
  const paragraphs = xmlToJson(xml).doc?.sections[0].articles[0].paragraphs;
  expect(paragraphs?.[0]).toEqual({
    tagName: 'p',
    textIndent: '0',
    marginLeft: '8',
    content: '<주의>',
  });
  expect(paragraphs?.[1].table).toBe('<table><tr><td>졸음</td></tr></table>');
  expect(paragraphs?.[2].content).toBe('123');
});

test('빈 문서와 DOC 루트가 없는 입력은 표시하지 않는다', () => {
  expect(xmlToJson('')).toEqual({ doc: null });
  expect(xmlToJson('<OTHER />')).toEqual({ doc: null });
});

test('파싱 예외의 원인을 기록하고 빈 문서를 반환한다', () => {
  const error = new Error('문서 파싱 실패');
  const log = jest.spyOn(console, 'error').mockImplementation(() => {});
  const parse = jest
    .spyOn(XMLParser.prototype, 'parse')
    .mockImplementationOnce(() => {
      throw error;
    });

  try {
    expect(xmlToJson('<DOC />')).toEqual({ doc: null });
    expect(log).toHaveBeenCalledWith('XML Parsing error:', error);
  } finally {
    parse.mockRestore();
    log.mockRestore();
  }
});
