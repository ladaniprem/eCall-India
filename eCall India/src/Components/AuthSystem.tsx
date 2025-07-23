import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Shield, Check, ArrowRight, Eye, EyeOff, Car, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// Update the import path to the correct firebase file location
// Update the import path to the correct firebase file location
import { signInWithGooglePopup, createAuthUserWithEmailAndPassword, signInAuthUserWithEmailAndPassword } from '../lib/firebase'; // Adjust path as needed

interface UserData {
  name: string;
  email: string;
  vehicleModel: string;
  vehicleNumber: string;
  country?: string;
  state?: string;
  bloodGroup?: string;
  medicalConditions?: string;
  insuranceNumber?: string;
  emergencyContacts: Array<{ name: string; phone: string; relation: string }>;
  profileComplete?: boolean;
}

interface AuthSystemProps {
  onAuthComplete: (userData: UserData) => void;
}

const AuthSystem: React.FC<AuthSystemProps> = ({ onAuthComplete }) => {
  const [authStep, setAuthStep] = useState<'signin' | 'signup' | 'vehicle-details' | 'emergency-contacts' | 'profile-complete'>('signin');
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
    medicalConditions: '',
    insuranceNumber: '',
    emergencyContacts: [
      { name: '', phone: '', relation: 'Family' }
    ]
  });
  const [isLoading, setIsLoading] = useState(false);
  // Removed unused setIsReturningUser state
  const [authError, setAuthError] = useState('');

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setAuthError('');
    
    try {
      const result = await signInWithGooglePopup();
      const user = result.user;
      
      setIsLoading(false);
      
      const userData: UserData = {
        name: user.displayName || 'Google User',
        email: user.email || '',
        vehicleModel: '', // Default empty
        vehicleNumber: '', // Default empty
        bloodGroup: '', // Default empty
        medicalConditions: '', // Default empty
        insuranceNumber: '', // Default empty
        emergencyContacts: [], // Default empty array
        profileComplete: false // Assume profile is not complete until all details are filled
      };
      onAuthComplete(userData);
      // If the user's profile is not complete, you might want to redirect them to complete it.
      // For now, we're calling onAuthComplete directly with default values.
      // setAuthStep('vehicle-details'); // Uncomment this line if you want to force profile completion after Google sign-in
    } catch (error: unknown) {
      setIsLoading(false);
      if (error instanceof Error) {
        setAuthError(error.message || 'Failed to sign in with Google');
        console.error('Google auth error:', error);
      } else {
        setAuthError('Failed to sign in with Google');
        console.error('Google auth error:', error);
      }
    }
  };

  const handleEmailAuth = async (type: 'signin' | 'signup') => {
    setIsLoading(true);
    setAuthError('');
    
    try {
      let result;
      
      if (type === 'signup') {
        result = await createAuthUserWithEmailAndPassword(formData.email, formData.password);
      } else {
        result = await signInAuthUserWithEmailAndPassword(formData.email, formData.password);
      }
      
      setIsLoading(false);
      
      if (type === 'signup') {
        setAuthStep('vehicle-details');
      } else {
        const userData: UserData = {
          name: result?.user?.displayName || formData.name || 'User',
          email: result?.user?.email || formData.email,
          vehicleModel: '', // Default empty, should be fetched from user profile or completed later
          vehicleNumber: '', // Default empty, should be fetched from user profile or completed later
          bloodGroup: '', // Default empty
          medicalConditions: '', // Default empty
          insuranceNumber: '', // Default empty
          emergencyContacts: [], // Default empty array, should be fetched from user profile or completed later
          profileComplete: false // Assume profile is not complete until all details are filled
        };
        onAuthComplete(userData);
      }
    } catch (error: unknown) {
      setIsLoading(false);
      if (error instanceof Error) {
        setAuthError(error.message || 'Authentication failed');
        console.error('Email auth error:', error);
      } else {
        setAuthError('Authentication failed');
        console.error('Email auth error:', error);
      }
    }
  };

  const handleVehicleDetailsSubmit = () => {
    if (!formData.vehicleModel || !formData.vehicleNumber || !formData.state) {
      alert('Please fill in all required vehicle details');
      return;
    }
    setAuthStep('emergency-contacts');
  };

  const handleEmergencyContactsSubmit = () => {
    // Validate emergency contacts
    const validContacts = formData.emergencyContacts.filter(
      contact => contact.name.trim() && contact.phone.trim()
    );
    
    if (validContacts.length === 0) {
      alert('Please add at least one emergency contact');
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      vehicleModel: formData.vehicleModel,
      vehicleNumber: formData.vehicleNumber,
      country: formData.country,
      state: formData.state,
      bloodGroup: formData.bloodGroup,
      medicalConditions: formData.medicalConditions,
      insuranceNumber: formData.insuranceNumber,
      emergencyContacts: validContacts,
      profileComplete: true
    };
    
    // Show completion step before redirecting
    setAuthStep('profile-complete');
    
    // Auto-redirect to dashboard after showing success
    setTimeout(() => {
      onAuthComplete(userData);
    }, 2000);
  };

  const addEmergencyContact = () => {
    if (formData.emergencyContacts.length >= 5) {
      alert('Maximum 5 emergency contacts allowed');
      return;
    }
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
      transition: { duration: 0.6, ease: "easeInOut" } // Use valid framer-motion easing string
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large floating glass orbs */}
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl backdrop-blur-sm"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl backdrop-blur-sm"
          animate={{ 
            scale: [1.2, 0.8, 1.2],
            rotate: [360, 180, 0],
            x: [0, -40, 0],
            y: [0, 20, 0]
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        {/* Medium floating elements */}
        <motion.div 
          className="absolute top-1/4 left-1/3 w-32 h-32 bg-gradient-to-br from-indigo-300/15 to-blue-300/15 rounded-full blur-2xl backdrop-blur-sm"
          animate={{ 
            scale: [1, 1.4, 1],
            x: [0, 60, 0],
            y: [0, -40, 0]
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-tl from-cyan-300/15 to-teal-300/15 rounded-full blur-xl backdrop-blur-sm"
          animate={{ 
            scale: [1.1, 0.9, 1.1],
            x: [0, -50, 0],
            y: [0, 30, 0]
          }}
          transition={{ 
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
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
            <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/10 border border-white/30 dark:border-gray-700/30 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg backdrop-blur-sm"
                >
                  <Shield className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome Back
                </CardTitle>
                <p className="text-gray-700 dark:text-gray-300">
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
                      className="w-full pl-10 pr-4 py-3 backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/40 dark:border-gray-600/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 transition-all duration-300"
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
                      className="w-full pl-10 pr-12 py-3 backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/40 dark:border-gray-600/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, showPassword: !formData.showPassword})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      {formData.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                {authError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-100/80 dark:bg-red-900/30 border border-red-300/50 dark:border-red-700/50 rounded-xl text-red-700 dark:text-red-300 text-sm backdrop-blur-sm"
                  >
                    {authError}
                  </motion.div>
                )}

                <motion.button
                  onClick={() => handleEmailAuth('signin')}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg backdrop-blur-sm"
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
                    <div className="w-full border-t border-white/30 dark:border-gray-600/50" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 py-1 backdrop-blur-md bg-white/20 dark:bg-gray-800/20 text-gray-600 dark:text-gray-400 rounded-full border border-white/30 dark:border-gray-600/30">or</span>
                  </div>
                </div>

                <motion.button
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/40 dark:border-gray-600/40 py-3 rounded-xl font-semibold hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin" />
                  ) : (
                    <>
                      {/* Google Logo SVG */}
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-gray-900 dark:text-white">Continue with Google</span>
                    </>
                  )}
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
            <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/10 border border-white/30 dark:border-gray-700/30 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg backdrop-blur-sm"
                >
                  <User className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Create Account
                </CardTitle>
                <p className="text-gray-700 dark:text-gray-300">
                  Join JeevSanket for emergency protection
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
                      className="w-full pl-10 pr-4 py-3 backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/40 dark:border-gray-600/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 transition-all duration-300"
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
                      className="w-full pl-10 pr-4 py-3 backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/40 dark:border-gray-600/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 transition-all duration-300"
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
                      className="w-full pl-10 pr-12 py-3 backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/40 dark:border-gray-600/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, showPassword: !formData.showPassword})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      {formData.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                {authError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-100/80 dark:bg-red-900/30 border border-red-300/50 dark:border-red-700/50 rounded-xl text-red-700 dark:text-red-300 text-sm backdrop-blur-sm"
                  >
                    {authError}
                  </motion.div>
                )}

                <motion.button
                  onClick={() => handleEmailAuth('signup')}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg backdrop-blur-sm"
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
            <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/10 border border-white/30 dark:border-gray-700/30 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg backdrop-blur-sm"
                >
                  <Car className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Vehicle Details
                </CardTitle>
                <p className="text-gray-700 dark:text-gray-300">
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
                    className="w-full px-4 py-3 backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/40 dark:border-gray-600/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 transition-all duration-300"
                  />
                </motion.div>

                <motion.div variants={inputVariants} whileFocus="focus" whileTap="blur">
                  <input
                    type="text"
                    placeholder="Vehicle Number (e.g., DL 01 AB 1234)"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                    className="w-full px-4 py-3 backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/40 dark:border-gray-600/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 transition-all duration-300"
                  />
                </motion.div>

                <div className="grid grid-cols-2 gap-3">
                  <motion.div variants={inputVariants} whileFocus="focus" whileTap="blur">
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="w-full px-4 py-3 backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/40 dark:border-gray-600/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-gray-900 dark:text-white transition-all duration-300"
                    >
                      <option value="India">India</option>
                    </select>
                  </motion.div>

                  <motion.div variants={inputVariants} whileFocus="focus" whileTap="blur">
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="w-full px-4 py-3 backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/40 dark:border-gray-600/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-gray-900 dark:text-white transition-all duration-300"
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
                    className="w-full px-4 py-3 backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/40 dark:border-gray-600/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-gray-900 dark:text-white transition-all duration-300"
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
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg backdrop-blur-sm"
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
            <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/10 border border-white/30 dark:border-gray-700/30 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg backdrop-blur-sm"
                >
                  <Users className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Emergency Contacts
                </CardTitle>
                <p className="text-gray-700 dark:text-gray-300">
                  Who should we contact in an emergency?
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.emergencyContacts.map((contact, index) => (
                  <div key={index} className="space-y-3 p-4 backdrop-blur-md bg-white/20 dark:bg-gray-800/20 rounded-lg border border-white/30 dark:border-gray-600/30">
                    <motion.div variants={inputVariants} whileFocus="focus" whileTap="blur">
                      <input
                        type="text"
                        placeholder="Contact Name"
                        value={contact.name}
                        onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                        className="w-full px-4 py-3 backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/40 dark:border-gray-600/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 transition-all duration-300"
                      />
                    </motion.div>

                    <motion.div variants={inputVariants} whileFocus="focus" whileTap="blur">
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={contact.phone}
                        onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
                        className="w-full px-4 py-3 backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/40 dark:border-gray-600/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 transition-all duration-300"
                      />
                    </motion.div>

                    <motion.div variants={inputVariants} whileFocus="focus" whileTap="blur">
                      <select
                        value={contact.relation}
                        onChange={(e) => updateEmergencyContact(index, 'relation', e.target.value)}
                        className="w-full px-4 py-3 backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/40 dark:border-gray-600/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-gray-900 dark:text-white transition-all duration-300"
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
                  className="w-full backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/40 dark:border-gray-600/40 py-3 rounded-xl font-semibold hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 text-gray-900 dark:text-white shadow-lg"
                >
                  + Add Another Contact
                </motion.button>

                <motion.button
                  onClick={handleEmergencyContactsSubmit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg backdrop-blur-sm"
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