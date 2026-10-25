import { createFeatureGuide } from '@features/guide';
import { guideStorage } from '@utils/guide_storage';
import { PILL_SAVE_TOUR } from './constants/pill_save_tour_constant';

export const pillSaveGuide = createFeatureGuide(PILL_SAVE_TOUR, {
  storage: guideStorage,
});
