import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic, MicOff } from 'lucide-react';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your emergency assistant. I can help you with crash procedures, nearby hospitals, and emergency protocols. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
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

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(message);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userMessage: string) => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('crash') || msg.includes('accident')) {
      return "If you've been in a crash:\n\n1. 🚗 Move to safety if possible\n2. 📞 Call 112 for emergency help\n3. 📍 Share your location\n4. 🏥 Get medical attention even if you feel fine\n5. 📱 Use this app to contact your emergency contacts\n\nStay calm and prioritize safety first!";
    }
    
    if (msg.includes('hospital') || msg.includes('medical')) {
      return "🏥 Based on your location, here are nearby hospitals:\n\n• AIIMS Delhi - 2.3 km (Government)\n• Max Hospital - 3.1 km (Private)\n• Fortis Healthcare - 4.2 km (Private)\n\nWould you like me to help you call any of these hospitals or get directions?";
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Emergency Assistant</h1>
            <p className="text-sm text-gray-600">Always here to help • Online</p>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
        <p className="text-sm text-blue-800 font-medium mb-2">Quick Questions:</p>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {quickQuestions.slice(0, 3).map((question, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(question)}
              className="flex-shrink-0 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-end space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`px-4 py-2 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 shadow-sm'
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div className="bg-white px-4 py-2 rounded-2xl shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleVoiceInput}
            className={`p-2 rounded-full transition-colors ${
              isListening 
                ? 'bg-red-100 text-red-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
            placeholder="Ask me anything about emergencies..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => handleSendMessage(inputMessage)}
            disabled={!inputMessage.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;