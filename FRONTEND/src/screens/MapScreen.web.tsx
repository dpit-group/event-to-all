import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = L.divIcon({
  html: '<div style="font-size: 30px;">📍</div>',
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

export function MapScreen() {
  return (
    <MapContainer
      center={[46.7700, 23.5895]}
      zoom={13}
      style={{ width: "100vw", height: "100vh" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[46.7700, 23.5895]} icon={markerIcon}>
        <Popup>Cluj-Napoca</Popup>
      </Marker>
    </MapContainer>
  );
}