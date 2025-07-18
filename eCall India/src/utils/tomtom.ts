const API_KEY = import.meta.env.VITE_TOMTOM_API_KEY;

export const searchNearbyHospitals = async (lat: number, lon: number) => {
  const url = `https://api.tomtom.com/search/2/poiSearch/hospital.json?key=${API_KEY}&lat=${lat}&lon=${lon}&radius=10000&limit=10`;

  const response = await fetch(url);
  const data = await response.json();
  return data.results;
};

export const reverseGeocode = async (lat: number, lon: number) => {
  const url = `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lon}.json?key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.addresses[0]?.address?.freeformAddress || "Unknown Location";
};
