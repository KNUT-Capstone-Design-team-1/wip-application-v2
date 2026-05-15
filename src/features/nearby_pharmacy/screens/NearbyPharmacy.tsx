import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Clipboard from 'expo-clipboard';
import { useNearbyPharmacy } from '../hooks/use_nearby_pharmacy';
import { INearbyPharmacies } from '@services/database/types';
import Toast from '@features/shared/components/Toast';
import { useToast } from '@features/shared/hooks/use_toast';
import { styles } from '../styles/NearbyPharmacyScreen';
import { COLOR_PRIMARY } from '@constants/color';

const NearbyPharmacyScreen = () => {
  const { location, pharmacies, loading, errorMsg } = useNearbyPharmacy();
  const [selectedPharmacy, setSelectedPharmacy] =
    useState<INearbyPharmacies | null>(null);
  const { showToast, hideToast, toastState } = useToast();

  useEffect(() => {
    if (errorMsg) {
      showToast(errorMsg);
    }
  }, [errorMsg]);

  const copyToClipboard = async (text: string) => {
    if (!text) {
      return;
    }
    await Clipboard.setStringAsync(text);
    showToast('복사되었습니다.');
  };

  if (loading && !location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLOR_PRIMARY[100]} />
      </View>
    );
  }

  const initialRegion = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : {
        latitude: 37.5665,
        longitude: 126.978,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
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
              onPress={() => setSelectedPharmacy(pharmacy)}
            />
          );
        })}
      </MapView>

      {selectedPharmacy && (
        <View style={styles.infoContainer}>
          <View style={styles.infoContent}>
            <Text style={styles.pharmacyName}>{selectedPharmacy.name}</Text>
            <TouchableOpacity
              onPress={() => copyToClipboard(selectedPharmacy.telephone)}
            >
              <Text style={styles.pharmacyPhone}>
                {selectedPharmacy.telephone || '전화번호 없음'} (누르면 복사)
              </Text>
            </TouchableOpacity>
            <Text style={styles.pharmacyAddress}>
              {selectedPharmacy.address}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedPharmacy(null)}
          >
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      )}

      <Toast
        message={toastState.message}
        visible={toastState.visible}
        onHide={hideToast}
      />
    </View>
  );
};

export default NearbyPharmacyScreen;
