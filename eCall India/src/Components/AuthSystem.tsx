import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Shield, Check, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface EmergencyContact {
  name: string;
  phone: string;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  emergencyContacts: EmergencyContact[];
}

interface AuthSystemProps {
  onAuthComplete: (userData: UserData) => void;
}

const AuthSystem: React.FC<AuthSystemProps> = ({ onAuthComplete }) => {
  const [authStep, setAuthStep] = useState<'signin' | 'signup' | 'otp' | 'profile'>('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    name: '',
    otp: '',
    showPassword: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    // Simulate Google auth
    setTimeout(() => {
      setIsLoading(false);
      setAuthStep('profile');
    }, 2000);
  };

  const handleEmailAuth = async (type: 'signin' | 'signup') => {
    setIsLoading(true);
    // Simulate email auth
    setTimeout(() => {
      setIsLoading(false);
      if (type === 'signup') {
        setAuthStep('otp');
      } else {
        setAuthStep('profile');
      }
    }, 1500);
  };

  const handleOtpVerification = () => {
    if (formData.otp.length === 6) {
      setAuthStep('profile');
    }
  };

  const handleProfileComplete = () => {
    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      emergencyContacts: []
    };
    onAuthComplete(userData);
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
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 glass-morph border border-white/30 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500"
                    />
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

        {authStep === 'otp' && (
          <motion.div
            key="otp"
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
                  className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Verify Phone
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter the 6-digit code sent to {formData.phone}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div variants={inputVariants} whileFocus="focus" whileTap="blur">
                  <input
                    type="text"
                    placeholder="000000"
                    value={formData.otp}
                    onChange={(e) => setFormData({...formData, otp: e.target.value})}
                    maxLength={6}
                    className="w-full px-4 py-3 glass-morph border border-white/30 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 text-center text-2xl tracking-widest"
                  />
                </motion.div>

                <motion.button
                  onClick={handleOtpVerification}
                  disabled={formData.otp.length !== 6}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <span>Verify</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                <button className="w-full text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  Resend code
                </button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {authStep === 'profile' && (
          <motion.div
            key="profile"
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
                  <Shield className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Almost Done!
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete your emergency profile
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Your account has been created successfully. You can now set up emergency contacts and preferences in the app.
                  </p>
                </div>

                <motion.button
                  onClick={handleProfileComplete}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Continue to App</span>
                  <ArrowRight className="w-4 h-4" />
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