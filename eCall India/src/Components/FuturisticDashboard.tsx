import React, { useState, useEffect } from 'react';
import {   Phone, Zap, Activity, Navigation, Car, Users } from 'lucide-react';
import AnimatedSOS from './AnimatedSOS';
import CrashDetectionSystem from './CrashDetectionSystem';
import { DarkModeToggle } from './DarkModeProvider';
import Map from './Map'

interface EmergencyContact {
  name: string;
  relation: string;
  phone?: string;
}

interface UserData {
  name?: string;
  vehicleModel?: string;
  vehicleNumber?: string;
  emergencyContacts?: EmergencyContact[];
}

interface DashboardProps {
  onEmergency: (severity?: 'minor' | 'moderate' | 'severe') => void;
  userData?: UserData;
}

interface Hospital {
  name: string;
  distance: string;
  status: string;
  type: string;
  eta: string;
  specialties: string[];
  latitude: number;
  longitude: number;
}

const Dashboard: React.FC<DashboardProps> = ({ onEmergency, userData }) => {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [lastSync, setLastSync] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [crashSeverity, setCrashSeverity] = useState<'minor' | 'moderate' | 'severe' | null>(null);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [tripData, setTripData] = useState({
    distance: 12.5,
    duration: 45,
    avgSpeed: 35,
    impactPoints: 0
  });

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);

  // Haversine formula to calculate distance between two coordinates in km
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchNearbyHospitals = async (lat: number, lon: number): Promise<Hospital[]> => {
    const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY;
    const SEARCH_API_URL = 'https://api.tomtom.com/search/2/poiSearch/hospital.json';

    const res = await fetch(
      `${SEARCH_API_URL}?lat=${lat}&lon=${lon}&radius=20000&limit=20&key=${TOMTOM_API_KEY}`
    );
    const data = await res.json();
    return data.map((item: { display_name: string; lat: string; lon: string }) => ({
      name: item.display_name.split(',')[0],
      distance: `${(Math.random() * 5 + 1).toFixed(1)} km`,
      status: Math.random() > 0.7 ? 'busy' : 'available',
      type: Math.random() > 0.5 ? 'Government' : 'Private',
      eta: `${Math.floor(Math.random() * 20 + 5)} mins`,
      specialties: ['Emergency', 'Cardiology', 'Trauma']
        .sort(() => 0.5 - Math.random())
        .slice(0, 2),
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpeed((prev) => Math.max(0, prev + (Math.random() - 0.5) * 10));
      setBatteryLevel((prev) => Math.max(20, prev - Math.random() * 0.1));
      setLastSync(new Date());
      setTripData((prev) => ({
        ...prev,
        distance: prev.distance + Math.random() * 0.1,
        duration: prev.duration + 1 / 60,
        avgSpeed: (prev.avgSpeed + currentSpeed) / 2,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [currentSpeed]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error('Location error', error);
        alert('⚠️ Location access error. Please enable GPS.');
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      fetchNearbyHospitals(latitude, longitude).then((hospitals) => {
        const range = 10; // km
        const nearby = hospitals.filter((h) => {
          const dist = calculateDistance(latitude, longitude, h.latitude, h.longitude);
          return dist <= range;
        });
        setFilteredHospitals(nearby);
      });
    }
  }, [latitude, longitude]);

  const handleCrashDetected = (severity: 'minor' | 'moderate' | 'severe') => {
    setCrashSeverity(severity);
    setIsEmergencyMode(true);
    setTripData((prev) => ({ ...prev, impactPoints: prev.impactPoints + 1 }));
    onEmergency(severity);
  };

  const handleVoiceTrigger = () => {
    onEmergency();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'unavailable':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="glass-morph shadow-lg px-6 py-8 slide-up-fade border-b border-white/20 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              JeevSanket Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              Welcome back, {userData?.name || 'User'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">Protected</span>
            </div>
          </div>
        </div>
        {userData?.vehicleModel && (
          <div className="glass-morph rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Car className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {userData.vehicleModel}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {userData.vehicleNumber}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 dark:text-green-400 font-medium">System Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">{batteryLevel.toFixed(0)}%</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Last sync: {lastSync.toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <CrashDetectionSystem
          onCrashDetected={handleCrashDetected}
          onVoiceTrigger={handleVoiceTrigger}
        />

        <div className="flex justify-center py-8">
          <AnimatedSOS
            onEmergency={() => onEmergency()}
            isEmergencyMode={isEmergencyMode}
            crashSeverity={crashSeverity}
          />
        </div>

        <div className="glass-morph rounded-2xl p-6 slide-up-fade border border-white/20 dark:border-gray-700/50">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Current Trip
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {tripData.distance.toFixed(1)} km
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Distance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.floor(tripData.duration)} min
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {tripData.avgSpeed.toFixed(0)} km/h
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Speed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {tripData.impactPoints}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Impact Points</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-morph rounded-2xl p-6 slide-up-fade border border-white/20 dark:border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {currentSpeed.toFixed(0)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">km/h</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Speed</span>
              <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((currentSpeed / 120) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="glass-morph rounded-2xl p-6 slide-up-fade border border-white/20 dark:border-gray-700/50 hover:border-green-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {batteryLevel.toFixed(0)}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Battery</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Power Level</span>
              <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    batteryLevel > 50
                      ? 'bg-green-500'
                      : batteryLevel > 20
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${batteryLevel}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-morph rounded-2xl shadow-lg overflow-hidden slide-up-fade border border-white/20 dark:border-gray-700/50">
          <div className="relative h-[500px]">
            <Map latitude={latitude} longitude={longitude} hospitals={filteredHospitals} />
          </div>
        </div>



        <div className="glass-morph rounded-2xl shadow-lg slide-up-fade border border-white/20 dark:border-gray-700/50">
          <div className="p-6 space-y-4">
            {filteredHospitals.map((hospital: Hospital, index: number) => (
              <div
                key={index}
                className="glass-morph rounded-xl p-4 hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-300 group border border-white/10 dark:border-gray-700/30"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(hospital.status)} animate-pulse`}
                      ></div>
                      <div
                        className={`absolute inset-0 w-3 h-3 rounded-full ${getStatusColor(
                          hospital.status
                        )} animate-ping opacity-75`}
                      ></div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {hospital.name}
                      </p>
                      <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            hospital.type === 'Government'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                          }`}
                        >
                          {hospital.type}
                        </span>
                        <span>{hospital.distance}</span>
                        <span>•</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          ETA {hospital.eta}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors group">
                      <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    </button>
                    <button className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors group">
                      <Phone className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hospital.specialties.map((specialty: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {userData?.emergencyContacts && (
          <div className="glass-morph rounded-2xl p-6 slide-up-fade border border-white/20 dark:border-gray-700/50">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Emergency Contacts
            </h3>
            <div className="space-y-3">
              {userData.emergencyContacts.slice(0, 2).map((contact: EmergencyContact, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 glass-morph rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{contact.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{contact.relation}</p>
                    </div>
                  </div>
                  <button className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                    <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
