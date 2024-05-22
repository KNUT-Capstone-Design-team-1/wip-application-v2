/** XML 파싱 */
const parseString = require('react-native-xml2js').parseString as (xml: string, callback: (err: Error, result: any) => void) => void;

export const parseXML = (xmlString: string) => {
  const paragraphs: any[] = [];
  const xml = xmlString;

  const hasHtmlTags = (text: string) => /<\/?[a-z][\s\S]*>/i.test(text);
  const hasTableParas = (text: string) => text.includes('&lt;표 ');

  parseString(xml, (err, result) => {
    if (err !== null) {
      console.log("Error : ", err)
      return
    }
    try {
      const doc = result.DOC;
      const sections = doc.SECTION;

      sections.forEach((section: any) => {
        const articles = section.ARTICLE;
        articles.forEach((article: any) => {
          const paras = article.PARAGRAPH;
          paras.forEach((para: any) => {
            const paragraphText = para._;
            if (!hasHtmlTags(paragraphText)) {
              if (!hasTableParas(paragraphText)) {
                paragraphs.push(para._);
              }
            }
          });
        });
      });
    } catch (e) {
      console.log("Error while processing XML: ", e);
    }
  });
  return paragraphs;
}
