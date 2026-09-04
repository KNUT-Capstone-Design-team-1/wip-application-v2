import Supercluster from 'supercluster';
import { Region } from 'react-native-maps';
import { INearbyPharmacies } from '@services/database/types';
import {
  CLUSTER_MAX_ZOOM,
  CLUSTER_MIN_POINTS,
  CLUSTER_RADIUS_PX,
} from '@features/nearby_pharmacy/constants/nearby_pharmacy';
import {
  IPharmacyPointProps,
  TPharmacyClusterItem,
  TPharmacyPointFeature,
} from '@features/nearby_pharmacy/types/pharmacy_map_type';

export class PharmacyClusterService {
  createIndex(
    pharmacies: INearbyPharmacies[],
  ): Supercluster<IPharmacyPointProps> | null {
    const hasNoPharmacies = pharmacies.length === 0;

    if (hasNoPharmacies) {
      return null;
    }

    const index = new Supercluster<IPharmacyPointProps>({
      radius: CLUSTER_RADIUS_PX,
      maxZoom: CLUSTER_MAX_ZOOM,
      minPoints: CLUSTER_MIN_POINTS,
    });
    const points: TPharmacyPointFeature[] = [];

    for (const pharmacy of pharmacies) {
      const longitude = Number.parseFloat(pharmacy.X);
      const latitude = Number.parseFloat(pharmacy.Y);
      const isInvalidCoordinate =
        !Number.isFinite(longitude) ||
        !Number.isFinite(latitude) ||
        longitude < -180 ||
        longitude > 180 ||
        latitude < -90 ||
        latitude > 90;

      if (isInvalidCoordinate) {
        continue;
      }

      points.push({
        type: 'Feature',
        properties: { pharmacyId: pharmacy.id },
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      });
    }

    const hasNoValidPoints = points.length === 0;

    if (hasNoValidPoints) {
      return null;
    }

    index.load(points);
    return index;
  }

  getClusters(
    index: Supercluster<IPharmacyPointProps> | null,
    region: Region | null,
  ): TPharmacyClusterItem[] {
    if (!index || !region) {
      return [];
    }

    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
    const hasInvalidRegion =
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      !Number.isFinite(latitudeDelta) ||
      !Number.isFinite(longitudeDelta) ||
      latitudeDelta <= 0 ||
      longitudeDelta <= 0;

    if (hasInvalidRegion) {
      return [];
    }

    const bbox: [number, number, number, number] = [
      longitude - longitudeDelta / 2,
      latitude - latitudeDelta / 2,
      longitude + longitudeDelta / 2,
      latitude + latitudeDelta / 2,
    ];
    const zoom = Math.round(Math.log2(360 / latitudeDelta));
    const clampedZoom = Math.min(Math.max(zoom, 0), CLUSTER_MAX_ZOOM);

    return index.getClusters(bbox, clampedZoom);
  }

  getClusterPharmacyIds(
    index: Supercluster<IPharmacyPointProps> | null,
    clusterId: number,
  ): string[] {
    const hasNoIndex = !index;

    if (hasNoIndex) {
      return [];
    }

    return index
      .getLeaves(clusterId, Infinity)
      .map((leaf) => leaf.properties.pharmacyId);
  }
}

export const pharmacyClusterService = new PharmacyClusterService();
