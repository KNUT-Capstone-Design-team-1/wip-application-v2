import { XmlParser } from "./parser";

/** XML 파싱 */
// TODO: table 데이터 파싱 추가 + return 데이터의 구조가 변경될 가능성 있음
type TPillDetailJsonObj = {
  "DOC": {
    "SECTION": {
      "ARTICLE": {
        '@_title'?: string;
        "PARAGRAPH"?: {
          '#text'?: string;
          '@_tagName'?: string;
        }[]
      }[]
    }
  }
}

export const parseXML = (xmlString: string) => {
  const paragraphs: any[] = [];
  const xml = XmlParser.entityDecode(xmlString)
  const xmlParser = XmlParser.getInstance()

  const jsonObj: TPillDetailJsonObj = xmlParser.parse(xml)

  for (const article of jsonObj["DOC"]["SECTION"]["ARTICLE"]) {
    if (article['@_title'] && article['@_title'] !== "") {
      paragraphs.push(article['@_title'])
    }

    if (!article["PARAGRAPH"]) continue

    for (const paragraph of article["PARAGRAPH"]) {
      if (paragraph['#text'] && (paragraph["@_tagName"] ?? 'p') !== 'table') {
        paragraphs.push(paragraph['#text'])
      }
    }
  }

  return paragraphs;
}
