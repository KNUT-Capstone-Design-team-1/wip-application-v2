import { X2jOptions, XMLParser } from 'fast-xml-parser';
import heDecode from 'he';

export class XmlParser {
  private static instance: XMLParser;

  public static getInstance = () => {
    if (!XmlParser.instance) {
      console.log('create XmlParser');
      const arrTag = ['SECTION', 'ARTICLE', 'PARAGRAPH'];
      const options: X2jOptions = {
        ignoreAttributes: ['textIndent', 'marginLeft'],
        isArray: (name) => {
          return arrTag.includes(name);
        },
        processEntities: false,
      };
      XmlParser.instance = new XMLParser(options);
    }
    return XmlParser.instance;
  };

  /**
   * HTML Entity 디코딩
   * @param text xml 데이터
   * @returns
   */
  public static entityDecode = (text: string): string => heDecode.decode(text);

  public static hasHtmlTags = (text: string) => /<\/?[a-z][\s\S]*>/i.test(text);
}
