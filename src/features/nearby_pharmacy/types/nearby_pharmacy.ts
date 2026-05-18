import { INearbyPharmacies } from '@services/database/types';
import * as Location from 'expo-location';

export interface INearbyPharmacyState {
  location: Location.LocationObject | null;
  pharmacies: INearbyPharmacies[];
  loading: boolean;
  errorMsg: string | null;
}

export interface IPharmacyMarkersProps {
  pharmacies: INearbyPharmacies[];
  onMarkerPress: (pharmacy: INearbyPharmacies) => void;
}

export interface IPharmacyInfoCardProps {
  pharmacy: INearbyPharmacies;
  onCopyPress: (text: string) => void;
  onClosePress: () => void;
}
