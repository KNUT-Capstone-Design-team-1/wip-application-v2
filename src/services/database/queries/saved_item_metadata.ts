import { FUNCTIONAL_FOOD_ITEM_PREFIX } from '@features/pill_save/utils/saved_item_identity';

// 식별자와 별칭은 내부 호출부에서만 지정한다. 사용자 입력은 바인딩한다.
export const buildSavedItemMetadata = (
  source: 's' | 'pri',
  pill: 'p' | 'pd',
) => ({
  itemName: `COALESCE(${pill}.ITEM_NAME, food.PRDLST_NM, ${source}.item_name)`,
  image: `COALESCE(${pill}.ITEM_IMAGE, '')`,
  className: `COALESCE(${pill}.CLASS_NAME, CASE WHEN food.PRDLST_REPORT_NO IS NOT NULL THEN '영양제' END, '')`,
  manufacturer: `COALESCE(${pill}.ENTP_NAME, food.BSSH_NM, '')`,
  joins: `LEFT JOIN pill_data ${pill} ON ${source}.item_seq = ${pill}.ITEM_SEQ
    LEFT JOIN health_functional_food_raw_material food
      ON food.PRDLST_REPORT_NO = CASE
        WHEN substr(${source}.item_seq, 1, ${FUNCTIONAL_FOOD_ITEM_PREFIX.length}) = '${FUNCTIONAL_FOOD_ITEM_PREFIX}'
        THEN substr(${source}.item_seq, ${FUNCTIONAL_FOOD_ITEM_PREFIX.length + 1}) END`,
});
