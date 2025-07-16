// src/api/hospitalAPI.ts

export interface Hospital {
  name: string;
  latitude: number;
  longitude: number;
  address: string;
}

export async function fetchNearbyHospitals(lat: number, lon: number): Promise<Hospital[]> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=hospital&limit=10&lat=${lat}&lon=${lon}&countrycodes=in`
  );

  const data = await res.json();

  return data.map((item: { display_name: string; lat: string; lon: string }) => ({
    name: item.display_name.split(',')[0],
    address: item.display_name,
    latitude: parseFloat(item.lat),
    longitude: parseFloat(item.lon),
  }));
}
