import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, MapPin, ArrowLeft, Send, Play, Pause, Clock } from 'lucide-react';

interface EmergencyPanelProps {
  onBack: () => void;
  crashSeverity?: 'low' | 'medium' | 'high' | null;
}

const EmergencyPanel: React.FC<EmergencyPanelProps> = ({ onBack, crashSeverity }) => {
  const [activeTab, setActiveTab] = useState('location');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [crashDetected] = useState(!!crashSeverity);
  const [emergencyMessage, setEmergencyMessage] = useState(
    "🚨 EMERGENCY ALERT: I've been involved in an accident. Location: Connaught Place, New Delhi. Please send help immediately. This is an automated message from JeevSanket India."
  );

  useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const emergencyContacts = [
    { name: "Emergency Services", number: "112", type: "emergency" },
    { name: "Family Contact", number: "+91 98765 43210", type: "family" },
    { name: "AIIMS Delhi", number: "+91 11 2658 8500", type: "hospital" },
  ];

  const tabs = [
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'message', label: 'Message', icon: MessageSquare },
    { id: 'call', label: 'Call', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-red-50 dark:bg-red-900/20 transition-colors duration-300 slide-up-fade">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-6 shadow-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 hover:bg-red-700/50 rounded-full transition-all duration-300 glass-morph"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">EMERGENCY MODE</h1>
            <p className="text-red-100 text-sm">Help is on the way</p>
          </div>
          <div className="w-10 h-10"></div>
        </div>

        {/* Crash Detection Alert */}
        {crashDetected && (
          <div className="mt-4 glass-morph rounded-xl p-4 flex items-center space-x-3 border border-red-400/50 electric-shock">
            <div className="relative">
              <div className="w-3 h-3 bg-red-300 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-red-300 rounded-full animate-ping"></div>
            </div>
            <div>
              <p className="font-bold text-lg">{crashSeverity ? `${crashSeverity.toUpperCase()} CRASH DETECTED` : 'EMERGENCY ACTIVATED'}</p>
              <p className="text-sm text-red-100">Impact: 8.5G • Speed: 45 km/h</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="glass-morph border-b border-white/20 dark:border-gray-700/50 transition-colors duration-300">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-4 text-sm font-medium border-b-2 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600 bg-red-50/50 dark:bg-red-900/30 dark:text-red-400 shadow-lg'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/20'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'location' && (
          <div className="space-y-4">
            <div className="glass-morph rounded-2xl shadow-lg p-6 transition-colors duration-300 border border-white/20 dark:border-gray-700/50 slide-up-fade">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Current Location</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Coordinates</span>
                  <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">28.6139°N, 77.2090°E</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Address</span>
                  <span className="text-sm font-medium">Connaught Place, New Delhi</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Accuracy</span>
                  <span className="text-sm text-green-600 font-medium">±5 meters</span>
                </div>
              </div>
            </div>

            <div className="glass-morph rounded-2xl shadow-lg p-6 transition-colors duration-300 border border-white/20 dark:border-gray-700/50 slide-up-fade">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Emergency Recording</h3>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {isRecording ? formatTime(recordingTime) : '00:00'}
                  </span>
                </div>
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                    isRecording 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200 animate-pulse' 
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  {isRecording ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isRecording ? 'Recording emergency video...' : 'Tap to start recording'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'message' && (
          <div className="space-y-4">
            <div className="glass-morph rounded-2xl shadow-lg p-6 transition-colors duration-300 border border-white/20 dark:border-gray-700/50 slide-up-fade">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Emergency Message</h3>
              <textarea
                value={emergencyMessage}
                onChange={(e) => setEmergencyMessage(e.target.value)}
                className="w-full h-32 p-4 glass-morph border border-white/30 dark:border-gray-600 rounded-xl resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-300"
                placeholder="Emergency message..."
              />
            </div>

            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg">
                <MessageSquare className="w-5 h-5" />
                <span>Send via WhatsApp</span>
              </button>
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg">
                <Send className="w-5 h-5" />
                <span>Send via SMS</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'call' && (
          <div className="space-y-4">
            <div className="glass-morph rounded-2xl shadow-lg p-6 transition-colors duration-300 border border-white/20 dark:border-gray-700/50 slide-up-fade">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Emergency Contacts</h3>
              <div className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-4 glass-morph rounded-xl transition-all duration-300 hover:bg-white/20 dark:hover:bg-gray-700/20 border border-white/10 dark:border-gray-700/30">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{contact.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{contact.number}</p>
                    </div>
                    <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg">
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyPanel;