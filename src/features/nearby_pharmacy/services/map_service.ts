import { LocationObject } from 'expo-location';
import { INearbyPharmacies } from '@services/database/types';

export const getMapHtml = (
  location: LocationObject | null,
  pharmacies: INearbyPharmacies[],
) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { height: 100vh; width: 100vw; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([${location?.coords.latitude || 37.5665}, ${location?.coords.longitude || 126.978}], 15);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);

          // 현재 위치 표시
          if (${!!location}) {
            L.circle([${location?.coords.latitude}, ${location?.coords.longitude}], {
              color: 'blue',
              fillColor: '#30f',
              fillOpacity: 0.2,
              radius: 50
            }).addTo(map).bindPopup("현재 위치");
          }

          // 약국 마커 추가
          var pharmacies = ${JSON.stringify(pharmacies)};
          pharmacies.forEach(function(pharmacy) {
            var marker = L.marker([parseFloat(pharmacy.y), parseFloat(pharmacy.x)]).addTo(map);
            marker.on('click', function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MARKER_CLICK', data: pharmacy }));
            });
          });
        </script>
      </body>
    </html>
  `;
};
