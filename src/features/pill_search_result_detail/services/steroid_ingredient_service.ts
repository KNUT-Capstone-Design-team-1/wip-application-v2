import {
  chemicalNameKey,
  ingredientNameVariants,
  splitChemicalList,
} from '@services/database/matching/substance_names';
import { STEROID_INGREDIENTS } from '../constants/steroid_ingredients';
import type { IPillDetail } from '../types/pill_detail_type';

// 성분명 전체를 비교한다. 메틸프레드니솔론을 프레드니솔론으로 중복 판정하지 않는다.
// 염/수화물은 공통 정규화로, 스테로이드 에스테르는 아래의 명시된 접미사로 처리한다.
const derivativeSuffix =
  /(?:acetate|acetonide|aceponate|butyrate|buteprate|caproate|dipropionate|propionate|valerate|furoate|etabonate|pivalate|phosphate|sodium|succinate|hemisuccinate|disodium|포스페이트|이나트륨|인산이나트륨|아세테이트|아세토니드|아세포네이트|부티레이트|부테프레이트|카프로에이트|디프로피오네이트|프로피오네이트|발레레이트|푸로에이트|에타보네이트|피발레이트|인산|인산염|나트륨|숙시네이트|헤미숙시네이트|숙시네이트나트륨)/g;

const catalog = STEROID_INGREDIENTS.map((entry) => ({
  name: entry.name,
  keys: entry.aliases.map(chemicalNameKey),
}));

const matchesSteroid = (key: string, alias: string) => {
  if (!key.startsWith(alias)) return false;
  const suffix = key.slice(alias.length);
  return !suffix || !suffix.replace(derivativeSuffix, '');
};

export const checkSteroidIngredients = (
  data: Pick<
    IPillDetail,
    'MAIN_ITEM_INGR' | 'MATERIAL_ENG_NAME' | 'MATERIAL_NAME'
  >,
) => {
  // 원료성분에는 첨가제가 섞일 수 있으므로 주성분 정보가 없을 때만 사용한다.
  const korean =
    data.MAIN_ITEM_INGR?.trim() || data.MATERIAL_NAME?.trim() || '';
  const english = data.MATERIAL_ENG_NAME?.trim() || '';
  const keys = splitChemicalList(korean + '|' + english)
    .flatMap(ingredientNameVariants)
    .map(chemicalNameKey);
  const steroidIngredients = catalog
    .filter((entry) =>
      entry.keys.some((alias) =>
        keys.some((key) => matchesSteroid(key, alias)),
      ),
    )
    .map((entry) => entry.name);

  return {
    isSteroid: keys.length ? steroidIngredients.length > 0 : undefined,
    steroidIngredients,
  };
};
