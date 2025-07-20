import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Shield, Check, ArrowRight, Eye, EyeOff, Car, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface UserData {
  name: string;
  email: string;
  vehicleModel: string;
  vehicleNumber: string;
  country?: string;
  state?: string;
  bloodGroup?: string;
  emergencyContacts: {
    name: string;
    phone: string;
    relation: string;
  }[];
}

interface AuthSystemProps {
  onAuthComplete: (userData: UserData) => void;
}

const AuthSystem: React.FC<AuthSystemProps> = ({ onAuthComplete }) => {
  const [authStep, setAuthStep] = useState<'signin' | 'signup' | 'vehicle-details' | 'emergency-contacts'>('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    showPassword: false,
    vehicleModel: '',
    vehicleNumber: '',
    country: 'India',
    state: '',
    bloodGroup: '',
    emergencyContacts: [
      { name: '', phone: '', relation: 'Family' }
    ]
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    // Simulate Google auth
    setTimeout(() => {
      setIsLoading(false);
      setAuthStep('vehicle-details');
    }, 2000);
  };

  const handleEmailAuth = async (type: 'signin' | 'signup') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (type === 'signup') {
        setAuthStep('vehicle-details');
      } else {
        // Existing user - complete profile
        const userData = {
          name: formData.name || 'User',
          email: formData.email,
          vehicleModel: 'Honda City',
          vehicleNumber: 'DL 01 AB 1234',
          emergencyContacts: [
            { name: 'Family Contact', phone: '+91 98765 43210', relation: 'Family' }
          ]
        };
        onAuthComplete(userData);
      }
    }, 1500);
  };

  const handleVehicleDetailsSubmit = () => {
    setAuthStep('emergency-contacts');
  };

  const handleEmergencyContactsSubmit = () => {
    const userData = {
      name: formData.name,
      email: formData.email,
      vehicleModel: formData.vehicleModel,
      vehicleNumber: formData.vehicleNumber,
      country: formData.country,
      state: formData.state,
      bloodGroup: formData.bloodGroup,
      emergencyContacts: formData.emergencyContacts
    };
    onAuthComplete(userData);
  };

  const addEmergencyContact = () => {
    setFormData({
      ...formData,
      emergencyContacts: [...formData.emergencyContacts, { name: '', phone: '', relation: 'Family' }]
    });
  };

  const updateEmergencyContact = (index: number, field: string, value: string) => {
    const updatedContacts = formData.emergencyContacts.map((contact, i) => 
      i === index ? { ...contact, [field]: value } : contact
    );
    setFormData({ ...formData, emergencyContacts: updatedContacts });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {authStep === 'signin' && (
          <motion.div
            key="signin"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md"
          >
            <Card className="glass-morph border-white/20 dark:border-gray-700/50">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Shield className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome Back
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  Sign in to your emergency profile
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div variants={inputVariants} whileFocus="focus" whileTap="blur">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 glass-morph border border-white/30 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500"
                    />
                  </div>
                </motion.div>

                <motion.div variants={inputVariants} whileFocus="focus" whileTap="blur">
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={formData.showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-10 pr-12 py-3 glass-morph border border-white/30 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, showPassword: !formData.showPassword})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {formData.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                <motion.button
                  onClick={() => handleEmailAuth('signin')}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white/50 dark:bg-gray-800/50 text-gray-500">or</span>
                  </div>
                </div>

                <motion.button
                  onClick={handleGoogleAuth}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full glass-morph border border-white/30 dark:border-gray-600 py-3 rounded-xl font-semibold hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <div className="w-5 h-5 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full" />
                  <span className="text-gray-900 dark:text-white">Continue with Google</span>
                </motion.button>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setAuthStep('signup')}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {authStep === 'signup' && (
          <motion.div
            key="signup"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md"
          >
            <Card className="glass-morph border-white/20 dark:border-gray-700/50">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <User className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Create Account
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  Join eCall India for emergency protection
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div variants={inputVariants} whileFocus="focus" whileTap="blur">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 glass-morph border border-white/30 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500"
                    />
                  </div>
                </motion.div>

                <motion.div variants={inputVariants} whileFocus="focus" whileTap="blur">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 glass-morph border border-white/30 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500"
                    />
                  </div>
                </motion.div>

                <motion.div variants={inputVariants} whileFocus="focus" whileTap="blur">
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={formData.showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-10 pr-12 py-3 glass-morph border border-white/30 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, showPassword: !formData.showPassword})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {formData.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                <motion.button
                  onClick={() => handleEmailAuth('signup')}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <button
                    onClick={() => setAuthStep('signin')}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {authStep === 'vehicle-details' && (
          <motion.div
            key="vehicle-details"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md"
          >
            <Card className="glass-morph border-white/20 dark:border-gray-700/50">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Car className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Vehicle Details
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  Help us protect you better
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div variants={inputVariants} whileFocus="focus" whileTap="blur">
                  <input
                    type="text"
                    placeholder="Vehicle Model (e.g., Honda City)"
                    value={formData.vehicleModel}
                    onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})}
                    className="w-full px-4 py-3 glass-morph border border-white/30 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </motion.div>

                <motion.div variants={inputVariants} whileFocus="focus" whileTap="blur">
                  <input
                    type="text"
                    placeholder="Vehicle Number (e.g., DL 01 AB 1234)"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                    className="w-full px-4 py-3 glass-morph border border-white/30 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </motion.div>

                <div className="grid grid-cols-2 gap-3">
                  <motion.div variants={inputVariants} whileFocus="focus" whileTap="blur">
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="w-full px-4 py-3 glass-morph border border-white/30 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    >
                      <option value="India">India</option>
                    </select>
                  </motion.div>

                  <motion.div variants={inputVariants} whileFocus="focus" whileTap="blur">
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="w-full px-4 py-3 glass-morph border border-white/30 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    >
                      <option value="">Select State</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Gujarat">Gujarat</option>
                    </select>
                  </motion.div>
                </div>

                <motion.div variants={inputVariants} whileFocus="focus" whileTap="blur">
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                    className="w-full px-4 py-3 glass-morph border border-white/30 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                  >
                    <option value="">Blood Group (Optional)</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </motion.div>

                <motion.button
                  onClick={handleVehicleDetailsSubmit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {authStep === 'emergency-contacts' && (
          <motion.div
            key="emergency-contacts"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md"
          >
            <Card className="glass-morph border-white/20 dark:border-gray-700/50">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Users className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Emergency Contacts
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  Who should we contact in an emergency?
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.emergencyContacts.map((contact, index) => (
                  <div key={index} className="space-y-3 p-4 glass-morph rounded-lg border border-white/20">
                    <motion.div variants={inputVariants} whileFocus="focus" whileTap="blur">
                      <input
                        type="text"
                        placeholder="Contact Name"
                        value={contact.name}
                        onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                        className="w-full px-4 py-3 glass-morph border border-white/30 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500"
                      />
                    </motion.div>

                    <motion.div variants={inputVariants} whileFocus="focus" whileTap="blur">
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={contact.phone}
                        onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
                        className="w-full px-4 py-3 glass-morph border border-white/30 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500"
                      />
                    </motion.div>

                    <motion.div variants={inputVariants} whileFocus="focus" whileTap="blur">
                      <select
                        value={contact.relation}
                        onChange={(e) => updateEmergencyContact(index, 'relation', e.target.value)}
                        className="w-full px-4 py-3 glass-morph border border-white/30 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                      >
                        <option value="Family">Family</option>
                        <option value="Friend">Friend</option>
                        <option value="Doctor">Doctor</option>
                        <option value="Colleague">Colleague</option>
                        <option value="Other">Other</option>
                      </select>
                    </motion.div>
                  </div>
                ))}

                <motion.button
                  onClick={addEmergencyContact}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full glass-morph border border-white/30 dark:border-gray-600 py-3 rounded-xl font-semibold hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-300 text-gray-900 dark:text-white"
                >
                  + Add Another Contact
                </motion.button>

                <motion.button
                  onClick={handleEmergencyContactsSubmit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Complete Setup</span>
                  <Check className="w-4 h-4" />
                </motion.button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthSystem;