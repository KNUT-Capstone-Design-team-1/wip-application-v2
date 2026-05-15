import { View, Text, TouchableOpacity, Linking } from 'react-native';
import InfoRow from '../atoms/InfoRow';
import { IPillDetail } from '../../types/pill_detail_type';
import { styles } from '../../styles/molecules/PillSafetySection';

interface IPillSafetySectionProps {
  data: IPillDetail;
}

const PillSafetySection = ({ data }: IPillSafetySectionProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>[ 주의 및 특수 분류 정보 ]</Text>

      <InfoRow
        label="운전/기계조작"
        value={data.isDrivingWarning ? '⚠️ 주의 (O)' : '안전 (X)'}
      />

      <View style={styles.divider} />

      <InfoRow
        label="마약류 (마약)"
        value={
          data.isNarcotic
            ? `확인됨\n- 해당 성분: ${Array.isArray(data.narcoticIngredients) ? data.narcoticIngredients.join(', ') : '-'}`
            : '해당 없음 (X)'
        }
      />
      <InfoRow
        label="마약류 (대마)"
        value={
          data.isCannabis
            ? `확인됨\n- 해당 성분: ${Array.isArray(data.cannabisIngredients) ? data.cannabisIngredients.join(', ') : '-'}`
            : '해당 없음 (X)'
        }
      />
      <InfoRow
        label="마약류 (향정)"
        value={
          data.isPsychotropic
            ? `확인됨\n- 해당 성분: ${Array.isArray(data.psychotropicIngredients) ? data.psychotropicIngredients.join(', ') : '-'}`
            : '해당 없음 (X)'
        }
      />

      <View style={styles.divider} />

      <InfoRow
        label="도핑 금지"
        value={
          data.isProhibited
            ? `확인됨 (${data.prohibitedCategory || '금지 약물'})\n- 해당 성분: ${Array.isArray(data.prohibitedIngredients) ? data.prohibitedIngredients.join(', ') : '-'}`
            : '해당 없음 (X)'
        }
      />

      {data.isProhibited && (
        <View style={styles.prohibitedContainer}>
          <Text style={styles.prohibitedTextMargin}>
            경기 기간 중: {data.inGameProhibited ? '❌' : '⭕'}
          </Text>
          <Text style={styles.prohibitedText}>
            경기 기간 외: {data.outGameProhibited ? '❌' : '⭕'}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.kadaButton}
        onPress={() => Linking.openURL('https://kada.health.kr/')}
      >
        <Text style={styles.kadaButtonText}>금지약물 확인 (KADA)</Text>
      </TouchableOpacity>

      <Text style={styles.sourceText}>
        * 출처: 식약처 마약정보DB, 한국도핑방지위원회(KADA)
      </Text>
    </View>
  );
};

export default PillSafetySection;
