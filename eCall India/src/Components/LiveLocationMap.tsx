import { motion } from 'framer-motion';
import { AlertTriangle, Navigation, Phone, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { calculateDistance, formatDistance } from '../lib/utils';
import { useEffect, useState, useCallback } from 'react';
import type { Hospital } from '../api/hospitalAPI';
import { getHospitals } from '../api/hospitalAPI';
import Map from './Map';

interface LiveLocationMapProps {
  userLocation?: { lat: number; lng: number };
  searchRadius: number;
  onRadiusChange: (radius: number) => void;
  onHospitalCall: (hospital: Hospital) => void;
}

export const LiveLocationMap: React.FC<LiveLocationMapProps> = ({
  userLocation: propLocation,
  searchRadius,
  onRadiusChange,
  onHospitalCall,
}) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>(propLocation || { lat: 0, lng: 0 });

  // Update location from props if changed
  useEffect(() => {
    if (propLocation) {
      setUserLocation(propLocation);
    }
  }, [propLocation]);

  // Watch geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    let isMounted = true;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (isMounted) {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        }
      },
      (err) => {
        if (isMounted) setError(err.message);
      },
      { enableHighAccuracy: true }
    );

    return () => {
      isMounted = false;
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Fetch hospitals
  const fetchHospitals = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const results = await getHospitals(userLocation.lat, userLocation.lng, searchRadius * 1000);
      if (Array.isArray(results)) {
        setHospitals(results);
      } else {
        throw new Error('Invalid hospital data format.');
      }
    } catch {
      setError('Failed to fetch hospitals. Please try again later.');
      setHospitals([]);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation.lat, userLocation.lng, searchRadius]);

  useEffect(() => {
    if (userLocation.lat !== 0 && userLocation.lng !== 0) {
      fetchHospitals();
    }
  }, [fetchHospitals, userLocation]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'full': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'full': return 'Full';
      default: return 'Unknown';
    }
  };

  const hasValidLocation = userLocation.lat !== 0 && userLocation.lng !== 0;

  if (error) {
    return (
      <Card className="glass-morph border-white/20 dark:border-gray-700/50">
        <CardContent className="text-center py-8">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-3" />
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <motion.button
            onClick={fetchHospitals}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </motion.button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Interactive Map */}
      <Card className="glass-morph border-white/20 dark:border-gray-700/50 overflow-hidden">
        <Map
          latitude={hasValidLocation ? userLocation.lat : null}
          longitude={hasValidLocation ? userLocation.lng : null}
          hospitals={hospitals.map(h => ({
            ...h,
            latitude: h.lat,
            longitude: h.lng,
          }))}
        />
      </Card>

      {/* Radius Slider */}
      <Card className="glass-morph border-white/20 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-blue-600" />
            <span>Search Radius: {searchRadius} km</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <input
              type="range"
              min={1}
              max={20}
              value={searchRadius}
              onChange={e => onRadiusChange(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>1 km</span>
              <span>10 km</span>
              <span>20 km</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hospital List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Nearby Hospitals ({hospitals.length})
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : hospitals.length === 0 ? (
          <Card className="glass-morph border-white/20 dark:border-gray-700/50">
            <CardContent className="text-center py-8">
              <AlertTriangle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No hospitals found within {searchRadius} km radius
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Try increasing the search radius
              </p>
            </CardContent>
          </Card>
        ) : (
          hospitals.map((hospital, index) => (
            <motion.div
              key={hospital.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-morph border-white/20 dark:border-gray-700/50 hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-300 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(hospital.status)} animate-pulse`}></div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {hospital.name}
                        </h4>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${hospital.type === 'government'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                          }`}>
                          {hospital.type === 'government' ? 'Government' : 'Private'}
                        </span>
                        <span>{formatDistance(calculateDistance(userLocation.lat, userLocation.lng, hospital.lat, hospital.lng))}</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{hospital.estimatedTime} min</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex text-sm font-medium text-gray-900 dark:text-white">
                          {Array.from({ length: 5 }).map((_, i: number) => (
                            <span
                              key={i}
                              className={`text-xs ${i < Math.floor(Number(hospital.rating)) ? 'text-yellow-500' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          ({getStatusText(hospital.status)})
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {hospital.specialties.slice(0, 3).map((specialty, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-xs"
                          >
                            {specialty}
                          </span>
                        ))}
                        {hospital.specialties.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-md text-xs">
                            +{hospital.specialties.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => onHospitalCall(hospital)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Now</span>
                    </motion.button>

                    <Sheet>
                      <SheetTrigger asChild>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Navigation className="w-4 h-4" />
                          <span>Directions</span>
                        </motion.button>
                      </SheetTrigger>
                      <SheetContent>
                        <div className="glass-morph">
                          <SheetHeader>
                            <SheetTitle>{hospital.name}</SheetTitle>
                          </SheetHeader>
                          <div className="py-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                  {formatDistance(calculateDistance(userLocation.lat, userLocation.lng, hospital.lat, hospital.lng))}
                                </div>
                                <div className="text-sm text-gray-500">Distance</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                  {hospital.estimatedTime} min
                                </div>
                                <div className="text-sm text-gray-500">ETA</div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-medium">Specialties</h4>
                              <div className="flex flex-wrap gap-2">
                                {hospital.specialties.map((specialty, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-md text-sm"
                                  >
                                    {specialty}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <motion.button
                              onClick={() => onHospitalCall(hospital)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                            >
                              <Phone className="w-5 h-5" />
                              <span>Call {hospital.name}</span>
                            </motion.button>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveLocationMap;
