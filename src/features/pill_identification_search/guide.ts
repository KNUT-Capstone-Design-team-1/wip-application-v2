import { createFeatureGuide } from '@features/guide';
import { guideStorage } from '@utils/guide_storage';
import { IDENTIFICATION_TOUR } from './constants/identification_tour_constant';

export const identificationGuide = createFeatureGuide(IDENTIFICATION_TOUR, {
  storage: guideStorage,
});
