import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Zap, AlertTriangle, Activity } from 'lucide-react';
import AnimatedSOS from './AnimatedSOS';
import CrashDetectionSystem from './CrashDetectionSystem';
import { DarkModeToggle } from './DarkModeProvider';

interface DashboardProps {
  onEmergency: (severity?: 'minor' | 'moderate' | 'severe') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onEmergency }) => {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [lastSync, setLastSync] = useState(new Date());
  const [nearbyAlerts] = useState(2);
  const [batteryLevel] = useState(85);
  const [crashSeverity, setCrashSeverity] = useState<'minor' | 'moderate' | 'severe' | null>(null);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setCurrentSpeed(Math.floor(Math.random() * 60));
      setLastSync(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleCrashDetected = (severity: 'minor' | 'moderate' | 'severe') => {
    setCrashSeverity(severity);
    setIsEmergencyMode(true);
    onEmergency(severity);
  };

  const handleVoiceTrigger = () => {
    onEmergency();
  };

  const hospitals = [
    { name: "AIIMS Delhi", distance: "2.3 km", status: "available", type: "Government" },
    { name: "Max Hospital", distance: "3.1 km", status: "busy", type: "Private" },
    { name: "Fortis Healthcare", distance: "4.2 km", status: "available", type: "Private" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'unavailable': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm px-4 py-6 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">eCall Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Stay safe, stay connected</p>
          </div>
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Online</span>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="px-4 py-6">
        {/* Crash Detection System */}
        <CrashDetectionSystem 
          onCrashDetected={handleCrashDetected}
          onVoiceTrigger={handleVoiceTrigger}
        />

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Speed</p>
                <p className="text-2xl font-bold text-blue-600">{currentSpeed}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">km/h</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Battery Level</p>
                <p className="text-2xl font-bold text-green-600">{batteryLevel}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Good</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 overflow-hidden transition-colors duration-300">
          <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <p className="text-gray-700 dark:text-gray-300 font-medium">Your Current Location</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Connaught Place, New Delhi</p>
              </div>
            </div>
            
            {/* Floating location badge */}
            <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">GPS Active</span>
              </div>
            </div>

            {/* Nearby alerts badge */}
            <div className="absolute top-4 right-4 bg-yellow-500 text-white rounded-full px-3 py-1 shadow-lg">
              <div className="flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">{nearbyAlerts}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency SOS Button */}
        <div className="mb-6">
          <div className="flex justify-center">
            <AnimatedSOS 
              onEmergency={() => onEmergency()}
              isEmergencyMode={isEmergencyMode}
              crashSeverity={crashSeverity}
            />
          </div>
        </div>

        {/* Nearby Hospitals */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-colors duration-300">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Nearby Hospitals</h3>
          </div>
          <div className="p-4">
            {hospitals.map((hospital, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(hospital.status)}`}></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{hospital.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{hospital.type} • {hospital.distance}</p>
                  </div>
                </div>
                <button className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                  <Phone className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Last Sync */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Last sync: {lastSync.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;