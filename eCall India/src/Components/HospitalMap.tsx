import { useEffect, useRef } from "react";
import '@tomtom-international/web-sdk-maps/dist/maps.css';

interface Hospital {
  position: { lat: number; lon: number };
  poi: { name: string; phone?: string };
}

interface Props {
  userLocation: { lat: number; lon: number };
  hospitals: Hospital[];
}

declare global {
  interface Window {
    tt: typeof import('@tomtom-international/web-sdk-maps');
  }
}

export default function HospitalMap({ userLocation, hospitals }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const tt = window.tt;
    const map = tt.map({
      key: import.meta.env.VITE_TOMTOM_API_KEY,
      container: mapRef.current!,
      center: [userLocation.lon, userLocation.lat],
      zoom: 13,
    });

    const addMarker = (lat: number, lon: number, name: string, phone?: string) => {
      let popupContent = `<strong>${name}</strong>`;
      if (phone) {
        popupContent += `<br/><a href="tel:${phone}">Call Now: ${phone}</a>`;
      }
      const popup = new tt.Popup({ offset: 35 }).setHTML(popupContent);
      new tt.Marker().setLngLat([lon, lat]).setPopup(popup).addTo(map);
    };

    addMarker(userLocation.lat, userLocation.lon, "You are here");

    hospitals.forEach((hospital) =>
      addMarker(hospital.position.lat, hospital.position.lon, hospital.poi.name, hospital.poi.phone)
    );

    return () => map.remove();
  }, [userLocation, hospitals]);

  return <div ref={mapRef} className="w-full h-[500px] rounded-lg shadow" />;
}
