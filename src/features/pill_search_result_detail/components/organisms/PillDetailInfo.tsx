import { memo } from 'react';
import { View } from 'react-native';
import { styles } from '../../styles/organisms/PillDetailInfo';
import PillBasicHeader from '../molecules/PillBasicHeader';
import PillSpecsSection from '../molecules/PillSpecsSection';
import PillDetailSafety from './PillDetailSafety';
import PillDetailDocuments from './PillDetailDocuments';

// 헤더·제원·상세 문서 레이아웃 구성.
const PillDetailInfo = () => (
  <View style={styles.infoContainer}>
    <PillBasicHeader />
    <PillSpecsSection />
    <PillDetailSafety />
    <PillDetailDocuments />
  </View>
);

export default memo(PillDetailInfo);
