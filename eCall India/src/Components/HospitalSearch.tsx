import React, { useEffect, useState } from "react";
import { MapPin, Phone, Navigation, Clock } from "lucide-react";

// Define Hospital Type
interface Hospital {
  name: string;
  address: string;
  type: "Government" | "Private" | "Unknown";
  distance: string;
  phone: string;
  status: "available" | "busy" | "unavailable";
  specialties: string[];
  rating: number;
  estimatedTime: string;
  latitude: number;
  longitude: number;
  state: string;
}

const HospitalSearch: React.FC = () => {
  const [searchRadius, setSearchRadius] = useState(5);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch hospitals from Nominatim
  const fetchNearbyHospitals = async (lat: number, lon: number): Promise<Hospital[]> => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=hospital&limit=30&bounded=1&countrycodes=in&viewbox=68.0,37.1,97.5,6.7&lat=${lat}&lon=${lon}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "IndiaHospitalSearchApp/1.0 (your@email.com)"
      }
    });

    const data = await res.json();

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
  };

  useEffect(() => {
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
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "busy":
        return "bg-yellow-500";
      case "unavailable":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "busy":
        return "Busy";
      case "unavailable":
        return "Unavailable";
      default:
        return "Unknown";
    }
  };

  const filteredHospitals = hospitals.filter((hospital) => {
    if (selectedFilter === "all") return true;
    return hospital.type.toLowerCase() === selectedFilter;
  });

  // Group hospitals by state
  const hospitalsByState = filteredHospitals.reduce((groups, hospital) => {
    const state = hospital.state;
    if (!groups[state]) {
      groups[state] = [];
    }
    groups[state].push(hospital);
    return groups;
  }, {} as Record<string, Hospital[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Nearby Hospitals</h1>
        {lat && lon && (
          <p className="text-gray-600 text-sm">
            📍 Your Location: {lat.toFixed(4)}, {lon.toFixed(4)}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Radius: {searchRadius} km
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter
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
      <div className="p-4 space-y-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading hospitals...</p>
        ) : Object.keys(hospitalsByState).length === 0 ? (
          <p className="text-center text-red-400">No hospitals found in this filter.</p>
        ) : (
          Object.entries(hospitalsByState).map(([state, hospitalsInState]) => (
            <div key={state} className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">{state}</h2>
              <div className="space-y-4">
                {hospitalsInState.map((hospital, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{hospital.name}</h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                hospital.type === "Government"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {hospital.type}
                            </span>
                            <div className="flex items-center space-x-1">
                              <div
                                className={`w-2 h-2 rounded-full ${getStatusColor(hospital.status)}`}
                              ></div>
                              <span className="text-xs text-gray-600">
                                {getStatusText(hospital.status)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{hospital.distance}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
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

                      <div className="mb-3 flex flex-wrap gap-2">
                        {hospital.specialties.map((specialty, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>

                      <div className="flex space-x-2">
                        <a
                          href={`tel:${hospital.phone}`}
                          className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Call Now</span>
                        </a>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Navigation className="w-4 h-4" />
                          <span>Directions</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HospitalSearch;
