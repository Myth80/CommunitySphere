import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import L from 'leaflet';

// Fix Leaflet marker icons for Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

function LocationMarker({ location, setLocation }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    }
  });

  return location ? <Marker position={location} /> : null;
}

export default function MapPicker({ location, setLocation }) {
  // Use a cleaner, slightly more modern tile layer style
  const mapStyle = {
    height: '100%', // Fills the container we defined in Register.jsx
    width: '100%',
    borderRadius: '12px', // Matches task-card and container radius
    zIndex: 1
  };

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={location ? [location.lat, location.lng] : [30.7333, 76.7794]}
        zoom={13}
        style={mapStyle}
        zoomControl={false} // Cleaner UI, user can still scroll zoom
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" // Modern "Voyager" tile style
        />
        <LocationMarker location={location} setLocation={setLocation} />
      </MapContainer>
      
      {/* Subtle overlay hint */}
      {!location && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          zIndex: 1000,
          background: 'rgba(255,255,255,0.9)',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '600',
          color: '#64748b',
          border: '1px solid #e2e8f0',
          pointerEvents: 'none'
        }}>
          Tap to drop pin
        </div>
      )}
    </div>
  );
}
