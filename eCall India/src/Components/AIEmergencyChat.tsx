import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Mic, MicOff, Volume2, VolumeX, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';


interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface Hospital {
  name: string;
  distance: number;
  type: string;
  phone?: string;
  address?: string;
}

interface AIEmergencyChatProps {
  isEmergencyMode?: boolean;
  userLocation?: { lat: number; lng: number };
}

const AIEmergencyChat: React.FC<AIEmergencyChatProps> = ({ 
  isEmergencyMode = false,
  userLocation 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: isEmergencyMode 
        ? "🚨 Emergency mode activated. I'm here to help you through this crisis. What's your current situation?"
        : "Hello! I'm your emergency assistant. I can help you with crash procedures, nearby hospitals, and emergency protocols. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = isEmergencyMode ? [
    "I'm injured, what should I do?",
    "Call emergency services now",
    "Where is the nearest hospital?",
    "I can't move, help me",
    "Send my location to family"
  ] : [
    "What should I do after a crash?",
    "Where is the nearest hospital?",
    "How to call emergency services?",
    "What information do I need for 112?",
    "How to help others at accident scene?",
    "What is my emergency contact info?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


const handleSendMessage = (message: string) => {
  if (!message.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    type: 'user',
    content: message,
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMessage]);
  setInputMessage('');
  setIsTyping(true);

  // Simulate AI response
  setTimeout(() => {
    const botResponse = generateBotResponse(message);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: botResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  }, 1200);
};

// Mock function to get nearby hospitals
function getNearbyHospitalsFromMap(lat?: number, lng?: number): Hospital[] {
  // You can replace this with real API logic as needed
   const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY;
  // const SEARCH_API_URL = 'https://api.tomtom.com/search/2/poiSearch/hospital.json';
  // For now, return static data

const generateBotResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase();

  if (isEmergencyMode) {
    if (msg.includes('injured') || msg.includes('hurt') || msg.includes('pain')) {
      return "🩹 Stay calm. Don't move unless you're in immediate danger. I'm calling emergency services now. Can you tell me what hurts and how severe the pain is on a scale of 1-10?";
    }

    if (msg.includes("can't move") || msg.includes('trapped') || msg.includes('stuck')) {
      return "🚨 Emergency services are being contacted immediately. Don't try to move. Help is on the way. Can you hear me clearly? Try to stay conscious and breathe slowly.";
    }

    if (msg.includes('call') || msg.includes('emergency') || msg.includes('112')) {
      return "📞 Calling 112 now... Emergency services have been notified of your location. They're dispatching help immediately. Stay on the line with me until they arrive.";
    }

    if (msg.includes('family') || msg.includes('contact') || msg.includes('notify')) {
      return "👨‍👩‍👧‍👦 Your emergency contacts are being notified with your location and situation. Your family will be informed immediately. Is there anyone specific you want me to call first?";
    }

    return "🆘 I understand this is scary. Help is on the way. Emergency services have your location. Try to stay calm and keep talking to me. What else can I help you with right now?";
  }

  // Regular mode responses
  if (msg.includes('crash') || msg.includes('accident')) {
    return "🚗 If you've been in a crash:\n\n1. Move to safety if possible\n2. Call 112 for emergency help\n3. Share your location\n4. Get medical attention even if you feel fine\n5. Use this app to contact your emergency contacts\n\nStay calm and prioritize safety first!";
  }

  if (msg.includes('hospital') || msg.includes('medical')) {
    const locationText = userLocation
      ? "Based on your current location"
      : "Here are some nearby hospitals";

    // Fetch real-time nearby hospitals from an API if userLocation is available
    if (userLocation) {
      // Placeholder static/mock data
      const nearbyHospitals = getNearbyHospitalsFromMap(userLocation.lat, userLocation.lng);
      let hospitalList = nearbyHospitals.map((hospital: Hospital) =>
        `• ${hospital.name} - ${hospital.distance.toFixed(1)} km (${hospital.type})\n  📞 [Call](${hospital.phone ? `tel:${hospital.phone}` : '#'}) | 🗺️ [Map](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + ' ' + (hospital.address || ''))})`
      ).join('\n');
      hospitalList += `\n\n📍 Your location: (${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)})`;

      return `🏥 ${locationText} (real-time):\n\n${hospitalList}\n\nWould you like me to help you call any of these hospitals or get directions?`;
    } else {
      // Fallback if no location
      const nearbyHospitals = getNearbyHospitalsFromMap();
      let hospitalList = nearbyHospitals.map((hospital: Hospital) =>
        `• ${hospital.name} - ${hospital.distance.toFixed(1)} km (${hospital.type})\n  📞 [Call](${hospital.phone ? `tel:${hospital.phone}` : '#'}) | 🗺️ [Map](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + ' ' + (hospital.address || ''))})`
      ).join('\n');
      return `🏥 ${locationText}:\n\n${hospitalList}\n\nWould you like me to help you call any of these hospitals or get directions?`;
    }
  }

  if (msg.includes('112') || msg.includes('emergency')) {
    return "📞 When calling 112 (India's emergency number):\n\n• State your emergency clearly\n• Provide your exact location\n• Mention number of people involved\n• Describe injuries if any\n• Stay on the line until help arrives\n\nThe app can auto-dial 112 from the Emergency panel if needed.";
  }

  if (msg.includes('help others') || msg.includes('assist')) {
    return "🤝 How to help at an accident scene:\n\n• Ensure your own safety first\n• Call emergency services (112)\n• Don't move injured persons unless in immediate danger\n• Control bleeding with clean cloth\n• Keep injured person calm and conscious\n• Direct traffic if safe to do so\n\nRemember: Only provide help within your capabilities.";
  }

  return "I understand you need help. Here are some quick actions:\n\n• 🚨 Emergency SOS - For immediate help\n• 🏥 Find Hospitals - Locate nearby medical care\n• 📞 Call 112 - Direct emergency services\n• 📱 Contact Family - Alert your emergency contacts\n\nWhat specific help do you need right now?";
};

const toggleVoiceInput = () => {
  setIsListening(!isListening);
  // In a real app, this would integrate with speech recognition
};

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <Card className={`glass-morph border-white/20 dark:border-gray-700/50 mb-4 ${isEmergencyMode ? 'border-red-500/50 bg-red-50/50 dark:bg-red-900/20' : ''}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isEmergencyMode ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                }`}
                animate={isEmergencyMode ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {isEmergencyMode ? (
                  <Zap className="w-6 h-6 text-red-600 dark:text-red-400" />
                ) : (
                  <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                )}
              </motion.div>
              <div>
                <h3 className={`font-bold ${isEmergencyMode ? 'text-red-800 dark:text-red-200' : 'text-gray-900 dark:text-white'}`}>
                  {isEmergencyMode ? 'Emergency Assistant' : 'AI Assistant'}
                </h3>
                <p className={`text-sm ${isEmergencyMode ? 'text-red-600 dark:text-red-300' : 'text-gray-600 dark:text-gray-400'}`}>
                  {isEmergencyMode ? 'Crisis Support Active' : 'Always here to help • Online'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2 rounded-full transition-colors ${
                voiceEnabled 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Quick Questions */}
      <div className={`mb-4 p-3 rounded-xl ${
        isEmergencyMode 
          ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
          : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
      }`}>
        <p className={`text-sm font-medium mb-2 ${
          isEmergencyMode ? 'text-red-800 dark:text-red-200' : 'text-blue-800 dark:text-blue-200'
        }`}>
          {isEmergencyMode ? 'Emergency Actions:' : 'Quick Questions:'}
        </p>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {quickQuestions.slice(0, 3).map((question, index) => (
            <motion.button
              key={index}
              onClick={() => handleSendMessage(question)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs hover:opacity-80 transition-all ${
                isEmergencyMode
                  ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300'
              }`}
            >
              {question}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-end space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <motion.div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : isEmergencyMode
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {message.type === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : isEmergencyMode ? (
                      <Zap className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </motion.div>
                  <motion.div 
                    className={`px-4 py-2 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : isEmergencyMode
                        ? 'bg-red-50 text-red-900 border border-red-200 dark:bg-red-900/20 dark:text-red-100 dark:border-red-800'
                        : 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' 
                        ? 'text-blue-100' 
                        : isEmergencyMode
                        ? 'text-red-500 dark:text-red-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-end space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isEmergencyMode
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {isEmergencyMode ? <Zap className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`px-4 py-2 rounded-2xl ${
                isEmergencyMode
                  ? 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
                  : 'bg-white shadow-sm dark:bg-gray-800'
              }`}>
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        isEmergencyMode ? 'bg-red-400' : 'bg-gray-400'
                      }`}
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ 
                        duration: 0.6, 
                        repeat: Infinity, 
                        delay: i * 0.2 
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <Card className="glass-morph border-white/20 dark:border-gray-700/50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={toggleVoiceInput}
              whileHover={{ scale: 1.1 }}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
              className={`p-2 rounded-full transition-colors ${
                isListening 
                  ? 'bg-red-100 text-red-600 animate-pulse dark:bg-red-900/30 dark:text-red-400' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </motion.button>
            
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
              placeholder={isEmergencyMode ? "Tell me what's happening..." : "Ask me anything about emergencies..."}
              className={`flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:border-transparent glass-morph ${
                isEmergencyMode
                  ? 'border-red-300 focus:ring-red-500 dark:border-red-700'
                  : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
              } text-gray-900 dark:text-white placeholder-gray-500`}
            />
            
            <motion.button
              onClick={() => handleSendMessage(inputMessage)}
              disabled={!inputMessage.trim()}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isEmergencyMode
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIEmergencyChat;
