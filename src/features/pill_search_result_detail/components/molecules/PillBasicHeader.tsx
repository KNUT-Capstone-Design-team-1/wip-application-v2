import { memo } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../../styles/molecules/PillBasicHeader';
import { Bookmark } from 'lucide-react-native';
import { fontPx } from '@utils/responsive';
import { LinearGradient } from 'expo-linear-gradient';
import StockInquiryIconButton from '@features/nearby_pharmacy/components/atoms/StockInquiryIconButton';

interface IPillBasicHeaderProps {
  itemName: string;
  saveState: boolean;
  onSaveToggle: () => void;
  onStockInquiry?: () => void;
}

const PillBasicHeader = ({
  itemName,
  saveState,
  onSaveToggle,
  onStockInquiry,
}: IPillBasicHeaderProps) => {
  const itemNames = itemName.split(/(?=\()/, 2);

  return (
    <View style={styles.headerWrapper}>
      <ScrollView
        style={styles.nameScrollWrapper}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.nameViewWrapper}>
          <BaseText
            selectable={true}
            weight="bold"
            size={22}
            style={styles.name}
          >
            {itemNames[0].trim()}
          </BaseText>
          {itemNames[1] && (
            <BaseText
              selectable={true}
              weight="bold"
              size={18}
              style={styles.name}
            >
              {itemNames[1]}
            </BaseText>
          )}
        </View>
      </ScrollView>
      <LinearGradient
        colors={['rgb(255,255,255,0)', 'white']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradiant}
        pointerEvents="none"
      />
      <View style={styles.actionButtons}>
        {onStockInquiry && (
          <StockInquiryIconButton onPress={onStockInquiry} size={20} />
        )}
        <TouchableOpacity style={styles.saveButton} onPress={onSaveToggle}>
          <Bookmark
            size={fontPx(24)}
            fill={saveState ? '#32D2FF' : 'none'}
            stroke={'#32D2FF'}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(PillBasicHeader);
