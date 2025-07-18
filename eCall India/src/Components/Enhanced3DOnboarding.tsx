import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Phone, ChevronRight, Check, Sparkles, Zap, Heart, Users } from 'lucide-react';

interface Enhanced3DOnboardingProps {
  onComplete: () => void;
}

const Enhanced3DOnboarding: React.FC<Enhanced3DOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const onboardingSteps = [
    {
      title: "Welcome to eCall India",
      subtitle: "Your Guardian Angel on Every Journey",
      icon: Shield,
      color: "text-blue-600",
      bgGradient: "from-blue-50 via-indigo-50 to-purple-50",
      description: "Advanced AI-powered crash detection that works silently in the background, ready to save your life when seconds matter most.",
      animation: "float",
      character: "guardian",
      illusion: "protective-shield"
    },
    {
      title: "Physics-Powered Detection",
      subtitle: "No Button Press Required",
      icon: Zap,
      color: "text-green-600",
      bgGradient: "from-green-50 via-emerald-50 to-teal-50",
      description: "Our intelligent system analyzes G-forces, speed changes, and impact sounds to detect crashes instantly - even when you can't reach your phone.",
      animation: "pulse",
      character: "scientist",
      illusion: "physics-waves"
    },
    {
      title: "Voice-Triggered Emergency",
      subtitle: "When You Can't Press, Just Scream",
      icon: Phone,
      color: "text-red-600",
      bgGradient: "from-red-50 via-pink-50 to-rose-50",
      description: "Advanced audio recognition listens for distress calls like 'HELP!' or 'ACCIDENT!' and automatically triggers emergency response.",
      animation: "bounce",
      character: "helper",
      illusion: "sound-waves"
    },
    {
      title: "Instant Emergency Network",
      subtitle: "3-Second Response Time",
      icon: Users,
      color: "text-purple-600",
      bgGradient: "from-purple-50 via-violet-50 to-indigo-50",
      description: "Simultaneously contacts 112, nearby hospitals, and your loved ones with your exact location and medical information.",
      animation: "spin",
      character: "network",
      illusion: "connection-web"
    },
    {
      title: "Always There for You",
      subtitle: "Your Digital Safety Companion",
      icon: Heart,
      color: "text-pink-600",
      bgGradient: "from-pink-50 via-rose-50 to-red-50",
      description: "More than an app - it's your personal emergency response team that never sleeps, ensuring you're never alone on the road.",
      animation: "heartbeat",
      character: "companion",
      illusion: "caring-aura"
    }
  ];

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep < onboardingSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setCurrentStep(onboardingSteps.length);
      }
      setIsAnimating(false);
    }, 300);
  };

  const get3DCharacter = (character: string) => {
    const characters = {
      guardian: (
        <div className="relative w-32 h-32 mx-auto">
          {/* 3D Guardian Character */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-2xl"
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
          >
            <div className="absolute inset-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Shield className="w-16 h-16 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </motion.div>
          {/* Protective Aura */}
          <motion.div
            className="absolute -inset-4 border-2 border-blue-300/50 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      ),
      scientist: (
        <div className="relative w-32 h-32 mx-auto">
          {/* 3D Scientist Character */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full shadow-2xl"
            animate={{ 
              rotateX: [0, 15, -15, 0],
              y: [-5, 5, -5]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Zap className="w-16 h-16 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </motion.div>
          {/* Physics Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </div>
      ),
      helper: (
        <div className="relative w-32 h-32 mx-auto">
          {/* 3D Helper Character */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-red-400 to-pink-600 rounded-full shadow-2xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity
            }}
          >
            <div className="absolute inset-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Phone className="w-16 h-16 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </motion.div>
          {/* Sound Waves */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-2 border-red-300/40 rounded-full"
              animate={{ 
                scale: [1, 2, 3],
                opacity: [0.6, 0.3, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6
              }}
            />
          ))}
        </div>
      ),
      network: (
        <div className="relative w-32 h-32 mx-auto">
          {/* 3D Network Character */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full shadow-2xl"
            animate={{ 
              rotateZ: [0, 360]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="absolute inset-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Users className="w-16 h-16 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </motion.div>
          {/* Connection Lines */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-8 bg-purple-400/60 rounded-full origin-bottom"
              style={{
                bottom: '50%',
                left: '50%',
                transformOrigin: 'bottom center',
                transform: `rotate(${i * 45}deg) translateX(-50%)`
              }}
              animate={{
                scaleY: [0.5, 1, 0.5],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      ),
      companion: (
        <div className="relative w-32 h-32 mx-auto">
          {/* 3D Companion Character */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-pink-400 to-red-500 rounded-full shadow-2xl"
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Heart className="w-16 h-16 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </motion.div>
          {/* Caring Aura */}
          <motion.div
            className="absolute -inset-2 bg-gradient-to-r from-pink-300/30 to-red-300/30 rounded-full blur-md"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity
            }}
          />
        </div>
      )
    };
    return characters[character as keyof typeof characters] || characters.guardian;
  };

  const getIllusionBackground = (illusion: string) => {
    const illusions = {
      "protective-shield": (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl"
            animate={{ scale: [1, 1.5, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-indigo-200/20 rounded-full blur-xl"
            animate={{ scale: [1.2, 0.8, 1.2], rotate: [360, 180, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>
      ),
      "physics-waves": (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-full h-1 bg-gradient-to-r from-transparent via-green-300/30 to-transparent"
              style={{ top: `${20 + i * 15}%` }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ 
                duration: 3 + i * 0.5, 
                repeat: Infinity,
                delay: i * 0.4
              }}
            />
          ))}
        </div>
      ),
      "sound-waves": (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 w-4 h-4 border-2 border-red-300/40 rounded-full"
              animate={{ 
                scale: [0, 4],
                opacity: [1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5
              }}
            />
          ))}
        </div>
      ),
      "connection-web": (
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full">
            {[...Array(6)].map((_, i) => (
              <motion.line
                key={i}
                x1="50%"
                y1="50%"
                x2={`${30 + Math.cos(i * 60 * Math.PI / 180) * 40}%`}
                y2={`${30 + Math.sin(i * 60 * Math.PI / 180) * 40}%`}
                stroke="rgba(147, 51, 234, 0.3)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 1, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </svg>
        </div>
      ),
      "caring-aura": (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-pink-300/40 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`
              }}
              animate={{
                y: [-20, -40, -20],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5
              }}
            />
          ))}
        </div>
      )
    };
    return illusions[illusion as keyof typeof illusions] || illusions["protective-shield"];
  };

  if (currentStep < onboardingSteps.length) {
    const step = onboardingSteps[currentStep];

    return (
      <div className={`min-h-screen bg-gradient-to-br ${step.bgGradient} flex items-center justify-center px-4 relative overflow-hidden`}>
        {/* Illusion Background */}
        {getIllusionBackground(step.illusion)}

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <motion.div 
          className={`max-w-md w-full relative z-10 transition-all duration-500 ${
            isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
          }`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-center mb-8">
            {/* 3D Character */}
            <motion.div
              className="mb-8"
              initial={{ scale: 0, rotateY: -180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ 
                duration: 1, 
                delay: 0.3,
                type: "spring",
                stiffness: 200
              }}
            >
              {get3DCharacter(step.character)}
            </motion.div>

            <motion.h1 
              className="text-4xl font-bold text-gray-900 mb-3 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {step.title}
            </motion.h1>
            
            <motion.h2 
              className="text-xl text-gray-700 mb-6 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {step.subtitle}
            </motion.h2>
            
            <motion.p 
              className="text-gray-600 leading-relaxed px-4 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {step.description}
            </motion.p>
          </div>

          {/* Enhanced Progress Indicators */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-3">
              {onboardingSteps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-3 rounded-full transition-all duration-500 ${
                    index === currentStep 
                      ? 'w-12 bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg' 
                      : index < currentStep
                      ? 'w-3 bg-green-500 shadow-md'
                      : 'w-3 bg-gray-300'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  animate={index === currentStep ? { 
                    boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0.4)', '0 0 0 10px rgba(59, 130, 246, 0)']
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              ))}
            </div>
          </div>

          {/* Enhanced Action Button */}
          <motion.button
            onClick={handleNext}
            className="w-full bg-white/30 backdrop-blur-lg border-2 border-white/40 text-gray-900 py-4 rounded-2xl font-bold text-lg hover:bg-white/40 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center justify-center group relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Button Background Animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <span className="mr-3 relative z-10">
              {currentStep === onboardingSteps.length - 1 ? 'Start Your Journey' : 'Continue'}
            </span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
            <Sparkles className="w-5 h-5 ml-2 opacity-60 animate-pulse relative z-10" />
          </motion.button>

          <motion.button
            onClick={onComplete}
            className="w-full text-gray-600 py-3 mt-4 text-sm hover:text-gray-800 transition-colors backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
          >
            Skip Introduction
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Authentication screens with enhanced styling
  if (currentStep === onboardingSteps.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl"
            animate={{ scale: [1.2, 0.8, 1.2], rotate: [360, 180, 0] }}
            transition={{ duration: 25, repeat: Infinity }}
          />
        </div>

        <motion.div 
          className="max-w-md w-full relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8">
            <div className="text-center mb-8">
              {/* 3D Phone Icon */}
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
                animate={{ 
                  rotateY: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotateY: { duration: 4, repeat: Infinity },
                  scale: { duration: 2, repeat: Infinity }
                }}
              >
                <Phone className="w-10 h-10 text-white" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Enter Your Phone Number</h2>
              <p className="text-gray-700">We'll send you a verification code for security</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (phoneNumber.length === 10) setCurrentStep(onboardingSteps.length + 1);
            }}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Phone Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-white/30 bg-white/10 backdrop-blur-sm text-gray-700 text-sm font-medium">
                    +91
                  </span>
                  <motion.input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 px-4 py-3 border border-white/30 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white/10 backdrop-blur-sm placeholder-gray-500"
                    placeholder="98765 43210"
                    maxLength={10}
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={phoneNumber.length !== 10}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Send OTP</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // OTP and Name screens with similar enhanced styling...
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <motion.div 
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8">
          <div className="text-center mb-8">
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Almost Done!</h2>
            <p className="text-gray-700">Complete your emergency profile</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) onComplete();
          }}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Full Name
              </label>
              <motion.input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white/10 backdrop-blur-sm placeholder-gray-500"
                placeholder="Enter your full name"
                required
                whileFocus={{ scale: 1.02 }}
              />
            </div>

            <motion.button
              type="submit"
              disabled={!name.trim()}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Complete Setup
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Enhanced3DOnboarding;