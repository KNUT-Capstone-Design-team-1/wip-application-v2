import { createFeatureGuide } from '@features/guide';
import { guideStorage } from '@utils/guide_storage';
import { IMAGE_TOUR } from './constants/image_tour_constant';

export const imageSearchGuide = createFeatureGuide(IMAGE_TOUR, {
  storage: guideStorage,
});
