import 'leaflet/dist/leaflet.css';
import { Map as LeafletMap } from 'leaflet';
import { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  type: 'government' | 'private';
  status: 'available' | 'busy' | 'full';
  rating: number;
  estimatedTime: number;
  specialties: string[];
  latitude: number;
  longitude: number;
}

interface MapProps {
  latitude: number | null;
  longitude: number | null;
  hospitals: Hospital[];
}

function Map({ latitude, longitude, hospitals }: MapProps) {
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (mapRef.current && latitude !== null && longitude !== null) {
      mapRef.current.setView([latitude, longitude]);
      mapRef.current.invalidateSize();
    }
  }, [latitude, longitude]);

  return (
    <div className="perspective-1000 transition-all duration-500 ease-in-out transform hover:shadow-xl max-w-4xl mx-auto">
      <MapContainer
        ref={mapRef}
        center={[latitude || 0, longitude || 0]}
        zoom={13}
        className="h-[calc(100vh-200px)] w-full rounded-lg shadow-lg transition-transform duration-500 ease ml-auto mr-0
        hover:scale-[1.02] hover:shadow-2xl"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {latitude !== null && longitude !== null && (
          <Marker
            position={[latitude, longitude]}
            interactive={false}
          />
        )}
        {hospitals.map((hospital, index) => (
          <Marker key={index} position={[hospital.latitude, hospital.longitude]}>
            <Popup>
              <div>
                <h3>{hospital.name}</h3>
                <p>Distance: {hospital.distance}</p>
                <p>ETA: {hospital.eta}</p>
                <p>Status: {hospital.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
