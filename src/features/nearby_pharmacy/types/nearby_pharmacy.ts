import { INearbyPharmacies } from '@services/database/types';
import * as Location from 'expo-location';
import { Region } from 'react-native-maps';
import { TPharmacyClusterItem } from '@features/nearby_pharmacy/hooks/use_pharmacy_clusters';

export interface INearbyPharmacyState {
  location: Location.LocationObject | null;
  pharmacies: INearbyPharmacies[];
  loading: boolean;
  errorMsg: string | null;
}

export interface IPharmacyMarkersProps {
  clusters: TPharmacyClusterItem[];
  pharmaciesById: Map<string, INearbyPharmacies>;
  selectedPharmacyId?: string;
  onPharmacyPress: (pharmacy: INearbyPharmacies) => void;
  onClusterPress: (clusterId: number) => void;
}

export type { Region };

export interface IPharmacyInfoCardProps {
  pharmacy: INearbyPharmacies;
  onCopyPress: (text: string) => void;
  onClosePress: () => void;
}

export interface IPharmacyClusterListProps {
  pharmacies: INearbyPharmacies[];
  onPharmacyPress: (pharmacy: INearbyPharmacies) => void;
  onClosePress: () => void;
  userLocation: Location.LocationObject | null;
}
