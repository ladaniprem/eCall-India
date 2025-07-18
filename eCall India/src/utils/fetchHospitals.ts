export const fetchNearbyHospitals = async (lat: number, lon: number) => {
  const apiKey = process.env.TOMTOM_API_KEY as string;
  const url = `https://api.tomtom.com/search/2/poiSearch/hospital.json?lat=${lat}&lon=${lon}&radius=10000&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch hospital data");

    const data = await response.json();
    type Hospital = {
      poi: {
        name: string;
        phone?: string;
      };
      address: {
        freeformAddress: string;
      };
      position: {
        lat: number;
        lon: number;
      };
    };
    return data.results.map((hospital: Hospital) => ({
      name: hospital.poi.name,
      phone: hospital.poi.phone,
      address: hospital.address.freeformAddress,
      lat: hospital.position.lat,
      lon: hospital.position.lon
    }));
  } catch (err) {
    console.error("TomTom API Error:", err);
    return [];
  }
};
