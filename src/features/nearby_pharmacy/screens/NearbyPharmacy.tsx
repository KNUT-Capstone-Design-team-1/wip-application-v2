import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Clipboard from 'expo-clipboard';
import { useNearbyPharmacy } from '../hooks/use_nearby_pharmacy';
import { INearbyPharmacies } from '@services/database/types';
import Toast from '@features/shared/components/Toast';
import { useToast } from '@features/shared/hooks/use_toast';
import { styles } from '../styles/NearbyPharmacyScreen';
import { getMapHtml } from '../services/map_service';
import { COLOR_PRIMARY } from '@constants/color';

const NearbyPharmacyScreen = () => {
  const { location, pharmacies, loading, errorMsg } = useNearbyPharmacy();
  const [selectedPharmacy, setSelectedPharmacy] =
    useState<INearbyPharmacies | null>(null);
  const { showToast, hideToast, toastState } = useToast();
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    if (errorMsg) {
      showToast(errorMsg);
    }
  }, [errorMsg]);

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    showToast('복사되었습니다.');
  };

  const onMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === 'MARKER_CLICK') {
        setSelectedPharmacy(message.data);
      }
    } catch (e) {
      console.error('Failed to parse WebView message:', e);
    }
  };

  if (loading && !location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLOR_PRIMARY[100]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: getMapHtml(location, pharmacies) }}
        onMessage={onMessage}
        style={styles.map}
      />

      {selectedPharmacy && (
        <View style={styles.infoContainer}>
          <View style={styles.infoContent}>
            <Text style={styles.pharmacyName}>{selectedPharmacy.name}</Text>
            <TouchableOpacity
              onPress={() => copyToClipboard(selectedPharmacy.telephone)}
            >
              <Text style={styles.pharmacyPhone}>
                {selectedPharmacy.telephone} (누르면 복사)
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
