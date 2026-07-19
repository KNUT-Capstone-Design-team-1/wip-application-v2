import { xmlToJson } from '../../src/features/pill_search_result_detail/utils/xml_parser';

const EE_MOCK = `<DOC title="효능효과" type="EE">
<SECTION title="">
    <ARTICLE title="1. 천식의 방지 및 지속적 치료" />
    <ARTICLE title="2. 계절 및 연중 알레르기비염 증상 완화" />
    </SECTION>
</DOC>`;

const EE_result = {
  doc: {
    title: '효능효과',
    sections: [
      {
        title: '',
        articles: [
          {
            title: '1. 천식의 방지 및 지속적 치료',
            content: '',
          },
          {
            title: '2. 계절 및 연중 알레르기비염 증상 완화',
            content: '',
          },
        ],
      },
    ],
  },
};

const UD_MOCK = `<DOC title="용법용량" type="UD">
  <SECTION title="">
    <ARTICLE title="">
      <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[이 약은 1일 1회 복용하되, 천식 환자의 경우 저녁에 복용하고, 알레르기비염 환자의 경우는 환자의 상태에 따라 투약시간을 정한다.]]></PARAGRAPH>
      <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[천식과 알레르기비염이 모두 있는 환자는 1일 1회, 1회 1정, 1포 또는 1장을 저녁에 복용하도록 한다.]]></PARAGRAPH>
      <PARAGRAPH tagName="table" textIndent="0" marginLeft=""><![CDATA[<tbody> 
      <tr> 
  <td style="background-color:transparent; height:25pt; width:105.75pt">&nbsp;</td> 
  <td colspan="2" style="background-color:transparent; border-color:black black black #000000; height:25pt; width:372.7pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">천식 또는 알레르기비염</p> </td> 
  </tr> 
 <tr> 
 <td style="background-color:transparent; border-color:#000000 black black; height:31.4pt; width:105.75pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:left">10 mg 정제</p> </td> 
 <td colspan="2" style="background-color:transparent; border-color:#000000 black black #000000; height:31.4pt; width:372.7pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:left">성인 및 15세 이상의 청소년 : 몬테루카스트로서 1일 1회 10 mg을 경구투여한다.</p> </td> 
 </tr> 
 </tbody>]]></PARAGRAPH>
 </ARTICLE>
 </SECTION>
 </DOC>`;

const UD_result = {
  doc: {
    title: '용법용량',
    sections: [
      {
        title: '',
        articles: [
          {
            title: '',
            paragraphs: [
              {
                tagName: 'p',
                content:
                  '이 약은 1일 1회 복용하되, 천식 환자의 경우 저녁에 복용하고, 알레르기비염 환자의 경우는 환자의 상태에 따라 투약시간을 정한다.',
              },
              {
                tagName: 'p',
                content:
                  '천식과 알레르기비염이 모두 있는 환자는 1일 1회, 1회 1정, 1포 또는 1장을 저녁에 복용하도록 한다.',
              },
              {
                tagName: 'table',
                textIndent: '0',
                table:
                  '<tbody> \n      <tr> \n  <td style="background-color:transparent; height:25pt; width:105.75pt">&nbsp;</td> \n  <td colspan="2" style="background-color:transparent; border-color:black black black #000000; height:25pt; width:372.7pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">천식 또는 알레르기비염</p> </td> \n  </tr> \n <tr> \n <td style="background-color:transparent; border-color:#000000 black black; height:31.4pt; width:105.75pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:left">10 mg 정제</p> </td> \n <td colspan="2" style="background-color:transparent; border-color:#000000 black black #000000; height:31.4pt; width:372.7pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:left">성인 및 15세 이상의 청소년 : 몬테루카스트로서 1일 1회 10 mg을 경구투여한다.</p> </td> \n </tr> \n </tbody>',
              },
            ],
          },
        ],
      },
    ],
  },
};

const NB_MOCK = `<DOC title="사용상주의사항" type="NB">
   <SECTION title="">
     <ARTICLE title="1. 다음 환자에게는 투여하지 말 것">
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[1) 이 약 및 이 약의 구성성분에 과민반응 환자]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[2) 이 약은 유당을 함유하고 있으므로, 갈락토오스 불내성(galactose intolerance), Lapp 유당분해효소 결핍증(Lapp lactase deficiency) 또는 포도당-갈락토오스 흡수장애(glucose-galactose malabsorption) 등의 유전적인 문제가 있는 환자에게는 투여하면 안된다.]]></PARAGRAPH>
     </ARTICLE>
     <ARTICLE title="2. 이상반응">
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[1) 15세 이상의 청소년 및 성인 천식 환자]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[이 약 10 mg의 안전성은 15세 이상의 청소년 및 성인 환자 약 2,950명이 참가한 임상시험을 통해 평가되었다. 위약대조임상시험에서 투여약물과의 관련성은 명확하지 않으나 1% 이상의 빈도를 보이면서 위약군에서보다 투약군에서 더 많이 발생한 이상반응은 다음과 같다. :]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[투여약물과의 관련성은 명확하지 않으나]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[1% 이상의 빈도를 보이면서 위약군에서보다 투약군에서 더 많이 발생한 이상반응]]></PARAGRAPH>
       <PARAGRAPH tagName="table" textIndent="" marginLeft=""><![CDATA[<tbody> 
  <tr> 
   <td style="background-color:transparent; height:30.6pt; width:131.3pt">&nbsp;</td> 
   <td style="background-color:transparent; border-color:black black black #000000; height:30.6pt; width:135.5pt"> <p style="margin-left:0cm; margin-right:0cm">몬테루카스트나트륨 정제</p> <p style="margin-left:0cm; margin-right:0cm">10 mg/day (%, n=1,955)</p> </td> 
   <td style="background-color:transparent; border-color:black black black #000000; height:30.6pt; width:79.5pt"> <p style="margin-left:0cm; margin-right:0cm">위약</p> <p style="margin-left:0cm; margin-right:0cm">(%, n=1,180)</p> </td> 
  </tr> 
  <tr> 
   <td style="background-color:transparent; border-color:#000000 black black; height:76.8pt; width:131.3pt"> <p style="margin-left:0cm; margin-right:0cm">전신</p> <p style="margin-left:4.3pt; margin-right:0cm">무력증/피로</p> <p style="margin-left:4.3pt; margin-right:0cm">발열</p> <p style="margin-left:4.3pt; margin-right:0cm">복통</p> <p style="margin-left:4.3pt; margin-right:0cm">외상</p> </td> 
   <td style="background-color:transparent; border-color:#000000 black black #000000; height:76.8pt; width:135.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.8</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.5</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">2.9</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.0</p> </td> 
   <td style="background-color:transparent; border-color:#000000 black black #000000; height:76.8pt; width:79.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.2</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">0.9</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">2.5</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">0.8</p> </td> 
  </tr> 
  <tr> 
   <td style="background-color:transparent; border-color:#000000 black black; height:60.8pt; width:131.3pt"> <p style="margin-left:0cm; margin-right:0cm">소화기계</p> <p style="margin-left:4.3pt; margin-right:0cm">소화불량</p> <p style="margin-left:4.3pt; margin-right:0cm">감염성 위장염</p> <p style="margin-left:4.3pt; margin-right:0cm">치통</p> </td> 
   <td style="background-color:transparent; border-color:#000000 black black #000000; height:60.8pt; width:135.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">2.1</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.5</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.7</p> </td> 
   <td style="background-color:transparent; border-color:#000000 black black #000000; height:60.8pt; width:79.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.1</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">0.5</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.0</p> </td> 
  </tr> 
  <tr> 
   <td style="background-color:transparent; border-color:#000000 black black; height:44.8pt; width:131.3pt"> <p style="margin-left:0cm; margin-right:0cm">신경정신계</p> <p style="margin-left:4.3pt; margin-right:0cm">어지러움</p> <p style="margin-left:4.3pt; margin-right:0cm">두통</p> </td> 
   <td style="background-color:transparent; border-color:#000000 black black #000000; height:44.8pt; width:135.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.9</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">18.4</p> </td> 
   <td style="background-color:transparent; border-color:#000000 black black #000000; height:44.8pt; width:79.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.4</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">18.1</p> </td> 
  </tr> 
  <tr> 
   <td style="background-color:transparent; border-color:#000000 black black; height:60.8pt; width:131.3pt"> <p style="margin-left:0cm; margin-right:0cm">호흡기계</p> <p style="margin-left:4.3pt; margin-right:0cm">코막힘</p> <p style="margin-left:4.3pt; margin-right:0cm">기침</p> <p style="margin-left:4.3pt; margin-right:0cm">인플루엔자</p> </td> 
   <td style="background-color:transparent; border-color:#000000 black black #000000; height:60.8pt; width:135.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.6</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">2.7</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">4.2</p> </td> 
   <td style="background-color:transparent; border-color:#000000 black black #000000; height:60.8pt; width:79.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.3</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">2.4</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">3.9</p> </td> 
  </tr> 
  <tr> 
   <td style="background-color:transparent; border-color:#000000 black black; height:33.15pt; width:131.3pt"> <p style="margin-left:0cm; margin-right:0cm">피부/피부부속기관</p> <p style="margin-left:4.3pt; margin-right:0cm">발진</p> </td> 
   <td style="background-color:transparent; border-color:#000000 black black #000000; height:33.15pt; width:135.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.6</p> </td> 
   <td style="background-color:transparent; border-color:#000000 black black #000000; height:33.15pt; width:79.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.2</p> </td> 
  </tr> 
  <tr> 
   <td style="background-color:transparent; border-color:#000000 black black; height:63.65pt; width:131.3pt"> <p style="margin-left:0cm; margin-right:0cm">임상검사상의 이상반응＊</p> <p style="margin-left:4.3pt; margin-right:0cm">ALT 증가</p> <p style="margin-left:4.3pt; margin-right:0cm">AST 증가</p> <p style="margin-left:4.3pt; margin-right:0cm">농뇨</p> </td> 
   <td style="background-color:transparent; border-color:#000000 black black #000000; height:63.65pt; width:135.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">2.1</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.6</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.0</p> </td> 
   <td style="background-color:transparent; border-color:#000000 black black #000000; height:63.65pt; width:79.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">2.0</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.2</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">0.9</p> </td> 
  </tr> 
 </tbody>]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[＊ALT 및 AST 측정시에는 투약군에는 1,935명, 위약군에는 1,170명의 환자가 참가하였으며, 농뇨 검사시에는 투약군에는 1,924명, 위약군에는 1,159명의 환자가 참가하였다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[발현빈도가 이보다 낮은 다른 이상반응의 경우 투약군과 위약군간에 차이가 없었다. 누적하여 살펴보았을 때 이 약의 임상시험에서 569명의 환자는 적어도 6개월 동안, 480명의 환자는 1년 동안, 49명의 환자는 2년 동안 이 약을 투여받았다. 투약기간이 길어지더라도 이상반응 발생률은 유의한 변화를 보이지 않았다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[2) 6~14세 사이의 소아 천식 환자]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[이 약 5 mg 의 안전성은 6～14세 사이의 소아 환자 476명이 참가한 임상시험을 통해 평가되었다. 누적하여 살펴보았을 때 이 약의 임상시험에서 289명의 환자는 적어도 6개월 동안, 241명의 환자는 1년 이상의 기간동안 이 약을 투여받았다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[소아 환자를 대상으로 8주 동안 이중맹검법에 의해 실시한 임상시험에서 이 약의 이상반응 발생률은 성인에서 얻은 결과와 전체적으로 유사하였다. 투여약물과의 관련성은 명확하지 않으나 2% 이상의 빈도를 보이면서 위약군의 소아 환자에서보다 투약군의 소아 환자에서 더 많이 발생한 이상반응은 다음과 같다. : 인두염, 인플루엔자, 발열, 부비동염, 구역, 설사, 식욕부진, 귀염, 바이러스성 감염 및 후두염. 발현빈도가 이보다 낮은 이상반응의 경우 투약군과 위약군간에 차이가 없었다. 투약기간이 길어지더라도 이상반응 발생률은 유의한 변화를 보이지 않았다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[성장율을 평가한 임상시험에서 이 약의 안전성 프로필은 기존의 임상시험 결과와 일치하였다. 6～8세의 소아환자를 대상으로 성장율을 평가한 56주간의 이중맹검시험에서, 이 연령군의 소아환자에서 이전에 관찰된 적이 없었던 것으로서, 투여약물과의 관련성은 명확하지 않으나 2% 이상의 빈도를 보이면서 위약군의 소아 환자에서보다 투약군의 소아 환자에서 더 많이 발생한 이상반응은 다음과 같다. : 두통, (감염성)비염, 수두, 위장염, 아토피피부염, 급성 기관지염, 치아 감염, 피부 감염 및 근시]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[3) 2~5세 사이의 소아 천식 환자]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[이 약 4 mg의 안전성은 2～5세 사이의 소아 환자 573명을 대상으로 실시된 단회 또는 반복 투여시험에서 평가되었다. 누적하여 살펴보았을 때, 임상시험에서 2～5세 사이의 소아 환자 426명은 적어도 3개월 이상, 230명은 6개월 이상, 그리고 63명은 1년 이상의 기간 동안 이 약을 투여받았다. 임상시험에서 이 약 4 mg을 1일 1회 취침시 복용할 때 전반적으로 내약성이 우수하였다. 이 약을 투여한 2～5세 사이의 소아환자에서 투여약물과의 관련성은 명확하지 않으나 2% 이상의 빈도를 보이면서 위약군의 소아 환자에서보다 투약군의 소아 환자에서 더 많이 발생한 이상반응은 다음과 같다. : 발열, 기침, 복통, 설사, 두통, 콧물, 부비동염, 귀염, 인플루엔자, 발진, 귀통증, 위장관염, 습진, 두드러기, 수두, 폐렴, 피부염 및 결막염]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[4) 6~23개월 사이의 소아 천식 환자]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[6～12개월 사이의 소아 천식 환자에서의 안전성 및 유효성은 확립되지 않았다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[6～23개월 사이의 소아환자 175명을 대상으로 안전성을 평가한 결과, 6주간 실시한 이중맹검, 위약대조 임상시험에서 이 약의 안전성 프로필은 성인 및 2～14세 사이의 소아환자의 안전성 프로필과 유사하였다. 이 약을 1일 1회 취침 시 투여할 때 전반적으로 내약성이 우수하였다. 이 약을 투여받은 6～23개월 사이의 소아환자에서, 약물과의 인과관계와 무관하게, 투약군의 환자에서 위약군보다 더 많이 발생하고 2%이상의 빈도로 보고된 이상반응은 상기도 감염, 쌕쌕거림, 중이염, 인두염, 편도염, 기침 및 비염이었다. 이보다 낮은 빈도로 보고된 이상반응의 발현율은 위약군과 치료군간에 유사하였다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[5) 15세 이상의 청소년 및 성인 계절 알레르기비염 환자]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[이 약의 안전성은 15세 이상의 청소년 및 성인 환자 2,199명을 대상으로 한 임상시험을 통해 평가되었다. 이 약을 1일 1회 아침 또는 저녁에 투여하였을 때 위약과 유사한 안전성 프로필을 가지면서 대체로 내약성이 우수하였다. 위약 대조 임상시험에서 투여약물과의 관련성은 명확하지 않으나 1% 이상의 빈도를 보이면서 위약군에서보다 투약군에서 더 많이 발생한 이상반응은 다음과 같다. : 상기도 감염(투약군 1.9%, 위약군 1.5%). 4주간 실시한 위약대조 임상 시험에서 관찰된 안전성 프로필은 2주 시험의 경우와 일치하였다. 모든 시험에서 졸음현상의 발현율은 위약군과 유사하였다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[6) 2~14세 사이의 소아 계절성 알레르기비염 환자]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[이 약의 안전성은 2~14세 사이의 소아 환자 280명을 대상으로 실시한 2주간, 다기관, 이중 맹검, 위약 대조, 평행군 안전성 시험에서 평가되었다. 이 약을 1일 1회 저녁에 투여하였을 때 위약과 유사한 안전성 프로필을 가지면서 대체로 내약성이 우수하였다. 이 시험에서 투여약물과의 관련성은 명확하지 않으나 2%이상의 빈도를 보이면서 위약군보다 투약군에서 많이 발생한 이상반응은 다음과 같다. : 두통, 중이염, 인두염 및 상기도 감염]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[7) 15세 이상의 청소년 및 성인 연중 알레르기비염 환자]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[이 약의 안전성은 15세 이상의 청소년 및 성인 연중 알레르기비염 환자 3,357명을 대상으로 한 두 건의 6주간 임상시험에서 평가되었고, 이 중 1,632명이 이 약을 투여받았다. 이 약을 1일 1회 투여하였을 때 전반적으로 내약성이 우수하였고 안전성 프로필은 계절알레르기비염 환자에서 얻은 결과와 일치하였고, 위약과 유사하였다. 이 두 건의 임상시험에서 투여약물과의 관련성은 명확하지 않으나 1%이상의 빈도를 보이면서 위약군보다 투약군에서 많이 발생한 이상반응은 다음과 같다. : 부비동염, 상기도 감염, 굴두통(sinus headache), 기침, 코피 및 ALT 증가. 졸음의 발현율은 위약군과 유사하였다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[8) 6개월~14세 사이의 소아 연중 알레르기비염 환자]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[2~14세 사이의 소아 연중 알레르기비염 환자에 대한 이 약의 안전성은 같은 연령의 계절 알레르기비염 환자의 안전성 자료로 입증된다. 6개월～2세 사이의 소아에 대한 안전성은 이 연령의 천식 환자를 대상으로 한 안전성 및 유효성 평가시험, 약동학 및 성인에서의 약동학 자료로서 입증된다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[9) 임상시험결과 통합분석]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[41건의 위약 대조 임상시험(15세 이상 환자에서의 연구 35건; 6～14세의 소아환자에서의 연구 6건)에서 인증된 평가방법을 사용하여 자살경향에 대하여 통합분석이 실시되었다. 이들 임상시험에서 이 약을 투여한 9,929명과 위약을 투여한 7,780명의 환자 중, 이 약 투여군 중 한명의 환자에서 자살충동이 보고되었다. 두 군 모두에서 자살, 자살시도 또는 이를 준비하기 위한 행동 등은 없었다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[별도로 46건의 위약대조 임상시험(15세 이상 환자에서의 연구 35건; 3개월～14세의 소아환자에서의 연구 11건) 에서 행동-관련 이상반응(behavior-related adverse experiences, BRAEs)에 대한 통합분석이 실시되었다. 이들 임상시험에서 이 약을 투여한 11,673명과 위약을 투여한 8,827명의 환자 중, 적어도 한 건의 BRAE가 보고된 환자는 이 약 투여군에서 2.73%이고 위약 투여군에서 2.27%였다 ; odds ratio는 1.12 (95% CI [0.93; 1.36])이었다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[통합분석에 포함된 임상시험들은 자살경향이나 BRAEs의 평가를 위해 특정하게 계획된 것은 아니었다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[10) 시판후 조사에서 보고된 이상반응]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[다음은 시판후 조사를 통해 추가로 보고된 이상반응이다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="0" marginLeft="2"><![CDATA[(1) 감염 : 상기도 감염]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="0" marginLeft="2"><![CDATA[(2) 혈액 및 림프계 : 출혈빈도 증가]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="0" marginLeft="2"><![CDATA[(3) 면역계 : 과민반응(아나필락시스, 매우 드물게 간 호산구 침윤)]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="0" marginLeft="2"><![CDATA[(4) 정신계 : 공격적 행동 또는 적의를 포함한 초조, 불안, 우울, 지남력장애, 주의력장애, 수면장애 및 환각, 불면, 기억장애, 정신운동과다활동(과민성, 불안정, 진전 포함) 몽유병, 자살 충동 및 행동 (자살 포함)]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="0" marginLeft="2"><![CDATA[(5) 신경계 : 어지러움, 졸음, 지각이상/지각감퇴 및 매우 드물게 경련 발작]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="0" marginLeft="2"><![CDATA[(6) 심혈관계 : 심계항진]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="0" marginLeft="2"><![CDATA[(7) 호흡기계, 흉부 및 종격동 : 코피, 폐 호산구증가증]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="0" marginLeft="2"><![CDATA[(8) 소화기계 : 설사, 소화불량, 구역, 매우 드물게 췌장염, 구토]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="0" marginLeft="2"><![CDATA[(9) 간-담도계 : ALT 및 AST의 증가, 매우 드물게 담즙울체성 간염, 간세포성 간 손상 및 혼합형 간 손상이 보고되었으나, 대부분의 경우는 알코올 섭취나 기타 유형의 간염등과 같은 간질환의 가능성이 있는 환자에게 이 약을 투여했거나, 다른 약을 사용하는 등 다른 복잡한 원인에 의한 것이었다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="0" marginLeft="2"><![CDATA[(10) 피부 및 피하조직 : 혈관부종, 멍, 다형홍반, 결절성 홍반, 가려움, 발진, 두드러기, 중독성표피괴사융해증, 피부점막안증후군]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="0" marginLeft="2"><![CDATA[(11) 근골격계 및 결합조직 : 관절통, 근육경련을 포함한 근육통]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="0" marginLeft="2"><![CDATA[(12) 신장 및 비뇨기계 : 소아에서의 야뇨증]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="0" marginLeft="2"><![CDATA[(13) 전신 및 투여부위 : 무력증/피로, 부종, 발열]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[이 약을 복용한 천식 환자 중 드물게 전신성 호산구증가증이 나타날 수 있으며 Churg-Strauss 증후군과 동일한 임상증상의 혈관염을 나타낸다. 이러한 증상은 때로 코르티코스테로이드 전신요법으로 치료할 수 있다. 전신호산구증가증은 때때로 코르티코스테로이드 경구 투여량의 감소와 관련이 있다. 의사는 환자에서 호산구증가증, 혈관염증성 발진, 폐증상의 악화, 심장합병증 및/또는 신경병증이 발생하는지 신중히 관찰하여야 한다. 이 약과 이러한 제증상의 인과관계는 확립되지 않았다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[11) 국내에서 재심사를 위하여 6년 동안 1,635명을 대상으로 실시한 시판후 사용성적조사결과 이상반응의 발현증례율은 인과관계와 상관없이 28례(1.7%)에서 64건이었다. 이 중 이 약과의 인과관계를 배제할 수 없는 이상반응은 6례(0.37%)에서 6건으로, 구역(2례), 부종, 소화불량, 탈모증, 가려움증이었으며, 이 중 탈모증은 예상하지 못한 약물 이상반응으로 소아환자에서 1례가 보고되었다.]]></PARAGRAPH>
     </ARTICLE>
     <ARTICLE title="3. 일반적주의">
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[1) 이 약은 천식지속상태(status asthmaticus)등 급성 천식 발작시에 나타나는 기관지 경련의 치료제가 아니다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[2) 환자들에게는 적절한 응급 약물을 소지하도록 한다. 이 약은 천식의 급성 악화시에도 계속해서 사용할 수 있다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[3) 의사의 감독하에 흡입용 코르티코스테로이드 제제의 투여량을 점차적으로 줄여나갈 수 있으나, 갑작스럽게 흡입용 혹은 경구용 코르티코스테로이드 제제를 이 약으로 교체하여서는 안된다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[4) 이 약을 투여한 환자에서 신경정신계 증상들이 보고되었다(3. 이상반응 항 참조). 이러한 증상들이 이 약과 인과관계가 있는지는 알려지지 않았다. 의사는 이러한 이상반응에 대하여 환자 또는 보호자에게 이야기하여야 한다. 환자 또는 보호자는 이런 변화가 발생하면 의사에게 알리도록 하여야 한다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[5) 운동에 의해 유발된 기관지 경련의 치료를 위해 이 약을 단독으로 사용해서는 안된다. 운동 이후에 천식이 악화된 환자는 예방 목적으로는 흡입용 β-효능제 상용량을 계속하여 사용하여야 하며, 속효성 흡입용 β-효능제를 응급용으로 사용할 수 있다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[6) 아스피린에 대한 과민반응을 가지고 있는 환자는 이 약을 복용하는 동안 아스피린 혹은 비스테로이드성 소염제를 복용해서는 안된다. 비록 이 약이 아스피린에 대한 과민반응 병력을 가진 환자의 천식시에 기도의 기능을 개선시켜주는데 효과적이기는하나, 이 약이 아스피린 과민성 천식 환자에서 아스피린이나 비스테로이드성 소염제에 의해 유발된 기관지 수축을 치료할 수 있는지에 대해서는 밝혀진 바 없다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[7) 호산구 증가]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[이 약을 복용한 천식 환자 중 드물게 전신호산구증가증이 나타날 수 있으며 Churg-Strauss 증후군과 동일한 임상증상의 혈관염을 나타낸다. 이러한 증상은 때로 코르티코스테로이드 전신요법으로 치료할 수 있다. 전신호산구증가증은 때때로 코르티코스테로이드 경구 투여량의 감소와 관련이 있다. 의사는 환자에서 호산구증가증, 혈관염증성 발진, 폐증상의 악화, 심장합병증 및/또는 신경병증이 발생하는 지 신중히 관찰하여야 한다. 이 약과 이러한 제증상의 인과관계는 확립되지 않았다(3. 이상반응 항 참조).]]></PARAGRAPH>
     </ARTICLE>
     <ARTICLE title="4. 상호작용">
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[1) 이 약과 천식의 예방 및 장기 치료를 위해 상용되는 다른 약물을 함께 투약하였을 때 이상반응이 증가되었다는 보고는 없다. 약물상호작용 연구에서 이 약 상용량은 다음 약물들의 약동학에 임상적으로 중요한 영향을 끼치지 않았다 : 테오필린, 프레드니손, 프레드니솔론, 경구용 피임약(노르에티스테론 1 mg/에티닐에스트라디올 35 ug), 테르페나딘, 디곡신, 와르파린]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[2) 추가적인 약물상호작용 연구를 실시하지는 않았지만, 임상시험에서 이 약을 흔히 처방되는 다양한 약물과 병용투여하였을 때 임상적으로 의미 있는 상호작용은 관찰되지 않았다. 임상시험시에 함께 처방되었던 약물로는 갑상선 호르몬, 진정성 최면제, 비스테로이드성 소염제, 벤조디아제핀, 충혈제거제 등이 있다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[3) 간 대사를 유도하는 페노바르비탈은 10 mg 용량의 몬테루카스트를 1회 투여후 측정한 몬테루카스트의 AUC를 약 40% 감소시킨다. 이 약의 투여용량 조절은 필요하지 않으나, 이 약과 함께 페노바르비탈, 리팜피신 또는 페니토인과 같은 강력한 CYP-450 효소 유도제를 병용투여할 때에는 적절한 임상 모니터링을 실시하는 것이 바람직하다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[4) In vitro 시험에서 몬테루카스트가 CYP2C8의 저해제인 것으로 나타났으나, 이 약과 로시글리타존(CYP2C8로 주로 대사되는 대표적인 약물)의 상호작용 임상시험에서 이 약은 in vivo에서는 CYP2C8을 저해하지 않는 것이 입증되었다. 따라서 몬테루카스트는 CYP2C8에 의해 주로 대사되는 약물(예, 파클리탁셀, 로시글리타존, 레파글리니드)의 대사를 저해시키지 않을 것으로 생각된다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[5) In vitro 연구에서 몬테루카스트는 CYP2C8, CYP2C9 및 CYP3A4의 기질임이 확인되었다. 이 약과 겜피브로질(CYP2C8와 CYP2C9의 저해제)의 약물 상호작용을 확인하기 위한 임상시험을 통해 겜피브로질이 몬테루카스트의 전신 노출을 4.4배 증가시키는 것으로 나타났다. 그리고 강력한 CYP3A4 저해제인 이트라코나졸을 겜피브로질 및 이 약과 병용투여했을 때에는 이 약의 전신 노출이 그 이상 증가하지 않는 것으로 확인되었다. 성인에게 허가된 용량인 10mg보다 고용량으로 투여된 안전성 임상시험 결과(예: 성인에 대하여200mg/1일 22주, 900mg/1일까지 증량하여 약 1주 투여) 임상적으로 중요한 약물 이상반응이 관찰되지 않았고, 이 약의 전신 노출에 대한 겜피브로질의 영향은 임상적으로 의미 있는 영향을 미치지 않는 것으로 판단된다. 따라서, 겜피브로질과 병용투여 시 이 약의 투여용량 조절은 필요하지 않다. In vitro 결과에 근거하였을 때, 이 약은 트리메토프림과 같은 다른 알려진 CYP2C8저해제와 임상적으로 중요한 약물 상호작용을 나타내지 않을 것으로 생각된다. 뿐만 아니라, 이 약과 이트라코나졸만을 함께 투여했을 때도 이 약의 전신 노출의 유의한 증가는 나타나지 않았다.]]></PARAGRAPH>
     </ARTICLE>
     <ARTICLE title="5. 임부 및 수유부에 대한 투여">
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[1) 몬테루카스트를 랫트에게 400 mg/kg/day 용량(성인의 최대 1일 경구 투여량 AUC의 100배 노출에 해당)까지 경구투여할 때, 토끼에게 300 mg/kg/day 용량(성인의 최대 1일 경구 투여량 AUC의 110배 노출에 해당)까지 경구투여 할 때, 기형발생을 관찰할 수 없었다. 이 약은 랫트 및 토끼에서 경구투여후 태반을 통과하는 것으로 보고되었다. 그러나 임부를 대상으로 한 대조시험 결과는 없다. 동물에서의 생식독성시험 결과가 사람에서의 결과와 항상 일치하지는 않으므로 임부에게는 필요성이 명백히 인정되는 경우에만 투여하도록 한다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[2) 전 세계에서 실시된 시판 후 조사에서 임신기간 동안 이 약을 복용한 여성의 자녀에서 선천적인 사지결손이 드물게 보고되었다. 이 여성의 대부분은 임신기간 동안 다른 천식치료제를 복용하였으며, 이 이상반응과 이 약과의 인과관계는 확립되지 않았다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[3) 랫트에서 이 약은 유즙으로 이행되는 것으로 관찰되었다. 이 약이 사람의 모유로 분비되는지는 알려져 있지 않으나, 많은 약이 모유중으로 이행되므로 이 약을 수유부에게 투여할 때에는 주의를 기울여야 한다.]]></PARAGRAPH>
     </ARTICLE>
     <ARTICLE title="6. 소아에 대한 투여">
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[1) 6～14세 사이의 소아 천식 환자에서 이 약의 안전성 및 유효성은 이 연령의 환자를 대상으로 한 임상시험들에 의해서 잘 확립되어 있다. 이 연령 소아 환자에서의 안전성 및 유효성 프로필은 성인에서 나타난 결과와 유사하였다(3. 이상반응 항 참조).]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[2) 2～14세 사이의 소아 계절 알레르기비염 환자 및 6개월～14세 사이의 소아 연중 알레르기비염 환자에 대한 이 약의 유효성은 15세 이상의 알레르기비염 환자에서 확립된 유효성에서 외삽하였으며, 또한 이런 환자군간의 질병의 경과, 병태생리학 및 약물의 효능이 근본적으로 유사하다는 가정을 근거로 하였다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[3) 이 약 4 mg 츄정의 안전성은 2～5세 사이의 소아 천식 환자를 대상으로 한 임상시험들에 의해서 잘 확립되었다(3. 이상반응 항 참조). 이 연령에 대한 이 약의 유효성은 6세 이상의 천식 환자에서 입증된 유효성에서 외삽하였으며, 이런 환자군간의 질병의 경과, 병태생리학 및 약물의 효능이 근본적으로 유사하다는 가정과 상호 유사한 약동학 자료를 근거로 하였다. 이 약의 유효성은 2～5세 사이의 환자를 대상으로 한 대규모 안전성 시험에서 얻은 탐색적 유효성 평가자료로 입증되었다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[4) 이 약 4 mg 세립제의 안전성은 6개월～23개월 사이의 소아 천식 환자 175명을 대상으로 평가하였다. 이 환자군에 대한 안전성 정보는 성인 및 2세 이상의 환자군 및 위약군의 정보와 유사하였다(3. 이상반응 항 참조). 6～23개월 사이의 소아 환자에 대한 이 약의 유효성은 6세 이상의 천식 환자에서 확립된 유효성에서 외삽하였으며, 이런 환자군간의 질병의 경과, 병태생리학 및 약물의 효능이 근본적으로 유사하다는 가정과 상호 유사한 약동학 자료를 근거로 하였다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[5) 2～14세 사이의 소아 알레르기비염 환자에 대한 이 약 4 mg과 5 mg 츄정의 안전성은 같은 연령군의 천식 환자를 대상으로 한 임상시험의 자료에서 입증되었다. 이 연령군의 계절 알레르기비염 환자를 대상으로 한 안전성 시험은 유사한 안전성 프로필을 나타내었다(3. 이상반응 항 참조).]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[6개월 이상의 연중 알레르기비염 환자에 대한 이 약 4 mg 세립제의 안전성은 6～23개월 사이의 소아 천식 환자를 대상으로 한 임상시험에서의 안전성 자료 및 성인의 전신 노출과 6～23개월 사이의 소아환자의 전신 노출을 비교한 약동학 자료에서 외삽하였다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[6) 2건의 대조 임상시험에서 이 약이 사춘기 이전의 소아 천식환자의 성장율에 영향을 주지 않음이 입증되었다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[7) 이 약은 6개월～14세 사이의 소아 환자를 대상으로 임상시험을 실시하였다. 12개월 미만의 소아 천식 환자 및 6개월 미만의 소아 연중 알레르기비염 환자에서의 안전성 및 유효성은 확립되어 있지 않다.]]></PARAGRAPH>
     </ARTICLE>
     <ARTICLE title="7. 고령자에 대한 투여">
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[이 약의 전체 임상시험 대상자중 65세 이상의 노인은 3.5%였으며 75세 이상의 노인은 0.4%였다. 고령자군과 젊은 환자군간에 안전성 또는 유효성의 전체적인 차이는 관찰되지 않았으며 다른 임상적 차이도 보고되지 않았다. 그러나 고령자에서 이약에 대한 반응성이 증가될 가능성은 배제할 수 없다.]]></PARAGRAPH>
     </ARTICLE>
     <ARTICLE title="8. 과량투여시의 처치">
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[1) 몬테루카스트를 마우스에게 5,000 mg/kg 용량(성인 및 소아의 최대 1일 경구 투여량 AUC의 각각 335배 및 210배 노출에 해당)까지 1회 경구투여할 때, 랫트에게 5,000 mg/kg 용량(성인및 소아의 최대 1일 경구 투여량 AUC의 각각 230배 및 145배 노출에 해당)까지 1회 경구투여할 때, 치사된 동물은 없었다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[2) 이 약을 과량투여했을 때 사용할 수 있는 특이적인 처치법은 없다. 장기 천식 연구에서 환자들에게 22주 동안 몬테루카스트를 1일 200 mg 용량까지 투여했을 때나, 단기 연구에서 환자들에게 1주 동안 몬테루카스트를 1일 900 mg 용량까지 투여했을 때에도 임상적으로 중요한 이상반응은 관찰되지 않았다. 과량투여시에는 일반적인 대증치료(예를 들면 흡수되지 않은 약물을 위장관계로부터 제거하고 임상 모니터링을 실시하며, 필요한 경우에는 보조적인 치료를 실시)를 하는 것이 합리적이다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[3) 시판후 조사와 임상 시험에서 성인 및 소아가 이 약을 1,000 mg까지 과량 투여한 것이 보고되었으나, 관찰된 임상증상이나 임상검사 결과가 성인 및 소아환자의 안전성 정보와 차이가 없었다. 가장 많이 보고된 이상반응은 복통, 졸음, 갈증, 두통, 구토 및 정신운동성 활동항진 등이고, 이 약의 안전성 정보와 일치하였다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[4) 이 약이 복막 투석이나 혈액투석으로 제거되는지는 알려져 있지 않다.]]></PARAGRAPH>
     </ARTICLE>
     <ARTICLE title="9. 적용상의 주의">
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[1) 빛에 불안정하기 때문에 복용의 준비를 할 수 있을 때까지 개봉하지 않는다. 부드러운 음식, 조제우유 또는 모유와 혼합했을 경우에도 방치하지 않고 즉시(15분 이내) 복용한다(세립제에 한함).]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[2) 빛에 불안정하기 때문에 복용의 준비를 할 수 있을 때까지 개봉하지 않는다. 물에 현탁하였을 경우에도 방치하지 않고 즉시(15분 이내) 복용한다(시럽제에 한함.).]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[3) 빛에 불안정하기 때문에, 재분포 하지 않는다(세립제, 시럽제에 한함.).]]></PARAGRAPH>
     </ARTICLE>
     <ARTICLE title="10. 보관 및 취급상의 주의사항">
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[1) 어린이의 손이 닿지 않는 곳에 보관한다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[2) 다른 용기에 바꾸어 넣는 것은 사고원인이 되거나 품질 유지면에서 바람직하지 않으므로 이를 주의한다.]]></PARAGRAPH>
     </ARTICLE>
     <ARTICLE title="11. 의약품 동등성시험 정보">
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[(전문가용 정보가 있는 경우 기재함)]]></PARAGRAPH>
     </ARTICLE>
     <ARTICLE title="12. 기타">
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[환자를 위한 정보]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[1) 이 약은 천식이 악화되는 기간뿐 아니라 증상이 없는 기간 동안에도 처방에 따라 매일 복용하여야 하며, 천식이 잘 조절되지 않을 때에는 담당의사와 상의하도록 한다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[2) 이 약은 급성 천식 발작시의 치료제가 아니며, 천식 악화시를 대비하여 적절한 속효성 흡입용 β-효능제를 소지하도록 한다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[3) 이 약을 복용하는 동안 속효성 흡입용 기관지 확장제가 평소보다 더 자주 필요하게 되거나, 속효성 기관지 확장제의 1일 최대 처방 횟수 이상으로 흡입이 필요하게 되면, 의사의 진찰을 받도록 한다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[4) 의사가 지시한 경우가 아니라면, 이 약을 복용하는 동안 다른 천식 치료제의 투여량을 줄이거나 복용을 중단해서는 안된다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[5) 운동에 의해 유발되는 천식환자의 경우, 의사가 별도로 지시한 경우가 아니라면 예방 목적으로 흡입용 β-효능제 상용량을 계속하여 사용하여야 한다. 또한 모든 환자는 응급용으로 속효성 흡입용 β-효능제를 소지하도록 한다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[6) 환자가 이 약 복용 중에 신경정신계 증상이 발생하면 의사에게 알리도록 하여야 한다.]]></PARAGRAPH>
       <PARAGRAPH tagName="p" textIndent="" marginLeft=""><![CDATA[7) 아스피린에 대한 과민반응을 가지고 있는 환자의 경우, 이 약을 복용하는 동안 아스피린이나 비스테로이드성 소염제를 복용하지 않도록 한다.]]></PARAGRAPH>
     </ARTICLE>
   </SECTION>
 </DOC>`;

const NB_result = {
  doc: {
    title: '사용상주의사항',
    sections: [
      {
        title: '',
        articles: [
          {
            title: '1. 다음 환자에게는 투여하지 말 것',
            paragraphs: [
              {
                tagName: 'p',
                content: '1) 이 약 및 이 약의 구성성분에 과민반응 환자',
              },
              {
                tagName: 'p',
                content:
                  '2) 이 약은 유당을 함유하고 있으므로, 갈락토오스 불내성(galactose intolerance), Lapp 유당분해효소 결핍증(Lapp lactase deficiency) 또는 포도당-갈락토오스 흡수장애(glucose-galactose malabsorption) 등의 유전적인 문제가 있는 환자에게는 투여하면 안된다.',
              },
            ],
          },
          {
            title: '2. 이상반응',
            paragraphs: [
              {
                tagName: 'p',
                content: '1) 15세 이상의 청소년 및 성인 천식 환자',
              },
              {
                tagName: 'p',
                content:
                  '이 약 10 mg의 안전성은 15세 이상의 청소년 및 성인 환자 약 2,950명이 참가한 임상시험을 통해 평가되었다. 위약대조임상시험에서 투여약물과의 관련성은 명확하지 않으나 1% 이상의 빈도를 보이면서 위약군에서보다 투약군에서 더 많이 발생한 이상반응은 다음과 같다. :',
              },
              {
                tagName: 'p',
                content: '투여약물과의 관련성은 명확하지 않으나',
              },
              {
                tagName: 'p',
                content:
                  '1% 이상의 빈도를 보이면서 위약군에서보다 투약군에서 더 많이 발생한 이상반응',
              },
              {
                tagName: 'table',
                table:
                  '<tbody> \n  <tr> \n   <td style="background-color:transparent; height:30.6pt; width:131.3pt">&nbsp;</td> \n   <td style="background-color:transparent; border-color:black black black #000000; height:30.6pt; width:135.5pt"> <p style="margin-left:0cm; margin-right:0cm">몬테루카스트나트륨 정제</p> <p style="margin-left:0cm; margin-right:0cm">10 mg/day (%, n=1,955)</p> </td> \n   <td style="background-color:transparent; border-color:black black black #000000; height:30.6pt; width:79.5pt"> <p style="margin-left:0cm; margin-right:0cm">위약</p> <p style="margin-left:0cm; margin-right:0cm">(%, n=1,180)</p> </td> \n  </tr> \n  <tr> \n   <td style="background-color:transparent; border-color:#000000 black black; height:76.8pt; width:131.3pt"> <p style="margin-left:0cm; margin-right:0cm">전신</p> <p style="margin-left:4.3pt; margin-right:0cm">무력증/피로</p> <p style="margin-left:4.3pt; margin-right:0cm">발열</p> <p style="margin-left:4.3pt; margin-right:0cm">복통</p> <p style="margin-left:4.3pt; margin-right:0cm">외상</p> </td> \n   <td style="background-color:transparent; border-color:#000000 black black #000000; height:76.8pt; width:135.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.8</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.5</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">2.9</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.0</p> </td> \n   <td style="background-color:transparent; border-color:#000000 black black #000000; height:76.8pt; width:79.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.2</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">0.9</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">2.5</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">0.8</p> </td> \n  </tr> \n  <tr> \n   <td style="background-color:transparent; border-color:#000000 black black; height:60.8pt; width:131.3pt"> <p style="margin-left:0cm; margin-right:0cm">소화기계</p> <p style="margin-left:4.3pt; margin-right:0cm">소화불량</p> <p style="margin-left:4.3pt; margin-right:0cm">감염성 위장염</p> <p style="margin-left:4.3pt; margin-right:0cm">치통</p> </td> \n   <td style="background-color:transparent; border-color:#000000 black black #000000; height:60.8pt; width:135.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">2.1</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.5</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.7</p> </td> \n   <td style="background-color:transparent; border-color:#000000 black black #000000; height:60.8pt; width:79.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.1</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">0.5</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.0</p> </td> \n  </tr> \n  <tr> \n   <td style="background-color:transparent; border-color:#000000 black black; height:44.8pt; width:131.3pt"> <p style="margin-left:0cm; margin-right:0cm">신경정신계</p> <p style="margin-left:4.3pt; margin-right:0cm">어지러움</p> <p style="margin-left:4.3pt; margin-right:0cm">두통</p> </td> \n   <td style="background-color:transparent; border-color:#000000 black black #000000; height:44.8pt; width:135.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.9</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">18.4</p> </td> \n   <td style="background-color:transparent; border-color:#000000 black black #000000; height:44.8pt; width:79.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.4</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">18.1</p> </td> \n  </tr> \n  <tr> \n   <td style="background-color:transparent; border-color:#000000 black black; height:60.8pt; width:131.3pt"> <p style="margin-left:0cm; margin-right:0cm">호흡기계</p> <p style="margin-left:4.3pt; margin-right:0cm">코막힘</p> <p style="margin-left:4.3pt; margin-right:0cm">기침</p> <p style="margin-left:4.3pt; margin-right:0cm">인플루엔자</p> </td> \n   <td style="background-color:transparent; border-color:#000000 black black #000000; height:60.8pt; width:135.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.6</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">2.7</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">4.2</p> </td> \n   <td style="background-color:transparent; border-color:#000000 black black #000000; height:60.8pt; width:79.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.3</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">2.4</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">3.9</p> </td> \n  </tr> \n  <tr> \n   <td style="background-color:transparent; border-color:#000000 black black; height:33.15pt; width:131.3pt"> <p style="margin-left:0cm; margin-right:0cm">피부/피부부속기관</p> <p style="margin-left:4.3pt; margin-right:0cm">발진</p> </td> \n   <td style="background-color:transparent; border-color:#000000 black black #000000; height:33.15pt; width:135.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.6</p> </td> \n   <td style="background-color:transparent; border-color:#000000 black black #000000; height:33.15pt; width:79.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.2</p> </td> \n  </tr> \n  <tr> \n   <td style="background-color:transparent; border-color:#000000 black black; height:63.65pt; width:131.3pt"> <p style="margin-left:0cm; margin-right:0cm">임상검사상의 이상반응＊</p> <p style="margin-left:4.3pt; margin-right:0cm">ALT 증가</p> <p style="margin-left:4.3pt; margin-right:0cm">AST 증가</p> <p style="margin-left:4.3pt; margin-right:0cm">농뇨</p> </td> \n   <td style="background-color:transparent; border-color:#000000 black black #000000; height:63.65pt; width:135.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">2.1</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.6</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.0</p> </td> \n   <td style="background-color:transparent; border-color:#000000 black black #000000; height:63.65pt; width:79.5pt"> <p style="margin-left:0cm; margin-right:0cm; text-align:center">&nbsp;</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">2.0</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">1.2</p> <p style="margin-left:0cm; margin-right:0cm; text-align:center">0.9</p> </td> \n  </tr> \n </tbody>',
              },
              {
                tagName: 'p',
                content:
                  '＊ALT 및 AST 측정시에는 투약군에는 1,935명, 위약군에는 1,170명의 환자가 참가하였으며, 농뇨 검사시에는 투약군에는 1,924명, 위약군에는 1,159명의 환자가 참가하였다.',
              },
              {
                tagName: 'p',
                content:
                  '발현빈도가 이보다 낮은 다른 이상반응의 경우 투약군과 위약군간에 차이가 없었다. 누적하여 살펴보았을 때 이 약의 임상시험에서 569명의 환자는 적어도 6개월 동안, 480명의 환자는 1년 동안, 49명의 환자는 2년 동안 이 약을 투여받았다. 투약기간이 길어지더라도 이상반응 발생률은 유의한 변화를 보이지 않았다.',
              },
              {
                tagName: 'p',
                content: '2) 6~14세 사이의 소아 천식 환자',
              },
              {
                tagName: 'p',
                content:
                  '이 약 5 mg 의 안전성은 6～14세 사이의 소아 환자 476명이 참가한 임상시험을 통해 평가되었다. 누적하여 살펴보았을 때 이 약의 임상시험에서 289명의 환자는 적어도 6개월 동안, 241명의 환자는 1년 이상의 기간동안 이 약을 투여받았다.',
              },
              {
                tagName: 'p',
                content:
                  '소아 환자를 대상으로 8주 동안 이중맹검법에 의해 실시한 임상시험에서 이 약의 이상반응 발생률은 성인에서 얻은 결과와 전체적으로 유사하였다. 투여약물과의 관련성은 명확하지 않으나 2% 이상의 빈도를 보이면서 위약군의 소아 환자에서보다 투약군의 소아 환자에서 더 많이 발생한 이상반응은 다음과 같다. : 인두염, 인플루엔자, 발열, 부비동염, 구역, 설사, 식욕부진, 귀염, 바이러스성 감염 및 후두염. 발현빈도가 이보다 낮은 이상반응의 경우 투약군과 위약군간에 차이가 없었다. 투약기간이 길어지더라도 이상반응 발생률은 유의한 변화를 보이지 않았다.',
              },
              {
                tagName: 'p',
                content:
                  '성장율을 평가한 임상시험에서 이 약의 안전성 프로필은 기존의 임상시험 결과와 일치하였다. 6～8세의 소아환자를 대상으로 성장율을 평가한 56주간의 이중맹검시험에서, 이 연령군의 소아환자에서 이전에 관찰된 적이 없었던 것으로서, 투여약물과의 관련성은 명확하지 않으나 2% 이상의 빈도를 보이면서 위약군의 소아 환자에서보다 투약군의 소아 환자에서 더 많이 발생한 이상반응은 다음과 같다. : 두통, (감염성)비염, 수두, 위장염, 아토피피부염, 급성 기관지염, 치아 감염, 피부 감염 및 근시',
              },
              {
                tagName: 'p',
                content: '3) 2~5세 사이의 소아 천식 환자',
              },
              {
                tagName: 'p',
                content:
                  '이 약 4 mg의 안전성은 2～5세 사이의 소아 환자 573명을 대상으로 실시된 단회 또는 반복 투여시험에서 평가되었다. 누적하여 살펴보았을 때, 임상시험에서 2～5세 사이의 소아 환자 426명은 적어도 3개월 이상, 230명은 6개월 이상, 그리고 63명은 1년 이상의 기간 동안 이 약을 투여받았다. 임상시험에서 이 약 4 mg을 1일 1회 취침시 복용할 때 전반적으로 내약성이 우수하였다. 이 약을 투여한 2～5세 사이의 소아환자에서 투여약물과의 관련성은 명확하지 않으나 2% 이상의 빈도를 보이면서 위약군의 소아 환자에서보다 투약군의 소아 환자에서 더 많이 발생한 이상반응은 다음과 같다. : 발열, 기침, 복통, 설사, 두통, 콧물, 부비동염, 귀염, 인플루엔자, 발진, 귀통증, 위장관염, 습진, 두드러기, 수두, 폐렴, 피부염 및 결막염',
              },
              {
                tagName: 'p',
                content: '4) 6~23개월 사이의 소아 천식 환자',
              },
              {
                tagName: 'p',
                content:
                  '6～12개월 사이의 소아 천식 환자에서의 안전성 및 유효성은 확립되지 않았다.',
              },
              {
                tagName: 'p',
                content:
                  '6～23개월 사이의 소아환자 175명을 대상으로 안전성을 평가한 결과, 6주간 실시한 이중맹검, 위약대조 임상시험에서 이 약의 안전성 프로필은 성인 및 2～14세 사이의 소아환자의 안전성 프로필과 유사하였다. 이 약을 1일 1회 취침 시 투여할 때 전반적으로 내약성이 우수하였다. 이 약을 투여받은 6～23개월 사이의 소아환자에서, 약물과의 인과관계와 무관하게, 투약군의 환자에서 위약군보다 더 많이 발생하고 2%이상의 빈도로 보고된 이상반응은 상기도 감염, 쌕쌕거림, 중이염, 인두염, 편도염, 기침 및 비염이었다. 이보다 낮은 빈도로 보고된 이상반응의 발현율은 위약군과 치료군간에 유사하였다.',
              },
              {
                tagName: 'p',
                content: '5) 15세 이상의 청소년 및 성인 계절 알레르기비염 환자',
              },
              {
                tagName: 'p',
                content:
                  '이 약의 안전성은 15세 이상의 청소년 및 성인 환자 2,199명을 대상으로 한 임상시험을 통해 평가되었다. 이 약을 1일 1회 아침 또는 저녁에 투여하였을 때 위약과 유사한 안전성 프로필을 가지면서 대체로 내약성이 우수하였다. 위약 대조 임상시험에서 투여약물과의 관련성은 명확하지 않으나 1% 이상의 빈도를 보이면서 위약군에서보다 투약군에서 더 많이 발생한 이상반응은 다음과 같다. : 상기도 감염(투약군 1.9%, 위약군 1.5%). 4주간 실시한 위약대조 임상 시험에서 관찰된 안전성 프로필은 2주 시험의 경우와 일치하였다. 모든 시험에서 졸음현상의 발현율은 위약군과 유사하였다.',
              },
              {
                tagName: 'p',
                content: '6) 2~14세 사이의 소아 계절성 알레르기비염 환자',
              },
              {
                tagName: 'p',
                content:
                  '이 약의 안전성은 2~14세 사이의 소아 환자 280명을 대상으로 실시한 2주간, 다기관, 이중 맹검, 위약 대조, 평행군 안전성 시험에서 평가되었다. 이 약을 1일 1회 저녁에 투여하였을 때 위약과 유사한 안전성 프로필을 가지면서 대체로 내약성이 우수하였다. 이 시험에서 투여약물과의 관련성은 명확하지 않으나 2%이상의 빈도를 보이면서 위약군보다 투약군에서 많이 발생한 이상반응은 다음과 같다. : 두통, 중이염, 인두염 및 상기도 감염',
              },
              {
                tagName: 'p',
                content: '7) 15세 이상의 청소년 및 성인 연중 알레르기비염 환자',
              },
              {
                tagName: 'p',
                content:
                  '이 약의 안전성은 15세 이상의 청소년 및 성인 연중 알레르기비염 환자 3,357명을 대상으로 한 두 건의 6주간 임상시험에서 평가되었고, 이 중 1,632명이 이 약을 투여받았다. 이 약을 1일 1회 투여하였을 때 전반적으로 내약성이 우수하였고 안전성 프로필은 계절알레르기비염 환자에서 얻은 결과와 일치하였고, 위약과 유사하였다. 이 두 건의 임상시험에서 투여약물과의 관련성은 명확하지 않으나 1%이상의 빈도를 보이면서 위약군보다 투약군에서 많이 발생한 이상반응은 다음과 같다. : 부비동염, 상기도 감염, 굴두통(sinus headache), 기침, 코피 및 ALT 증가. 졸음의 발현율은 위약군과 유사하였다.',
              },
              {
                tagName: 'p',
                content: '8) 6개월~14세 사이의 소아 연중 알레르기비염 환자',
              },
              {
                tagName: 'p',
                content:
                  '2~14세 사이의 소아 연중 알레르기비염 환자에 대한 이 약의 안전성은 같은 연령의 계절 알레르기비염 환자의 안전성 자료로 입증된다. 6개월～2세 사이의 소아에 대한 안전성은 이 연령의 천식 환자를 대상으로 한 안전성 및 유효성 평가시험, 약동학 및 성인에서의 약동학 자료로서 입증된다.',
              },
              {
                tagName: 'p',
                content: '9) 임상시험결과 통합분석',
              },
              {
                tagName: 'p',
                content:
                  '41건의 위약 대조 임상시험(15세 이상 환자에서의 연구 35건; 6～14세의 소아환자에서의 연구 6건)에서 인증된 평가방법을 사용하여 자살경향에 대하여 통합분석이 실시되었다. 이들 임상시험에서 이 약을 투여한 9,929명과 위약을 투여한 7,780명의 환자 중, 이 약 투여군 중 한명의 환자에서 자살충동이 보고되었다. 두 군 모두에서 자살, 자살시도 또는 이를 준비하기 위한 행동 등은 없었다.',
              },
              {
                tagName: 'p',
                content:
                  '별도로 46건의 위약대조 임상시험(15세 이상 환자에서의 연구 35건; 3개월～14세의 소아환자에서의 연구 11건) 에서 행동-관련 이상반응(behavior-related adverse experiences, BRAEs)에 대한 통합분석이 실시되었다. 이들 임상시험에서 이 약을 투여한 11,673명과 위약을 투여한 8,827명의 환자 중, 적어도 한 건의 BRAE가 보고된 환자는 이 약 투여군에서 2.73%이고 위약 투여군에서 2.27%였다 ; odds ratio는 1.12 (95% CI [0.93; 1.36])이었다.',
              },
              {
                tagName: 'p',
                content:
                  '통합분석에 포함된 임상시험들은 자살경향이나 BRAEs의 평가를 위해 특정하게 계획된 것은 아니었다.',
              },
              {
                tagName: 'p',
                content: '10) 시판후 조사에서 보고된 이상반응',
              },
              {
                tagName: 'p',
                content:
                  '다음은 시판후 조사를 통해 추가로 보고된 이상반응이다.',
              },
              {
                tagName: 'p',
                textIndent: '0',
                marginLeft: '2',
                content: '(1) 감염 : 상기도 감염',
              },
              {
                tagName: 'p',
                textIndent: '0',
                marginLeft: '2',
                content: '(2) 혈액 및 림프계 : 출혈빈도 증가',
              },
              {
                tagName: 'p',
                textIndent: '0',
                marginLeft: '2',
                content:
                  '(3) 면역계 : 과민반응(아나필락시스, 매우 드물게 간 호산구 침윤)',
              },
              {
                tagName: 'p',
                textIndent: '0',
                marginLeft: '2',
                content:
                  '(4) 정신계 : 공격적 행동 또는 적의를 포함한 초조, 불안, 우울, 지남력장애, 주의력장애, 수면장애 및 환각, 불면, 기억장애, 정신운동과다활동(과민성, 불안정, 진전 포함) 몽유병, 자살 충동 및 행동 (자살 포함)',
              },
              {
                tagName: 'p',
                textIndent: '0',
                marginLeft: '2',
                content:
                  '(5) 신경계 : 어지러움, 졸음, 지각이상/지각감퇴 및 매우 드물게 경련 발작',
              },
              {
                tagName: 'p',
                textIndent: '0',
                marginLeft: '2',
                content: '(6) 심혈관계 : 심계항진',
              },
              {
                tagName: 'p',
                textIndent: '0',
                marginLeft: '2',
                content: '(7) 호흡기계, 흉부 및 종격동 : 코피, 폐 호산구증가증',
              },
              {
                tagName: 'p',
                textIndent: '0',
                marginLeft: '2',
                content:
                  '(8) 소화기계 : 설사, 소화불량, 구역, 매우 드물게 췌장염, 구토',
              },
              {
                tagName: 'p',
                textIndent: '0',
                marginLeft: '2',
                content:
                  '(9) 간-담도계 : ALT 및 AST의 증가, 매우 드물게 담즙울체성 간염, 간세포성 간 손상 및 혼합형 간 손상이 보고되었으나, 대부분의 경우는 알코올 섭취나 기타 유형의 간염등과 같은 간질환의 가능성이 있는 환자에게 이 약을 투여했거나, 다른 약을 사용하는 등 다른 복잡한 원인에 의한 것이었다.',
              },
              {
                tagName: 'p',
                textIndent: '0',
                marginLeft: '2',
                content:
                  '(10) 피부 및 피하조직 : 혈관부종, 멍, 다형홍반, 결절성 홍반, 가려움, 발진, 두드러기, 중독성표피괴사융해증, 피부점막안증후군',
              },
              {
                tagName: 'p',
                textIndent: '0',
                marginLeft: '2',
                content:
                  '(11) 근골격계 및 결합조직 : 관절통, 근육경련을 포함한 근육통',
              },
              {
                tagName: 'p',
                textIndent: '0',
                marginLeft: '2',
                content: '(12) 신장 및 비뇨기계 : 소아에서의 야뇨증',
              },
              {
                tagName: 'p',
                textIndent: '0',
                marginLeft: '2',
                content: '(13) 전신 및 투여부위 : 무력증/피로, 부종, 발열',
              },
              {
                tagName: 'p',
                content:
                  '이 약을 복용한 천식 환자 중 드물게 전신성 호산구증가증이 나타날 수 있으며 Churg-Strauss 증후군과 동일한 임상증상의 혈관염을 나타낸다. 이러한 증상은 때로 코르티코스테로이드 전신요법으로 치료할 수 있다. 전신호산구증가증은 때때로 코르티코스테로이드 경구 투여량의 감소와 관련이 있다. 의사는 환자에서 호산구증가증, 혈관염증성 발진, 폐증상의 악화, 심장합병증 및/또는 신경병증이 발생하는지 신중히 관찰하여야 한다. 이 약과 이러한 제증상의 인과관계는 확립되지 않았다.',
              },
              {
                tagName: 'p',
                content:
                  '11) 국내에서 재심사를 위하여 6년 동안 1,635명을 대상으로 실시한 시판후 사용성적조사결과 이상반응의 발현증례율은 인과관계와 상관없이 28례(1.7%)에서 64건이었다. 이 중 이 약과의 인과관계를 배제할 수 없는 이상반응은 6례(0.37%)에서 6건으로, 구역(2례), 부종, 소화불량, 탈모증, 가려움증이었으며, 이 중 탈모증은 예상하지 못한 약물 이상반응으로 소아환자에서 1례가 보고되었다.',
              },
            ],
          },
          {
            title: '3. 일반적주의',
            paragraphs: [
              {
                tagName: 'p',
                content:
                  '1) 이 약은 천식지속상태(status asthmaticus)등 급성 천식 발작시에 나타나는 기관지 경련의 치료제가 아니다.',
              },
              {
                tagName: 'p',
                content:
                  '2) 환자들에게는 적절한 응급 약물을 소지하도록 한다. 이 약은 천식의 급성 악화시에도 계속해서 사용할 수 있다.',
              },
              {
                tagName: 'p',
                content:
                  '3) 의사의 감독하에 흡입용 코르티코스테로이드 제제의 투여량을 점차적으로 줄여나갈 수 있으나, 갑작스럽게 흡입용 혹은 경구용 코르티코스테로이드 제제를 이 약으로 교체하여서는 안된다.',
              },
              {
                tagName: 'p',
                content:
                  '4) 이 약을 투여한 환자에서 신경정신계 증상들이 보고되었다(3. 이상반응 항 참조). 이러한 증상들이 이 약과 인과관계가 있는지는 알려지지 않았다. 의사는 이러한 이상반응에 대하여 환자 또는 보호자에게 이야기하여야 한다. 환자 또는 보호자는 이런 변화가 발생하면 의사에게 알리도록 하여야 한다.',
              },
              {
                tagName: 'p',
                content:
                  '5) 운동에 의해 유발된 기관지 경련의 치료를 위해 이 약을 단독으로 사용해서는 안된다. 운동 이후에 천식이 악화된 환자는 예방 목적으로는 흡입용 β-효능제 상용량을 계속하여 사용하여야 하며, 속효성 흡입용 β-효능제를 응급용으로 사용할 수 있다.',
              },
              {
                tagName: 'p',
                content:
                  '6) 아스피린에 대한 과민반응을 가지고 있는 환자는 이 약을 복용하는 동안 아스피린 혹은 비스테로이드성 소염제를 복용해서는 안된다. 비록 이 약이 아스피린에 대한 과민반응 병력을 가진 환자의 천식시에 기도의 기능을 개선시켜주는데 효과적이기는하나, 이 약이 아스피린 과민성 천식 환자에서 아스피린이나 비스테로이드성 소염제에 의해 유발된 기관지 수축을 치료할 수 있는지에 대해서는 밝혀진 바 없다.',
              },
              {
                tagName: 'p',
                content: '7) 호산구 증가',
              },
              {
                tagName: 'p',
                content:
                  '이 약을 복용한 천식 환자 중 드물게 전신호산구증가증이 나타날 수 있으며 Churg-Strauss 증후군과 동일한 임상증상의 혈관염을 나타낸다. 이러한 증상은 때로 코르티코스테로이드 전신요법으로 치료할 수 있다. 전신호산구증가증은 때때로 코르티코스테로이드 경구 투여량의 감소와 관련이 있다. 의사는 환자에서 호산구증가증, 혈관염증성 발진, 폐증상의 악화, 심장합병증 및/또는 신경병증이 발생하는 지 신중히 관찰하여야 한다. 이 약과 이러한 제증상의 인과관계는 확립되지 않았다(3. 이상반응 항 참조).',
              },
            ],
          },
          {
            title: '4. 상호작용',
            paragraphs: [
              {
                tagName: 'p',
                content:
                  '1) 이 약과 천식의 예방 및 장기 치료를 위해 상용되는 다른 약물을 함께 투약하였을 때 이상반응이 증가되었다는 보고는 없다. 약물상호작용 연구에서 이 약 상용량은 다음 약물들의 약동학에 임상적으로 중요한 영향을 끼치지 않았다 : 테오필린, 프레드니손, 프레드니솔론, 경구용 피임약(노르에티스테론 1 mg/에티닐에스트라디올 35 ug), 테르페나딘, 디곡신, 와르파린',
              },
              {
                tagName: 'p',
                content:
                  '2) 추가적인 약물상호작용 연구를 실시하지는 않았지만, 임상시험에서 이 약을 흔히 처방되는 다양한 약물과 병용투여하였을 때 임상적으로 의미 있는 상호작용은 관찰되지 않았다. 임상시험시에 함께 처방되었던 약물로는 갑상선 호르몬, 진정성 최면제, 비스테로이드성 소염제, 벤조디아제핀, 충혈제거제 등이 있다.',
              },
              {
                tagName: 'p',
                content:
                  '3) 간 대사를 유도하는 페노바르비탈은 10 mg 용량의 몬테루카스트를 1회 투여후 측정한 몬테루카스트의 AUC를 약 40% 감소시킨다. 이 약의 투여용량 조절은 필요하지 않으나, 이 약과 함께 페노바르비탈, 리팜피신 또는 페니토인과 같은 강력한 CYP-450 효소 유도제를 병용투여할 때에는 적절한 임상 모니터링을 실시하는 것이 바람직하다.',
              },
              {
                tagName: 'p',
                content:
                  '4) In vitro 시험에서 몬테루카스트가 CYP2C8의 저해제인 것으로 나타났으나, 이 약과 로시글리타존(CYP2C8로 주로 대사되는 대표적인 약물)의 상호작용 임상시험에서 이 약은 in vivo에서는 CYP2C8을 저해하지 않는 것이 입증되었다. 따라서 몬테루카스트는 CYP2C8에 의해 주로 대사되는 약물(예, 파클리탁셀, 로시글리타존, 레파글리니드)의 대사를 저해시키지 않을 것으로 생각된다.',
              },
              {
                tagName: 'p',
                content:
                  '5) In vitro 연구에서 몬테루카스트는 CYP2C8, CYP2C9 및 CYP3A4의 기질임이 확인되었다. 이 약과 겜피브로질(CYP2C8와 CYP2C9의 저해제)의 약물 상호작용을 확인하기 위한 임상시험을 통해 겜피브로질이 몬테루카스트의 전신 노출을 4.4배 증가시키는 것으로 나타났다. 그리고 강력한 CYP3A4 저해제인 이트라코나졸을 겜피브로질 및 이 약과 병용투여했을 때에는 이 약의 전신 노출이 그 이상 증가하지 않는 것으로 확인되었다. 성인에게 허가된 용량인 10mg보다 고용량으로 투여된 안전성 임상시험 결과(예: 성인에 대하여200mg/1일 22주, 900mg/1일까지 증량하여 약 1주 투여) 임상적으로 중요한 약물 이상반응이 관찰되지 않았고, 이 약의 전신 노출에 대한 겜피브로질의 영향은 임상적으로 의미 있는 영향을 미치지 않는 것으로 판단된다. 따라서, 겜피브로질과 병용투여 시 이 약의 투여용량 조절은 필요하지 않다. In vitro 결과에 근거하였을 때, 이 약은 트리메토프림과 같은 다른 알려진 CYP2C8저해제와 임상적으로 중요한 약물 상호작용을 나타내지 않을 것으로 생각된다. 뿐만 아니라, 이 약과 이트라코나졸만을 함께 투여했을 때도 이 약의 전신 노출의 유의한 증가는 나타나지 않았다.',
              },
            ],
          },
          {
            title: '5. 임부 및 수유부에 대한 투여',
            paragraphs: [
              {
                tagName: 'p',
                content:
                  '1) 몬테루카스트를 랫트에게 400 mg/kg/day 용량(성인의 최대 1일 경구 투여량 AUC의 100배 노출에 해당)까지 경구투여할 때, 토끼에게 300 mg/kg/day 용량(성인의 최대 1일 경구 투여량 AUC의 110배 노출에 해당)까지 경구투여 할 때, 기형발생을 관찰할 수 없었다. 이 약은 랫트 및 토끼에서 경구투여후 태반을 통과하는 것으로 보고되었다. 그러나 임부를 대상으로 한 대조시험 결과는 없다. 동물에서의 생식독성시험 결과가 사람에서의 결과와 항상 일치하지는 않으므로 임부에게는 필요성이 명백히 인정되는 경우에만 투여하도록 한다.',
              },
              {
                tagName: 'p',
                content:
                  '2) 전 세계에서 실시된 시판 후 조사에서 임신기간 동안 이 약을 복용한 여성의 자녀에서 선천적인 사지결손이 드물게 보고되었다. 이 여성의 대부분은 임신기간 동안 다른 천식치료제를 복용하였으며, 이 이상반응과 이 약과의 인과관계는 확립되지 않았다.',
              },
              {
                tagName: 'p',
                content:
                  '3) 랫트에서 이 약은 유즙으로 이행되는 것으로 관찰되었다. 이 약이 사람의 모유로 분비되는지는 알려져 있지 않으나, 많은 약이 모유중으로 이행되므로 이 약을 수유부에게 투여할 때에는 주의를 기울여야 한다.',
              },
            ],
          },
          {
            title: '6. 소아에 대한 투여',
            paragraphs: [
              {
                tagName: 'p',
                content:
                  '1) 6～14세 사이의 소아 천식 환자에서 이 약의 안전성 및 유효성은 이 연령의 환자를 대상으로 한 임상시험들에 의해서 잘 확립되어 있다. 이 연령 소아 환자에서의 안전성 및 유효성 프로필은 성인에서 나타난 결과와 유사하였다(3. 이상반응 항 참조).',
              },
              {
                tagName: 'p',
                content:
                  '2) 2～14세 사이의 소아 계절 알레르기비염 환자 및 6개월～14세 사이의 소아 연중 알레르기비염 환자에 대한 이 약의 유효성은 15세 이상의 알레르기비염 환자에서 확립된 유효성에서 외삽하였으며, 또한 이런 환자군간의 질병의 경과, 병태생리학 및 약물의 효능이 근본적으로 유사하다는 가정을 근거로 하였다.',
              },
              {
                tagName: 'p',
                content:
                  '3) 이 약 4 mg 츄정의 안전성은 2～5세 사이의 소아 천식 환자를 대상으로 한 임상시험들에 의해서 잘 확립되었다(3. 이상반응 항 참조). 이 연령에 대한 이 약의 유효성은 6세 이상의 천식 환자에서 입증된 유효성에서 외삽하였으며, 이런 환자군간의 질병의 경과, 병태생리학 및 약물의 효능이 근본적으로 유사하다는 가정과 상호 유사한 약동학 자료를 근거로 하였다. 이 약의 유효성은 2～5세 사이의 환자를 대상으로 한 대규모 안전성 시험에서 얻은 탐색적 유효성 평가자료로 입증되었다.',
              },
              {
                tagName: 'p',
                content:
                  '4) 이 약 4 mg 세립제의 안전성은 6개월～23개월 사이의 소아 천식 환자 175명을 대상으로 평가하였다. 이 환자군에 대한 안전성 정보는 성인 및 2세 이상의 환자군 및 위약군의 정보와 유사하였다(3. 이상반응 항 참조). 6～23개월 사이의 소아 환자에 대한 이 약의 유효성은 6세 이상의 천식 환자에서 확립된 유효성에서 외삽하였으며, 이런 환자군간의 질병의 경과, 병태생리학 및 약물의 효능이 근본적으로 유사하다는 가정과 상호 유사한 약동학 자료를 근거로 하였다.',
              },
              {
                tagName: 'p',
                content:
                  '5) 2～14세 사이의 소아 알레르기비염 환자에 대한 이 약 4 mg과 5 mg 츄정의 안전성은 같은 연령군의 천식 환자를 대상으로 한 임상시험의 자료에서 입증되었다. 이 연령군의 계절 알레르기비염 환자를 대상으로 한 안전성 시험은 유사한 안전성 프로필을 나타내었다(3. 이상반응 항 참조).',
              },
              {
                tagName: 'p',
                content:
                  '6개월 이상의 연중 알레르기비염 환자에 대한 이 약 4 mg 세립제의 안전성은 6～23개월 사이의 소아 천식 환자를 대상으로 한 임상시험에서의 안전성 자료 및 성인의 전신 노출과 6～23개월 사이의 소아환자의 전신 노출을 비교한 약동학 자료에서 외삽하였다.',
              },
              {
                tagName: 'p',
                content:
                  '6) 2건의 대조 임상시험에서 이 약이 사춘기 이전의 소아 천식환자의 성장율에 영향을 주지 않음이 입증되었다.',
              },
              {
                tagName: 'p',
                content:
                  '7) 이 약은 6개월～14세 사이의 소아 환자를 대상으로 임상시험을 실시하였다. 12개월 미만의 소아 천식 환자 및 6개월 미만의 소아 연중 알레르기비염 환자에서의 안전성 및 유효성은 확립되어 있지 않다.',
              },
            ],
          },
          {
            title: '7. 고령자에 대한 투여',
            paragraphs: [
              {
                tagName: 'p',
                content:
                  '이 약의 전체 임상시험 대상자중 65세 이상의 노인은 3.5%였으며 75세 이상의 노인은 0.4%였다. 고령자군과 젊은 환자군간에 안전성 또는 유효성의 전체적인 차이는 관찰되지 않았으며 다른 임상적 차이도 보고되지 않았다. 그러나 고령자에서 이약에 대한 반응성이 증가될 가능성은 배제할 수 없다.',
              },
            ],
          },
          {
            title: '8. 과량투여시의 처치',
            paragraphs: [
              {
                tagName: 'p',
                content:
                  '1) 몬테루카스트를 마우스에게 5,000 mg/kg 용량(성인 및 소아의 최대 1일 경구 투여량 AUC의 각각 335배 및 210배 노출에 해당)까지 1회 경구투여할 때, 랫트에게 5,000 mg/kg 용량(성인및 소아의 최대 1일 경구 투여량 AUC의 각각 230배 및 145배 노출에 해당)까지 1회 경구투여할 때, 치사된 동물은 없었다.',
              },
              {
                tagName: 'p',
                content:
                  '2) 이 약을 과량투여했을 때 사용할 수 있는 특이적인 처치법은 없다. 장기 천식 연구에서 환자들에게 22주 동안 몬테루카스트를 1일 200 mg 용량까지 투여했을 때나, 단기 연구에서 환자들에게 1주 동안 몬테루카스트를 1일 900 mg 용량까지 투여했을 때에도 임상적으로 중요한 이상반응은 관찰되지 않았다. 과량투여시에는 일반적인 대증치료(예를 들면 흡수되지 않은 약물을 위장관계로부터 제거하고 임상 모니터링을 실시하며, 필요한 경우에는 보조적인 치료를 실시)를 하는 것이 합리적이다.',
              },
              {
                tagName: 'p',
                content:
                  '3) 시판후 조사와 임상 시험에서 성인 및 소아가 이 약을 1,000 mg까지 과량 투여한 것이 보고되었으나, 관찰된 임상증상이나 임상검사 결과가 성인 및 소아환자의 안전성 정보와 차이가 없었다. 가장 많이 보고된 이상반응은 복통, 졸음, 갈증, 두통, 구토 및 정신운동성 활동항진 등이고, 이 약의 안전성 정보와 일치하였다.',
              },
              {
                tagName: 'p',
                content:
                  '4) 이 약이 복막 투석이나 혈액투석으로 제거되는지는 알려져 있지 않다.',
              },
            ],
          },
          {
            title: '9. 적용상의 주의',
            paragraphs: [
              {
                tagName: 'p',
                content:
                  '1) 빛에 불안정하기 때문에 복용의 준비를 할 수 있을 때까지 개봉하지 않는다. 부드러운 음식, 조제우유 또는 모유와 혼합했을 경우에도 방치하지 않고 즉시(15분 이내) 복용한다(세립제에 한함).',
              },
              {
                tagName: 'p',
                content:
                  '2) 빛에 불안정하기 때문에 복용의 준비를 할 수 있을 때까지 개봉하지 않는다. 물에 현탁하였을 경우에도 방치하지 않고 즉시(15분 이내) 복용한다(시럽제에 한함.).',
              },
              {
                tagName: 'p',
                content:
                  '3) 빛에 불안정하기 때문에, 재분포 하지 않는다(세립제, 시럽제에 한함.).',
              },
            ],
          },
          {
            title: '10. 보관 및 취급상의 주의사항',
            paragraphs: [
              {
                tagName: 'p',
                content: '1) 어린이의 손이 닿지 않는 곳에 보관한다.',
              },
              {
                tagName: 'p',
                content:
                  '2) 다른 용기에 바꾸어 넣는 것은 사고원인이 되거나 품질 유지면에서 바람직하지 않으므로 이를 주의한다.',
              },
            ],
          },
          {
            title: '11. 의약품 동등성시험 정보',
            paragraphs: [
              {
                tagName: 'p',
                content: '(전문가용 정보가 있는 경우 기재함)',
              },
            ],
          },
          {
            title: '12. 기타',
            paragraphs: [
              {
                tagName: 'p',
                content: '환자를 위한 정보',
              },
              {
                tagName: 'p',
                content:
                  '1) 이 약은 천식이 악화되는 기간뿐 아니라 증상이 없는 기간 동안에도 처방에 따라 매일 복용하여야 하며, 천식이 잘 조절되지 않을 때에는 담당의사와 상의하도록 한다.',
              },
              {
                tagName: 'p',
                content:
                  '2) 이 약은 급성 천식 발작시의 치료제가 아니며, 천식 악화시를 대비하여 적절한 속효성 흡입용 β-효능제를 소지하도록 한다.',
              },
              {
                tagName: 'p',
                content:
                  '3) 이 약을 복용하는 동안 속효성 흡입용 기관지 확장제가 평소보다 더 자주 필요하게 되거나, 속효성 기관지 확장제의 1일 최대 처방 횟수 이상으로 흡입이 필요하게 되면, 의사의 진찰을 받도록 한다.',
              },
              {
                tagName: 'p',
                content:
                  '4) 의사가 지시한 경우가 아니라면, 이 약을 복용하는 동안 다른 천식 치료제의 투여량을 줄이거나 복용을 중단해서는 안된다.',
              },
              {
                tagName: 'p',
                content:
                  '5) 운동에 의해 유발되는 천식환자의 경우, 의사가 별도로 지시한 경우가 아니라면 예방 목적으로 흡입용 β-효능제 상용량을 계속하여 사용하여야 한다. 또한 모든 환자는 응급용으로 속효성 흡입용 β-효능제를 소지하도록 한다.',
              },
              {
                tagName: 'p',
                content:
                  '6) 환자가 이 약 복용 중에 신경정신계 증상이 발생하면 의사에게 알리도록 하여야 한다.',
              },
              {
                tagName: 'p',
                content:
                  '7) 아스피린에 대한 과민반응을 가지고 있는 환자의 경우, 이 약을 복용하는 동안 아스피린이나 비스테로이드성 소염제를 복용하지 않도록 한다.',
              },
            ],
          },
        ],
      },
    ],
  },
};

describe('XML 파싱 테스트', () => {
  const successCases = [
    {
      description: 'EE XML을 JSON으로 변환',
      input: EE_MOCK,
      expected: EE_result,
    },
    {
      description: 'UD XML을 JSON으로 변환',
      input: UD_MOCK,
      expected: UD_result,
    },
    {
      description: 'NB XML을 JSON으로 변환',
      input: NB_MOCK,
      expected: NB_result,
    },
  ];

  it.each(successCases)('$description', ({ input, expected }) => {
    const result = xmlToJson(input);

    expect(result).toEqual(expected);
  });
});
