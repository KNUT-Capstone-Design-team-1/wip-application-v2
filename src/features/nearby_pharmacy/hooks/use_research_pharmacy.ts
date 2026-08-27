import { useMemo, useCallback } from 'react';
import { Region } from 'react-native-maps';
import {
  KM_PER_LAT_DEGREE,
  KM_PER_LON_DEGREE,
  RESEARCH_DISPLACEMENT_RATIO,
  RESEARCH_MAX_DISPLACEMENT_KM,
} from '@features/nearby_pharmacy/constants/nearby_pharmacy';

export const useResearchPharmacy = (
  region: Region | null,
  lastFetchedCenter: { lat: number; lng: number } | null,
  fetchPharmacies: (coords: { x: number; y: number }) => void,
) => {
  const shouldResearch = useMemo(() => {
    if (!lastFetchedCenter || !region) {
      return false;
    }

    const displacementKm = Math.max(
      Math.abs(region.latitude - lastFetchedCenter.lat) * KM_PER_LAT_DEGREE,
      Math.abs(region.longitude - lastFetchedCenter.lng) * KM_PER_LON_DEGREE,
    );

    const visibleHeightKm = region.latitudeDelta * KM_PER_LAT_DEGREE;

    const thresholdKm = Math.min(
      visibleHeightKm * RESEARCH_DISPLACEMENT_RATIO,
      RESEARCH_MAX_DISPLACEMENT_KM,
    );

    return displacementKm > thresholdKm;
  }, [region, lastFetchedCenter]);

  const handleResearchHere = useCallback(() => {
    if (region) {
      fetchPharmacies({ x: region.longitude, y: region.latitude });
    }
  }, [fetchPharmacies, region]);

  return { shouldResearch, handleResearchHere };
};
