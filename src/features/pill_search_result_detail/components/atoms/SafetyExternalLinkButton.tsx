import { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import {
  useSafetyExternalLinkActions,
  SafetyExternalUrlKey,
} from '../../hooks/use_safety_external_link_actions';
import { styles } from '../../styles/molecules/PillSafetySection';

interface Props {
  title: string;
  urlKey: SafetyExternalUrlKey;
  materialEngName?: string;
}

// 외부 분류 정보 버튼 표시.
const SafetyExternalLinkButton = ({
  title,
  urlKey,
  materialEngName,
}: Props) => {
  const { handlePress } = useSafetyExternalLinkActions(urlKey, materialEngName);

  return (
    <TouchableOpacity style={styles.externalLinkButton} onPress={handlePress}>
      <BaseText weight="bold" size={14} style={styles.externalLinkButtonText}>
        {title}
      </BaseText>
    </TouchableOpacity>
  );
};

export default memo(SafetyExternalLinkButton);
