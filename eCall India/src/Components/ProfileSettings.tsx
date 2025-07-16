import React, { useState } from 'react';
import { User, Heart, Phone, Shield, Globe, Bell, ChevronRight, Edit2 } from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const [profile] = useState({
    name: "Rajesh Kumar",
    bloodGroup: "O+",
    phone: "+91 98765 43210",
    insuranceNo: "INS123456789",
    emergencyContacts: [
      { name: "Priya Kumar (Wife)", phone: "+91 98765 43211" },
      { name: "Dr. Sharma (Family Doctor)", phone: "+91 98765 43212" },
    ]
  });

  const [settings, setSettings] = useState({
    language: "English",
    notifications: true,
    autoCall: true,
    locationSharing: true,
    crashSensitivity: "Medium"
  });

  const settingsOptions = [
    {
      category: "Emergency Settings",
      items: [
        { 
          icon: Shield, 
          label: "Auto-call Emergency Services", 
          value: settings.autoCall,
          type: "toggle",
          key: "autoCall"
        },
        { 
          icon: Bell, 
          label: "Crash Sensitivity", 
          value: settings.crashSensitivity,
          type: "select",
          key: "crashSensitivity",
          options: ["Low", "Medium", "High"]
        },
        { 
          icon: Globe, 
          label: "Location Sharing", 
          value: settings.locationSharing,
          type: "toggle",
          key: "locationSharing"
        },
      ]
    },
    {
      category: "App Settings",
      items: [
        { 
          icon: Globe, 
          label: "Language", 
          value: settings.language,
          type: "select",
          key: "language",
          options: ["English", "Hindi", "Tamil", "Telugu", "Bengali"]
        },
        { 
          icon: Bell, 
          label: "Notifications", 
          value: settings.notifications,
          type: "toggle",
          key: "notifications"
        },
      ]
    }
  ];

  type SettingKey = 'language' | 'notifications' | 'autoCall' | 'locationSharing' | 'crashSensitivity';
  type SettingValue = string | boolean;
  const handleSettingChange = (key: SettingKey, value: SettingValue) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile & Settings</h1>
        <p className="text-gray-600">Manage your emergency information</p>
      </div>

      {/* Profile Section */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-gray-600">{profile.phone}</p>
            </div>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Edit2 className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-red-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Heart className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-800 font-medium">Blood Group</span>
              </div>
              <p className="text-lg font-bold text-red-900">{profile.bloodGroup}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800 font-medium">Insurance</span>
              </div>
              <p className="text-sm font-medium text-blue-900">{profile.insuranceNo}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Emergency Contacts</h3>
            <div className="space-y-2">
              {profile.emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.phone}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings */}
        {settingsOptions.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-xl shadow-sm mb-6">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">{section.category}</h3>
            </div>
            <div className="p-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">{item.label}</span>
                  </div>
                  <div>
                    {item.type === 'toggle' ? (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!item.value}
                          onChange={(e) => handleSettingChange(item.key as SettingKey, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    ) : (
                      <select
                        value={typeof item.value === "string" ? item.value : ""}
                        onChange={(e) => handleSettingChange(item.key as SettingKey, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                      >
                        {item.options?.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Legal Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Legal & Privacy</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50 rounded-lg px-3">
                <span className="text-gray-900">Terms & Conditions</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50 rounded-lg px-3">
                <span className="text-gray-900">Privacy Policy</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50 rounded-lg px-3">
                <span className="text-gray-900">Data Usage & Retention</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;