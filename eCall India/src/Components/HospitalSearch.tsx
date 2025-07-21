import { useEffect, useState, useCallback } from "react";

// Define the Hospital type
type Hospital = {
  name: string;
  address: string;
  type: string;
  distance: string;
  phone: string;
  status: string;
  specialties: string[];
  rating: number;
  estimatedTime: string;
  latitude: number;
  longitude: number;
  state: string;
};


const HospitalSearch: React.FC = () => {
  const [searchRadius, setSearchRadius] = useState(5);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNearbyHospitals = useCallback(async (lat: number, lon: number): Promise<Hospital[]> => {
    const url = `https://api.tomtom.com/search/2/poiSearch/hospital.json?lat=${lat}&lon=${lon}&radius=10000&key=akmVQEaUoSTa3CMrcfUDhdc7hoJlBVNP`;

    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "IndiaHospitalSearchApp/1.0 (your@email.com)"
        }
      });

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid API response format');
      }

      return data.map((item: { display_name: string; lat: string; lon: string }) => {
        const addressParts = item.display_name.split(",");
        const state = addressParts[addressParts.length - 3]?.trim() || "Unknown";

        return {
          name: addressParts[0],
          address: item.display_name,
          type: Math.random() > 0.5 ? "Private" : "Government",
          distance: `${(Math.random() * 5 + 1).toFixed(1)} km`,
          phone: "+91 12345 67890",
          status: Math.random() > 0.7 ? "busy" : "available",
          specialties: ["Emergency", "Cardiology", "Trauma"].sort(() => 0.5 - Math.random()).slice(0, 2),
          rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
          estimatedTime: `${Math.floor(Math.random() * 20 + 5)} mins`,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          state,
        };
      });
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      return [];
    }
  }, []);

  useEffect(() => {
    const getLocationAndFetchHospitals = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            setLat(latitude);
            setLon(longitude);
            const result = await fetchNearbyHospitals(latitude, longitude);
            setHospitals(result);
            setLoading(false);
          },
          (error) => {
            console.error("Geolocation error:", error.message);
            setLoading(false);
          }
        );
      } else {
        alert("Geolocation not supported");
        setLoading(false);
      }
    };

    getLocationAndFetchHospitals();
  }, [fetchNearbyHospitals]);



  const filteredHospitals = hospitals.filter((hospital) => {
    if (selectedFilter === "all") return true;
    return hospital.type.toLowerCase() === selectedFilter;
  });



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Nearby Hospitals</h1>
        {lat && lon && (
          <p className="text-gray-600 text-sm">
            📍 Your Location: {lat?.toFixed(4)}, {lon?.toFixed(4)}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-white bg-gradient-to-r from-yellow-400 via-yellow-300 to-white rounded px-2 py-1 shadow">
              Search Radius: <span className="text-yellow-600 font-bold">{searchRadius} km</span>
            </label>
          <input
            type="range"
            min="1"
            max="20"
            value={searchRadius}
            onChange={(e) => setSearchRadius(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 km</span>
            <span>20 km</span>
          </div>
        </div>

        <div className="flex space-x-2">
          {["all", "government", "private"].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === filter
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>



      {/* Hospital List */}
      <div className="p-4 space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading hospitals...</p>
        ) : filteredHospitals.length === 0 ? (
          <p className="text-center text-red-400">No hospitals found in this filter.</p>
        ) : (
          filteredHospitals.map((hospital, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{hospital.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${hospital.type === 'Government'
                        ? 'bg-blue-100 text-blue-800'
                        : hospital.type === 'Private'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-700'
                        }`}>
                        {hospital.type}
                      </span>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${hospital.status === 'available' ? 'bg-green-500' :
                          hospital.status === 'busy' ? 'bg-yellow-500' :
                            hospital.status === 'unavailable' ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                        <span className="text-xs text-gray-600">{
                          hospital.status === 'available' ? 'Available' :
                            hospital.status === 'busy' ? 'Busy' :
                              hospital.status === 'unavailable' ? 'Unavailable' : 'Unknown'
                        }</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        {/* MapPin icon can be added if you import it */}
                        <span>{hospital.distance}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {/* Clock icon can be added if you import it */}
                        <span>{hospital.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="text-sm font-medium text-gray-900">{hospital.rating}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {hospital.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
                    {/* Phone icon can be added if you import it */}
                    <span>Call Now</span>
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                    {/* Navigation icon can be added if you import it */}
                    <span>Directions</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HospitalSearch;
