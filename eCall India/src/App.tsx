import { useState } from 'react';
import { Shield, Phone, MapPin, Settings, Video, Bot } from 'lucide-react';
import FluidOnboarding from './Components/FluidOnboarding';
import FuturisticDashboard from './Components/FuturisticDashboard';
import EmergencyPanel from './Components/EmergencyPanel';
import HospitalSearch from './Components/HospitalSearch';
import AnimatedProfileSettings from './Components/AnimatedProfileSettings';
import ChatBot from './Components/ChatBot';
import VideoRecorder from './Components/VideoRecorder';
import { DarkModeProvider } from './Components/DarkModeProvider';
import EmergencyVoiceAssistant from './Components/EmergencyVoiceAssistant';



function App() {
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [crashSeverity, setCrashSeverity] = useState<'low' | 'medium' | 'high' | null>(null);
  const [userName] = useState('Rajesh');

  const handleAuthComplete = () => {
    setIsAuthenticated(true);
    setCurrentScreen('dashboard');
  };

  const handleEmergency = (severity?: 'low' | 'medium' | 'high') => {
    setEmergencyMode(true);
    setCrashSeverity(severity || null);
    setCurrentScreen('emergency');
  };

  const navigationItems = [
    { id: 'dashboard', icon: MapPin, label: 'Dashboard' },
    { id: 'hospitals', icon: Phone, label: 'Hospitals' },
    { id: 'video', icon: Video, label: 'Recorder' },
    { id: 'chat', icon: Bot, label: 'Assistant' },
    { id: 'profile', icon: Settings, label: 'Profile' },
  ];

  const renderScreen = () => {
    if (!isAuthenticated) {
      return <FluidOnboarding onComplete={handleAuthComplete} />;
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
        return <HospitalSearch />;
      case 'video':
        return <VideoRecorder />;
      case 'chat':
        return <ChatBot />;
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
          userName={userName}
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
                className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  currentScreen === id
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