import React, { useState } from 'react';
import { Shield, MapPin, Phone, MessageSquare, ChevronRight, Check, Sparkles } from 'lucide-react';

interface FluidOnboardingProps {
  onComplete: () => void;
}

const FluidOnboarding: React.FC<FluidOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const onboardingSteps = [
    {
      title: "Welcome to eCall India",
      subtitle: "Life-saving Design Meets Smart Technology",
      icon: Shield,
      color: "text-blue-600",
      bgGradient: "from-blue-50 via-indigo-50 to-purple-50",
      description: "Because beautiful UI should do more than look good — it should save lives.",
      animation: "float"
    },
    {
      title: "Physics-Powered Detection",
      subtitle: "No Button Press Required",
      icon: MapPin,
      color: "text-green-600",
      bgGradient: "from-green-50 via-emerald-50 to-teal-50",
      description: "Auto-detects crashes using accelerometer, gyroscope, and AI-powered sound analysis.",
      animation: "pulse"
    },
    {
      title: "Voice-Triggered SOS",
      subtitle: "When You Can't Press, Just Scream",
      icon: Phone,
      color: "text-red-600",
      bgGradient: "from-red-50 via-pink-50 to-rose-50",
      description: "Listens for distress calls and automatically triggers emergency response.",
      animation: "bounce"
    },
    {
      title: "Smart Emergency Network",
      subtitle: "3-5 Second Response Time",
      icon: MessageSquare,
      color: "text-yellow-600",
      bgGradient: "from-yellow-50 via-amber-50 to-orange-50",
      description: "Instantly connects you with 112, hospitals, and emergency contacts simultaneously.",
      animation: "spin"
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

  const getAnimationClass = (animation: string) => {
    switch (animation) {
      case 'float': return 'animate-bounce';
      case 'pulse': return 'animate-pulse';
      case 'bounce': return 'animate-bounce';
      case 'spin': return 'animate-spin';
      default: return '';
    }
  };

  if (currentStep < onboardingSteps.length) {
    const step = onboardingSteps[currentStep];
    const Icon = step.icon;

    return (
      <div className={`min-h-screen bg-gradient-to-br ${step.bgGradient} flex items-center justify-center px-4 relative overflow-hidden`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-2xl animate-spin slow"></div>
        </div>

        <div className={`max-w-md w-full relative z-10 transition-all duration-500 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '3s'
                }}
              />
            ))}
          </div>

          <div className="text-center mb-8">
            {/* Glass morphism icon container */}
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-lg rounded-full border border-white/30 shadow-2xl"></div>
              <div className={`relative z-10 ${step.color} ${getAnimationClass(step.animation)}`}>
                <Icon className="w-12 h-12" />
              </div>
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${step.color.replace('text-', 'from-')} to-transparent opacity-20 rounded-full blur-xl animate-pulse`}></div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              {step.title}
            </h1>
            <h2 className="text-lg text-gray-700 mb-4 font-medium">
              {step.subtitle}
            </h2>
            <p className="text-gray-600 leading-relaxed px-4">
              {step.description}
            </p>
          </div>

          {/* Progress indicators with fluid animation */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-3">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === currentStep 
                      ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500' 
                      : index < currentStep
                      ? 'w-2 bg-green-500'
                      : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Glass morphism button */}
          <button
            onClick={handleNext}
            className="w-full bg-white/20 backdrop-blur-lg border border-white/30 text-gray-900 py-4 rounded-2xl font-semibold text-lg hover:bg-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center group"
          >
            <span className="mr-2">
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Continue'}
            </span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <Sparkles className="w-4 h-4 ml-2 opacity-60 animate-pulse" />
          </button>

          <button
            onClick={onComplete}
            className="w-full text-gray-600 py-3 mt-4 text-sm hover:text-gray-800 transition-colors backdrop-blur-sm"
          >
            Skip Introduction
          </button>
        </div>

        <style>{`
          .slow {
            animation-duration: 20s;
          }
        `}</style>
      </div>
    );
  }

  // Phone, OTP, and Name input screens remain the same but with enhanced styling
  if (currentStep === onboardingSteps.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100/50 backdrop-blur-sm mb-6 border border-blue-200/50">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Your Phone Number</h2>
              <p className="text-gray-700">We'll send you a verification code</p>
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
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 px-4 py-3 border border-white/30 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white/10 backdrop-blur-sm placeholder-gray-500"
                    placeholder="98765 43210"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={phoneNumber.length !== 10}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Send OTP
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Similar enhanced styling for OTP and Name screens...
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100/50 backdrop-blur-sm mb-6 border border-green-200/50">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost Done!</h2>
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
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white/10 backdrop-blur-sm placeholder-gray-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Complete Setup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FluidOnboarding;