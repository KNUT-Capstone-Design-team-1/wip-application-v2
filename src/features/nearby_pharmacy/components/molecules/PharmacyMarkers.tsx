import React, { memo } from 'react';
import { Marker } from 'react-native-maps';
import { IPharmacyMarkersProps } from '@features/nearby_pharmacy/types/nearby_pharmacy';

const PharmacyMarkers = ({
  pharmacies,
  onMarkerPress,
}: IPharmacyMarkersProps) => {
  return (
    <>
      {pharmacies.map((pharmacy) => {
        const latitude = parseFloat(pharmacy.Y);
        const longitude = parseFloat(pharmacy.X);

        if (isNaN(latitude) || isNaN(longitude)) {
          return null;
        }

        return (
          <Marker
            key={pharmacy.id}
            coordinate={{
              latitude,
              longitude,
            }}
            title={pharmacy.name}
            onPress={() => onMarkerPress(pharmacy)}
          />
        );
      })}
    </>
  );
};

export default memo(PharmacyMarkers);
