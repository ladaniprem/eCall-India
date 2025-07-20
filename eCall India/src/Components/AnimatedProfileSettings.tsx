import React, { useState, useEffect } from 'react';
import { User, Heart, Phone, Shield, Globe, Bell, Edit2, Check, X, Plus, Trash2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmergencyContact {
  id: number;
  name: string;
  phone: string;
  relation: string;
  priority: number;
}

interface UserProfile {
  name: string;
  email: string;
  bloodGroup: string;
  phone: string;
  insuranceNo: string;
  address: string;
  dateOfBirth: string;
  emergencyContacts: EmergencyContact[];
}

const AnimatedProfileSettings: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    bloodGroup: "O+",
    phone: "+91 98765 43210",
    insuranceNo: "INS123456789",
    address: "123 Main Street, Connaught Place, New Delhi",
    dateOfBirth: "1985-06-15",
    emergencyContacts: [
      { id: 1, name: "Priya Kumar", phone: "+91 98765 43211", relation: "Wife", priority: 1 },
      { id: 2, name: "Dr. Sharma", phone: "+91 98765 43212", relation: "Doctor", priority: 2 },
      { id: 3, name: "Amit Kumar", phone: "+91 98765 43213", relation: "Brother", priority: 3 },
    ]
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingContact, setEditingContact] = useState<number | null>(null);
  const [tempValues, setTempValues] = useState<Partial<UserProfile> | Partial<EmergencyContact>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());

  const [settings, setSettings] = useState({
    language: "English",
    notifications: true,
    autoCall: true,
    locationSharing: true,
    crashSensitivity: "Medium",
    darkMode: true,
    voiceAssistant: true
  });

  // Auto-save functionality
  const handleAutoSave = React.useCallback(() => {
    // Simulate API call to save profile
    console.log('Auto-saving profile...', profile);
    setHasUnsavedChanges(false);
    setLastSaved(new Date());
  }, [profile]);

  useEffect(() => {
    if (hasUnsavedChanges) {
      const autoSaveTimer = setTimeout(() => {
        handleAutoSave();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(autoSaveTimer);
    }
  }, [profile, hasUnsavedChanges, handleAutoSave]);

  const handleFieldEdit = (field: string, value: string) => {
    setEditingField(field);
    setTempValues({ ...tempValues, [field]: value });
  };

  const handleFieldSave = (field: string) => {
    setProfile({ ...profile, [field]: (tempValues as Partial<UserProfile>)[field as keyof UserProfile] });
    setEditingField(null);
    setHasUnsavedChanges(true);
  };

  const handleFieldCancel = () => {
    setEditingField(null);
    setTempValues({});
  };

  const handleContactEdit = (contactId: number) => {
    setEditingContact(contactId);
    const contact = profile.emergencyContacts.find(c => c.id === contactId);
    if (contact) {
      setTempValues({ ...contact });
    }
  };

  const handleContactSave = (contactId: number) => {
    const updatedContacts = profile.emergencyContacts.map(contact =>
      contact.id === contactId
        ? {
            ...contact,
            ...(tempValues as Partial<EmergencyContact>),
          }
        : contact
    );
    setProfile({ ...profile, emergencyContacts: updatedContacts });
    setEditingContact(null);
    setTempValues({});
    setHasUnsavedChanges(true);
  };

  const handleContactCancel = () => {
    setEditingContact(null);
    setTempValues({});
  };

  const handleAddContact = () => {
    const newContact: EmergencyContact = {
      id: Math.max(...profile.emergencyContacts.map(c => c.id)) + 1,
      name: "",
      phone: "",
      relation: "Family",
      priority: profile.emergencyContacts.length + 1
    };
    setProfile({
      ...profile,
      emergencyContacts: [...profile.emergencyContacts, newContact]
    });
    setEditingContact(newContact.id);
    setTempValues(newContact);
    setHasUnsavedChanges(true);
  };

  const handleDeleteContact = (contactId: number) => {
    const updatedContacts = profile.emergencyContacts
      .filter(contact => contact.id !== contactId)
      .map((contact, index) => ({ ...contact, priority: index + 1 }));
    
    setProfile({ ...profile, emergencyContacts: updatedContacts });
    setHasUnsavedChanges(true);
  };

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

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

  const profileFields = [
    { key: 'name', label: 'Full Name', type: 'text', icon: User },
    { key: 'email', label: 'Email Address', type: 'email', icon: User },
    { key: 'phone', label: 'Phone Number', type: 'tel', icon: Phone },
    { key: 'address', label: 'Home Address', type: 'text', icon: Globe },
    { key: 'dateOfBirth', label: 'Date of Birth', type: 'date', icon: User },
    { key: 'insuranceNo', label: 'Insurance Number', type: 'text', icon: Shield },
  ];

  const relationOptions = ["Family", "Friend", "Doctor", "Colleague", "Spouse", "Parent", "Sibling", "Other"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header with Save Status */}
      <div className="glass-morph shadow-lg px-6 py-8 slide-up-fade">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Profile & Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your emergency information and preferences
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {hasUnsavedChanges && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-sm"
              >
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span>Auto-saving...</span>
              </motion.div>
            )}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Enhanced Profile Section */}
        <motion.div 
          className="glass-morph rounded-2xl p-8 slide-up-fade border border-white/20 dark:border-gray-700/50"
          layout
        >
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
              <p className="text-gray-600 dark:text-gray-400 mb-2">{profile.email}</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Emergency Profile Active
                </span>
              </div>
            </div>
          </div>

          {/* Editable Profile Fields */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileFields.map((field) => (
                <motion.div 
                  key={field.key}
                  className="glass-morph rounded-xl p-4 hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <field.icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {field.label}
                      </label>
                    </div>
                    {editingField !== field.key && (
                      <button
                        onClick={() => handleFieldEdit(field.key, profile[field.key as keyof UserProfile] as string)}
                        className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {editingField === field.key ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type={field.type}
                        value={tempValues[field.key as keyof typeof tempValues] || ''}
                        onChange={(e) => setTempValues({ ...tempValues, [field.key]: e.target.value })}
                        className="flex-1 px-3 py-2 glass-morph border border-white/30 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => handleFieldSave(field.key)}
                        className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                      >
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </button>
                      <button
                        onClick={handleFieldCancel}
                        className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-900 dark:text-white font-medium">
                      {field.key === 'bloodGroup' ? profile.bloodGroup : profile[field.key as keyof UserProfile] as string}
                    </p>
                  )}
                </motion.div>
              ))}
              
              {/* Blood Group Special Field */}
              <motion.div 
                className="glass-morph rounded-xl p-4 border border-red-200/50 dark:border-red-800/50 hover:border-red-300/70 dark:hover:border-red-700/70 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <label className="text-sm font-medium text-red-800 dark:text-red-300">
                      Blood Group
                    </label>
                  </div>
                  {editingField !== 'bloodGroup' && (
                    <button
                      onClick={() => handleFieldEdit('bloodGroup', profile.bloodGroup)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {editingField === 'bloodGroup' ? (
                  <div className="flex items-center space-x-2">
                    <select
                      value={(tempValues as Partial<UserProfile>).bloodGroup || ''}
                      onChange={(e) => setTempValues({ ...tempValues, bloodGroup: e.target.value })}
                      className="flex-1 px-3 py-2 glass-morph border border-white/30 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 dark:text-white text-sm"
                      autoFocus
                    >
                      <option value="">Select Blood Group</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleFieldSave('bloodGroup')}
                      className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                    >
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </button>
                    <button
                      onClick={handleFieldCancel}
                      className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-red-900 dark:text-red-200">
                    {profile.bloodGroup}
                  </p>
                )}
              </motion.div>
            </div>
          </div>

          {/* Emergency Contacts with Real-time Editing */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Emergency Contacts
              </h3>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  Auto-fallback enabled
                </span>
                <motion.button
                  onClick={handleAddContact}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Contact</span>
                </motion.button>
              </div>
            </div>
            
            <AnimatePresence>
              <div className="space-y-3">
                {profile.emergencyContacts.map((contact) => (
                  <motion.div 
                    key={contact.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="glass-morph rounded-xl p-4 hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 border border-white/20 dark:border-gray-700/50"
                  >
                    {editingContact === contact.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="Contact Name"
                            value={tempValues.name || ''}
                            onChange={(e) => setTempValues({ ...tempValues, name: e.target.value })}
                            className="px-3 py-2 glass-morph border border-white/30 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white text-sm"
                          />
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={tempValues.phone || ''}
                            onChange={(e) => setTempValues({ ...tempValues, phone: e.target.value })}
                            className="px-3 py-2 glass-morph border border-white/30 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white text-sm"
                          />
                          <select
                            value={(tempValues as Partial<EmergencyContact>).relation || ''}
                            onChange={(e) => setTempValues({ ...tempValues, relation: e.target.value })}
                            className="px-3 py-2 glass-morph border border-white/30 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white text-sm"
                          >
                            {relationOptions.map(relation => (
                              <option key={relation} value={relation}>{relation}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleContactSave(contact.id)}
                            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={handleContactCancel}
                            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    ) : (
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
                            <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium mt-1">
                              {contact.relation}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleContactEdit(contact.id)}
                            className="p-2 glass-morph rounded-full hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-300"
                          >
                            <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button 
                            onClick={() => handleDeleteContact(contact.id)}
                            className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Enhanced Settings */}
        {settingsOptions.map((section, sectionIndex) => (
          <motion.div 
            key={sectionIndex} 
            className="glass-morph rounded-2xl slide-up-fade border border-white/20 dark:border-gray-700/50" 
            style={{ animationDelay: `${sectionIndex * 0.1}s` }}
            layout
          >
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {section.category}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {section.items.map((item, itemIndex) => (
                <motion.div 
                  key={itemIndex} 
                  className="glass-morph rounded-xl p-4 hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
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
                            checked={typeof item.value === "boolean" ? item.value : false}
                            onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-7 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-lg"></div>
                        </label>
                      ) : (
                        <select
                          value={typeof item.value === "string" ? item.value : ""}
                          onChange={(e) => handleSettingChange(item.key, e.target.value)}
                          className="glass-morph border border-white/30 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {item.options?.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedProfileSettings;