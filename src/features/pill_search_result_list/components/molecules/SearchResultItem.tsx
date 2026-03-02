import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/molecules/SearchResultItem';
import { IResultItemProps } from '@/src/features/pill_search_result_list/types/pill_search_result_list';

const SearchResultItem = ({
  resultItem,
  itemClickHandler,
}: IResultItemProps) => {
  return (
    <TouchableOpacity
      style={styles.searchItemWrapper}
      onPress={() => itemClickHandler(resultItem.ITEM_SEQ, resultItem.ITEM_IMAGE)}
    >
      <View style={styles.searchItemImage}>
        <Image
          source={{ uri: resultItem.ITEM_IMAGE }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.searchItemContents}>
        <Text style={styles.searchItemTitle}>{resultItem.ITEM_NAME}</Text>
        <Text style={styles.searchItemEntpName}>{resultItem.ENTP_NAME}</Text>
        <Text style={styles.searchItemEtcOtcCode}>{resultItem.ETC_OTC_CODE}</Text>
        <Text style={styles.searchItemPrintFront}>{resultItem.PRINT_FRONT}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SearchResultItem;
