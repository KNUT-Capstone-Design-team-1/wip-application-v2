import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Bookmark } from 'lucide-react-native';
import FolderSelectModal from '@features/pill_save/components/organisms/FolderSelectModal';
import { usePillBox } from '@features/pill_save/hooks/use_pill_box';
import { getFunctionalFoodItemSeq } from '@features/pill_save/utils/saved_item_identity';
import { PILL_DETAIL_ACTION_COLOR } from '@features/pill_search_result_detail/constants/pill_detail';
import { fontPx, px } from '@utils/responsive';

const FunctionalFoodSaveButton = ({
  reportNumber,
  itemName,
}: {
  reportNumber: string;
  itemName: string;
}) => {
  const itemSeq = getFunctionalFoodItemSeq(reportNumber);
  const { savedFolderIds, isSaved, checkSavedStatus, loading } =
    usePillBox(itemSeq);
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        disabled={loading}
        hitSlop={px(8)}
        accessibilityRole="button"
        accessibilityLabel="저장 폴더 선택"
        accessibilityState={{ selected: isSaved, disabled: loading }}
      >
        <Bookmark
          size={fontPx(24)}
          fill={isSaved ? PILL_DETAIL_ACTION_COLOR : 'none'}
          stroke={PILL_DETAIL_ACTION_COLOR}
          strokeWidth={2}
        />
      </TouchableOpacity>
      <FolderSelectModal
        isVisible={visible}
        onClose={() => setVisible(false)}
        itemSeq={itemSeq}
        itemName={itemName}
        initialSelectedIds={savedFolderIds}
        onSaveComplete={() => void checkSavedStatus()}
      />
    </>
  );
};

export default FunctionalFoodSaveButton;
