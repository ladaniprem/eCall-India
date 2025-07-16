import React, { useState, useEffect } from 'react';
import { Activity, Zap, Wifi, Battery } from 'lucide-react';
import MetricCard from './MetricCard';
import HospitalCard from './HospitalCard';
import FuturisticSOS from './FuturisticSOS';
import IntelligentCrashDetection from './IntelligentCrashDetection';
import { DarkModeToggle } from './DarkModeProvider';
import Map from './Map';

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

interface FuturisticDashboardProps {
  onEmergency: (severity?: 'low' | 'medium' | 'high') => void;
}

const FuturisticDashboard = ({ onEmergency }: FuturisticDashboardProps): React.ReactElement => {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [signalStrength, setSignalStrength] = useState(4);
  const [crashSeverity, setCrashSeverity] = useState<'low' | 'medium' | 'high' | null>(null);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  // Removed unused state variable 'nearbyAlerts'
  const [lastSync, setLastSync] = useState(new Date());
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);

  const fetchNearbyHospitals = async (lat: number, lon: number): Promise<Hospital[]> => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=hospital&limit=10&lat=${lat}&lon=${lon}&countrycodes=in`);
    const data = await res.json();
    return data.map((item: { display_name: string; lat: string; lon: string }) => ({
      name: item.display_name.split(",")[0],
      distance: `${(Math.random() * 5 + 1).toFixed(1)} km`,
      status: Math.random() > 0.7 ? "busy" : "available",
      type: Math.random() > 0.5 ? "Government" : "Private",
      eta: `${Math.floor(Math.random() * 20 + 5)} mins`,
      specialties: ["Emergency", "Cardiology", "Trauma"].sort(() => 0.5 - Math.random()).slice(0, 2),
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon)
    }));
  };

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error("Location error", error);
        alert("⚠️ Location access error. Please enable GPS.");
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      fetchNearbyHospitals(latitude, longitude).then((hospitals) => {
        const range = 10; // km
        const nearby = hospitals.filter(h => {
          const dist = calculateDistance(latitude, longitude, h.latitude, h.longitude);
          return dist <= range;
        });
        setFilteredHospitals(nearby);
      });
    }
  }, [latitude, longitude]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpeed(prev => Math.max(0, Math.min(120, prev + (Math.random() - 0.5) * 10)));
      setBatteryLevel(prev => Math.max(20, prev - Math.random() * 0.1));
      setSignalStrength(Math.floor(Math.random() * 5));
      setLastSync(new Date());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const handleCrashDetected = (severity: 'low' | 'medium' | 'high') => {
    setCrashSeverity(severity);
    setIsEmergencyMode(true);
    onEmergency(severity);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'unavailable': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSignalBars = () =>
    Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`w-1 rounded-full ${i < signalStrength ? 'bg-green-500 dark:bg-green-400' : 'bg-gray-300 dark:bg-gray-600'}`}
        style={{ height: `${(i + 1) * 3 + 4}px` }}
      />
    ));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="glass-morph shadow-lg px-6 py-8 border-b border-white/20 dark:border-gray-700/50">
        <div className="flex justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              eCall India
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Intelligent Emergency Response</p>
          </div>
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            <div className="flex items-center space-x-2">{getSignalBars()} <Wifi className="w-4 h-4 text-green-500" /></div>
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 dark:text-green-400 font-medium">System Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <Battery className="w-4 h-4" />
              <span>{batteryLevel.toFixed(0)}%</span>
            </div>
          </div>
          <span className="text-xs text-gray-500">Last sync: {lastSync.toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        <IntelligentCrashDetection onCrashDetected={handleCrashDetected} isActive />
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            icon={<Activity className="w-6 h-6 text-blue-600" />}
            title="Current Speed"
            value={currentSpeed.toFixed(0)}
            unit="km/h"
            progressBarWidth={`${Math.min(currentSpeed / 120 * 100, 100)}%`}
            progressBarColor="bg-blue-500"
            hoverColor="border-blue-500"
          />
          <MetricCard
            icon={<Zap className="w-6 h-6 text-green-600" />}
            title="Battery"
            value={`${batteryLevel.toFixed(0)}%`}
            unit=""
            progressBarWidth={`${batteryLevel}%`}
            progressBarColor={batteryLevel > 50 ? 'bg-green-500' : batteryLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'}
            hoverColor="border-green-500"
          />
        </div>

        <div className="glass-morph rounded-2xl shadow-lg border border-white/20">
          <div className="relative h-[500px]">
            <Map latitude={latitude} longitude={longitude} hospitals={filteredHospitals} />
          </div>
        </div>

        <div className="flex justify-center py-8">
          <FuturisticSOS 
            onEmergency={() => onEmergency()}
            crashSeverity={crashSeverity}
            isEmergencyMode={isEmergencyMode}
          />
        </div>

        <div className="glass-morph rounded-2xl shadow-lg border border-white/20">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Nearby Hospitals</h3>
          </div>
          <div className="p-6 space-y-4">
            {filteredHospitals.map((hospital, index) => (
              <HospitalCard key={index} hospital={hospital} getStatusColor={getStatusColor} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuturisticDashboard;
