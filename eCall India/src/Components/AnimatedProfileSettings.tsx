import React, { useState } from 'react';
import { User, Heart, Phone, Shield, Globe, Bell, ChevronRight, Edit2, Check, X } from 'lucide-react';

const AnimatedProfileSettings: React.FC = () => {
  const [profile] = useState({
    name: "",
    bloodGroup: "O+",
    phone: "+91 98765 43210",
    insuranceNo: "INS123456789",
    emergencyContacts: [
      { id: 1, name: "Priya Kumar (Wife)", phone: "+91 98765 43211", priority: 1 },
      { id: 2, name: "Dr. Sharma (Family Doctor)", phone: "+91 98765 43212", priority: 2 },
      { id: 3, name: "Amit Kumar (Brother)", phone: "+91 98765 43213", priority: 3 },
    ]
  });

  const [settings, setSettings] = useState({
    language: "English",
    notifications: true,
    autoCall: true,
    locationSharing: true,
    crashSensitivity: "Medium",
    darkMode: true,
    voiceAssistant: true
  });

  const [editingContact, setEditingContact] = useState<number | null>(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const settingsOptions = [
    {
      category: "Emergency Response",
      items: [
        { 
          icon: Shield, 
          label: "Auto-call Emergency Services", 
          value: settings.autoCall,
          type: "toggle",
          key: "autoCall",
          description: "Automatically call 112 for high-severity crashes"
        },
        { 
          icon: Bell, 
          label: "Crash Sensitivity", 
          value: settings.crashSensitivity,
          type: "select",
          key: "crashSensitivity",
          options: ["Low", "Medium", "High"],
          description: "Adjust crash detection sensitivity"
        },
        { 
          icon: Globe, 
          label: "Location Sharing", 
          value: settings.locationSharing,
          type: "toggle",
          key: "locationSharing",
          description: "Share location with emergency contacts"
        },
      ]
    },
    {
      category: "App Experience",
      items: [
        { 
          icon: Globe, 
          label: "Language", 
          value: settings.language,
          type: "select",
          key: "language",
          options: ["English", "Hindi", "Tamil", "Telugu", "Bengali", "Marathi"],
          description: "Choose your preferred language"
        },
        { 
          icon: Bell, 
          label: "Voice Assistant", 
          value: settings.voiceAssistant,
          type: "toggle",
          key: "voiceAssistant",
          description: "Enable emergency voice guidance"
        },
        { 
          icon: Bell, 
          label: "Push Notifications", 
          value: settings.notifications,
          type: "toggle",
          key: "notifications",
          description: "Receive app notifications"
        },
      ]
    }
  ];

  type SettingKey = keyof typeof settings;
  type SettingValue = string | boolean;

  const handleSettingChange = (key: SettingKey, value: SettingValue) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleContactEdit = (contactId: number) => {
    setEditingContact(contactId);
  };

  const handleContactSave = () => {
    setEditingContact(null);
    // In a real app, this would save to backend
  };

  const policyContent = [
    {
      title: "Emergency Data Usage",
      content: "Your location and crash data are only shared during emergencies to save lives. We never sell or misuse your personal information."
    },
    {
      title: "Contact Privacy",
      content: "Emergency contacts are stored securely and only contacted during verified emergencies or when you manually trigger SOS."
    },
    {
      title: "Data Retention",
      content: "Crash data is retained for 30 days for analysis and improvement. You can request deletion at any time."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Animated Header */}
      <div className="glass-morph shadow-lg px-6 py-8 slide-up-fade">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Profile & Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your emergency information and preferences
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Enhanced Profile Section */}
        <div className="glass-morph rounded-2xl p-8 slide-up-fade border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {profile.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{profile.phone}</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Emergency Profile Active
                </span>
              </div>
            </div>
            <button className="p-3 glass-morph rounded-full hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-300">
              <Edit2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Medical Info Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="glass-morph rounded-xl p-4 border border-red-200/50 dark:border-red-800/50 hover:border-red-300/70 dark:hover:border-red-700/70 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-sm font-medium text-red-800 dark:text-red-300">Blood Group</span>
              </div>
              <p className="text-2xl font-bold text-red-900 dark:text-red-200">{profile.bloodGroup}</p>
            </div>
            
            <div className="glass-morph rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50 hover:border-blue-300/70 dark:hover:border-blue-700/70 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Insurance</span>
              </div>
              <p className="text-sm font-bold text-blue-900 dark:text-blue-200 truncate">
                {profile.insuranceNo}
              </p>
            </div>
          </div>

          {/* Emergency Contacts with Priority */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Emergency Contacts
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                Auto-fallback enabled
              </span>
            </div>
            <div className="space-y-3">
              {profile.emergencyContacts.map((contact) => (
                <div 
                  key={contact.id} 
                  className="glass-morph rounded-xl p-4 hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 border border-white/20 dark:border-gray-700/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                          <Phone className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {contact.priority}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {contact.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {contact.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {editingContact === contact.id ? (
                        <>
                          <button 
                            onClick={handleContactSave}
                            className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                          >
                            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </button>
                          <button 
                            onClick={() => setEditingContact(null)}
                            className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          >
                            <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleContactEdit(contact.id)}
                          className="p-2 glass-morph rounded-full hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-300"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Settings */}
        {settingsOptions.map((section, sectionIndex) => (
          <div key={sectionIndex} className="glass-morph rounded-2xl slide-up-fade border border-white/20 dark:border-gray-700/50" style={{ animationDelay: `${sectionIndex * 0.1}s` }}>
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {section.category}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="glass-morph rounded-xl p-4 hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.label}
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div>
                      {item.type === 'toggle' ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(item.value)}
                            onChange={(e) => handleSettingChange(item.key as SettingKey, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-7 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-lg"></div>
                        </label>
                      ) : (
                        <select
                          value={typeof item.value === "boolean" ? String(item.value) : item.value}
                          onChange={(e) => handleSettingChange(item.key as SettingKey, e.target.value)}
                          className="glass-morph border border-white/30 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {item.options?.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Enhanced Legal Section */}
        <div className="glass-morph rounded-2xl slide-up-fade border border-white/20 dark:border-gray-700/50">
          <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Privacy & Legal
            </h3>
          </div>
          <div className="p-6 space-y-3">
            <button 
              onClick={() => setShowPolicyModal(true)}
              className="w-full glass-morph rounded-xl p-4 text-left hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">
                  Privacy Policy & Data Usage
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </button>
            
            <button className="w-full glass-morph rounded-xl p-4 text-left hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">
                  Terms & Conditions
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-morph rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden border border-white/20 dark:border-gray-700/50 slide-up-fade">
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Privacy & Data Usage
                </h3>
                <button 
                  onClick={() => setShowPolicyModal(false)}
                  className="p-2 glass-morph rounded-full hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-300"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-96 space-y-6">
              {policyContent.map((section, index) => (
                <div key={index} className="slide-up-fade" style={{ animationDelay: `${index * 0.1}s` }}>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {section.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedProfileSettings;