import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Phone, MapPin, Heart } from 'lucide-react';

interface EmergencyVoiceAssistantProps {
  userName?: string;
  isActive: boolean;
  emergencyType?: 'crash' | 'medical' | 'manual';
}

const EmergencyVoiceAssistant: React.FC<EmergencyVoiceAssistantProps> = ({ 
  userName = "User", 
  isActive,
  emergencyType = 'crash'
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [assistantStep, setAssistantStep] = useState(0);

  const emergencyMessages = {
    crash: [
      `${userName}, I've detected a crash. Help is on the way.`,
      "Emergency services have been contacted automatically.",
      "Your location has been shared with nearby hospitals.",
      "Stay calm and don't move unless you're in immediate danger.",
      "If you can hear me, try to stay conscious and breathe slowly."
    ],
    medical: [
      `${userName}, I'm here to help with your medical emergency.`,
      "Emergency services are being contacted now.",
      "Your medical information is being shared with responders.",
      "Try to stay calm and follow my instructions.",
      "Help will arrive soon. You're not alone."
    ],
    manual: [
      `${userName}, I've received your emergency signal.`,
      "Contacting emergency services immediately.",
      "Your emergency contacts are being notified.",
      "Stay on the line and keep this app open.",
      "Help is on the way to your location."
    ]
  };

  const reassuranceMessages = [
    "You're doing great. Help is almost there.",
    "Emergency responders are en route to your location.",
    "Your family has been notified and they're on their way.",
    "Medical professionals will be with you shortly.",
    "Stay strong. You're going to be okay."
  ];

  // Text-to-speech function
  const speak = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Use a calm, reassuring voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Female') || voice.name.includes('Samantha')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
    setCurrentMessage(text);
  };

  // Emergency voice sequence
  useEffect(() => {
    if (isActive && voiceEnabled) {
      const messages = emergencyMessages[emergencyType];
      
      // Initial message immediately
      speak(messages[0]);
      setAssistantStep(1);
      
      // Subsequent messages with delays
      const intervals: ReturnType<typeof setTimeout>[] = [];
      
      messages.slice(1).forEach((message, index) => {
        const timeout = setTimeout(() => {
          speak(message);
          setAssistantStep(index + 2);
        }, (index + 1) * 8000); // 8 second intervals
        
        intervals.push(timeout);
      });
      
      // Reassurance messages every 30 seconds after initial sequence
      const reassuranceInterval = setInterval(() => {
        if (assistantStep >= messages.length) {
          const randomReassurance = reassuranceMessages[
            Math.floor(Math.random() * reassuranceMessages.length)
          ];
          speak(randomReassurance);
        }
      }, 30000);
      
      intervals.push(reassuranceInterval);
      
      return () => {
        intervals.forEach(clearTimeout);
        window.speechSynthesis.cancel();
      };
    }
  }, [isActive, emergencyType, voiceEnabled, userName]);

  if (!isActive) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl p-4 backdrop-blur-lg border border-white/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full bg-white/20 flex items-center justify-center ${isSpeaking ? 'animate-pulse' : ''}`}>
              <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce' : ''}`} />
            </div>
            <div>
              <h3 className="font-semibold">Emergency Assistant</h3>
              <p className="text-sm text-blue-100">
                {isSpeaking ? 'Speaking...' : 'Standing by'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            {voiceEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {/* Current message display */}
        <div className="bg-white/10 rounded-lg p-3 mb-3">
          <p className="text-sm leading-relaxed">
            {currentMessage || "Initializing emergency response..."}
          </p>
        </div>
        
        {/* Progress indicators */}
        <div className="flex items-center justify-between text-xs text-blue-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone className="w-3 h-3" />
              <span>112 Called</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>Location Shared</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-3 h-3" />
              <span>Contacts Notified</span>
            </div>
          </div>
          
          {/* Voice wave animation */}
          {isSpeaking && (
            <div className="flex items-center space-x-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-white rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 16 + 8}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.5s'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyVoiceAssistant;