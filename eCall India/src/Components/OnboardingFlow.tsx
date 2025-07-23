import React, { useState } from 'react';
import { Shield, MapPin, Phone, MessageSquare, ChevronRight, Check } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');

  const onboardingSteps = [
    {
      title: "Welcome to JeevSanket",
      subtitle: "From Crash to Care - In One Signal!",
      icon: Shield,
      color: "text-blue-600",
      description: "Your safety companion that works on any smartphone - no expensive devices needed."
    },
    {
      title: "Instant Crash Detection",
      subtitle: "Smart Technology That Saves Lives",
      icon: MapPin,
      color: "text-green-600",
      description: "Automatically detects accidents and sends your location to emergency services."
    },
    {
      title: "Emergency Network",
      subtitle: "Connect with Help Instantly",
      icon: Phone,
      color: "text-red-600",
      description: "Auto-contact nearby hospitals, emergency services, and your loved ones."
    },
    {
      title: "Multi-Channel Alerts",
      subtitle: "Every Second Counts",
      icon: MessageSquare,
      color: "text-yellow-600",
      description: "Send emergency messages via SMS, WhatsApp, and email simultaneously."
    }
  ];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(onboardingSteps.length); // Move to phone input
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length === 10) {
      setCurrentStep(onboardingSteps.length + 1); // Move to OTP
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      setCurrentStep(onboardingSteps.length + 2); // Move to name input
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete();
    }
  };

  if (currentStep < onboardingSteps.length) {
    const step = onboardingSteps[currentStep];
    const Icon = step.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg mb-6 ${step.color}`}>
              <Icon className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{step.title}</h1>
            <h2 className="text-lg text-gray-600 mb-4">{step.subtitle}</h2>
            <p className="text-gray-500 leading-relaxed">{step.description}</p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center"
          >
            {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>

          <button
            onClick={onComplete}
            className="w-full text-gray-500 py-2 mt-4 text-sm hover:text-gray-700 transition-colors"
          >
            Skip Introduction
          </button>
        </div>
      </div>
    );
  }

  // Phone Number Input
  if (currentStep === onboardingSteps.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Your Phone Number</h2>
            <p className="text-gray-600">We'll send you a verification code</p>
          </div>

          <form onSubmit={handlePhoneSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="98765 43210"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={phoneNumber.length !== 10}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Send OTP
            </button>
          </form>
        </div>
      </div>
    );
  }

  // OTP Verification
  if (currentStep === onboardingSteps.length + 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Number</h2>
            <p className="text-gray-600">Enter the 6-digit code sent to +91 {phoneNumber}</p>
          </div>

          <form onSubmit={handleOtpSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-center tracking-widest"
                placeholder="123456"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={otp.length !== 6}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Verify
            </button>
          </form>

          <button className="w-full text-blue-600 py-2 mt-4 text-sm hover:text-blue-700 transition-colors">
            Resend Code
          </button>
        </div>
      </div>
    );
  }

  // Name Input
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-6">
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
          <p className="text-gray-600">This helps us personalize your emergency contacts</p>
        </div>

        <form onSubmit={handleNameSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="Enter your full name"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Complete Setup
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingFlow;