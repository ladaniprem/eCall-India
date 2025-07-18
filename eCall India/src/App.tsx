
import  { useState } from 'react';
import { Shield, Phone, MapPin, Video, Bot, User } from 'lucide-react';
import AuthSystem from './Components/AuthSystem';
import Enhanced3DOnboarding from './Components/Enhanced3DOnboarding';
import FuturisticDashboard from './Components/FuturisticDashboard';
import EmergencyPanel from './Components/EmergencyPanel';
import LiveLocationMap from './Components/LiveLocationMap';
import AnimatedProfileSettings from './Components/AnimatedProfileSettings';
import AIEmergencyChat from './Components/AIEmergencyChat';
import VideoRecorder from './Components/VideoRecorder';
import { DarkModeProvider } from './Components/DarkModeProvider';
import EmergencyVoiceAssistant from './Components/EmergencyVoiceAssistant';


type User = {
  name: string;
  email: string;
  // Add other user properties as needed
};

function App() {
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [crashSeverity, setCrashSeverity] = useState<'low' | 'medium' | 'high' | null>(null);
  const [searchRadius, setSearchRadius] = useState(5);
  const [userLocation] = useState({ lat: 28.6139, lng: 77.2090 }); // Delhi coordinates

  const handleAuthComplete = (user: User) => {
    setIsAuthenticated(true);
    setUserData(user);
    setCurrentScreen('dashboard');
  };

  const handleEmergency = (severity?: 'low' | 'medium' | 'high') => {
    setEmergencyMode(true);
    setCrashSeverity(severity || null);
    setCurrentScreen('emergency');
  };

  interface Hospital {
    name: string;
    // Add other relevant hospital properties if needed
  }

  const handleHospitalCall = (hospital: Hospital) => {
    // Simulate calling hospital
    console.log('Calling hospital:', hospital.name);
    // In a real app, this would initiate a phone call
  };

  const navigationItems = [
    { id: 'dashboard', icon: MapPin, label: 'Dashboard' },
    { id: 'hospitals', icon: Phone, label: 'Hospitals' },
    { id: 'video', icon: Video, label: 'Recorder' },
    { id: 'chat', icon: Bot, label: 'Assistant' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const renderScreen = () => {
    if (currentScreen === 'onboarding') {
      return <Enhanced3DOnboarding onComplete={() => setCurrentScreen('auth')} />;
    }

    if (currentScreen === 'auth') {
      return <AuthSystem onAuthComplete={handleAuthComplete} />;
    }

    switch (currentScreen) {
      case 'dashboard':
        return <FuturisticDashboard onEmergency={handleEmergency} />;
      case 'emergency':
        return <EmergencyPanel
          onBack={() => {
            setCurrentScreen('dashboard');
            setEmergencyMode(false);
            setCrashSeverity(null);
          }}
          crashSeverity={crashSeverity}
        />;
      case 'hospitals':
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Nearby Hospitals
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Find emergency care near you
              </p>
            </div>
            <LiveLocationMap
              userLocation={userLocation}
              searchRadius={searchRadius}
              onRadiusChange={setSearchRadius}
              onHospitalCall={handleHospitalCall}
            />
          </div>
        );
      case 'video':
        return <VideoRecorder />;
      case 'chat':
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <AIEmergencyChat
              isEmergencyMode={emergencyMode}
              userLocation={userLocation}
            />
          </div>
        );
      case 'profile':
        return <AnimatedProfileSettings />;
      default:
        return <FuturisticDashboard onEmergency={handleEmergency} />;
    }
  };

  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Emergency Voice Assistant */}
        <EmergencyVoiceAssistant
          userName={userData?.name || 'User'}
          isActive={emergencyMode}
          emergencyType={crashSeverity ? 'crash' : 'manual'}
        />

        {/* Emergency Mode Overlay */}
        {emergencyMode && (
          <div className="fixed inset-0 bg-red-600/90 backdrop-blur-lg z-40 flex items-center justify-center">
            <div className="glass-morph p-8 rounded-3xl shadow-2xl text-center max-w-sm mx-4 border border-red-500/50 slide-up-fade">
              <div className="text-red-600 dark:text-red-400 mb-6 electric-shock">
                <Shield className="w-16 h-16 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {crashSeverity ? `${crashSeverity.toUpperCase()} CRASH DETECTED` : 'EMERGENCY ACTIVATED'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {crashSeverity === 'high'
                  ? 'Auto-calling emergency services...'
                  : 'Contacting emergency services...'}
              </p>

              {/* Progress indicator */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
                <div className="bg-red-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>

              <button
                onClick={() => {
                  setEmergencyMode(false);
                  setCrashSeverity(null);
                }}
                className="bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                I'm Safe - Cancel
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="pb-20">
          {renderScreen()}
        </div>

        {/* Bottom Navigation */}
        {isAuthenticated && (
          <nav className="fixed bottom-0 left-0 right-0 glass-morph border-t border-white/20 dark:border-gray-700/50 px-4 py-2 transition-all duration-300 backdrop-blur-lg">
            <div className="flex justify-around items-center">
              {navigationItems.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setCurrentScreen(id)}
                  className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${currentScreen === id
                      ? 'text-blue-600 bg-blue-100/50 dark:bg-blue-900/30 dark:text-blue-400 shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/20 dark:hover:bg-gray-700/20'
                    }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </DarkModeProvider>
  );
}

export default App;