import React, { useState } from 'react';
import { View, Text } from 'react-native';
import ImageSearchSlideContainer from '../components/ImageSearchSlideContainer';
import ImageSearchContent from '../components/ImageSearchContent';
import ImageSearchButtons from '../components/ImageSearchButtons';


const PillImageSearch = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const slideDatas = [
    {
      contentTitle: '제목1',
      contentInfo: '내용1',
    },
    {
      contentTitle: '제목2',
      contentInfo: '내용2',
    },
    {
      contentTitle: '제목3',
      contentInfo: '내용3',
    },
  ];
  return (
    // onChange 이벤트가 발생하면 setSlideIndex 값 갱신하도록 하기
    <ImageSearchSlideContainer>
      {/*{*/}
      {/*  slideDatas.map((data, index) => {*/}
      {/*    return (*/}
      {/*      <ImageSearchContent key={index} contentTitle={data.contentTitle} contentInfo={data.contentInfo} />*/}
      {/*    );*/}
      {/*  };*/}
      {/*};*/}
      <Text>이미지 검색</Text>

      <ImageSearchButtons visible={slideIndex === slideDatas.length} />
    </ImageSearchSlideContainer>
  );
};

export default PillImageSearch;
