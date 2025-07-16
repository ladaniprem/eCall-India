import React, { useState, useEffect } from 'react';
import { Shield, Zap, AlertTriangle } from 'lucide-react';

interface FuturisticSOSProps {
  onEmergency: () => void;
  crashSeverity?: 'low' | 'medium' | 'high' | null;
  isEmergencyMode?: boolean;
}

const FuturisticSOS: React.FC<FuturisticSOSProps> = ({ 
  onEmergency, 
  crashSeverity = null,
  isEmergencyMode = false 
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; timestamp: number }>>([]);
  const [autoCallCountdown, setAutoCallCountdown] = useState<number | null>(null);
  const [glowIntensity, setGlowIntensity] = useState(1);

  // Auto-call countdown for high severity crashes
  useEffect(() => {
    if (crashSeverity === 'high') {
      setAutoCallCountdown(5);
      const interval = setInterval(() => {
        setAutoCallCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            onEmergency();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [crashSeverity, onEmergency]);

  // Dynamic glow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => prev === 1 ? 1.5 : 1);
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);

  // Continuous ripple effect for emergency mode
  useEffect(() => {
    if (isEmergencyMode || crashSeverity) {
      const interval = setInterval(() => {
        const newRipple = { id: Date.now(), timestamp: Date.now() };
        setRipples(prev => [...prev, newRipple]);
        
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
        }, 3000);
      }, 600);
      
      return () => clearInterval(interval);
    }
  }, [isEmergencyMode, crashSeverity]);

  const handlePress = () => {
    setIsPressed(true);
    const newRipple = { id: Date.now(), timestamp: Date.now() };
    setRipples(prev => [...prev, newRipple]);
    
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    
    setTimeout(() => {
      setIsPressed(false);
      onEmergency();
    }, 300);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 3000);
  };

  const getSeverityConfig = () => {
    switch (crashSeverity) {
      case 'high':
        return {
          gradient: 'from-red-600 via-red-700 to-red-800',
          glowColor: 'shadow-red-500/80',
          ringColor: 'border-red-400',
          icon: AlertTriangle,
          label: 'CRITICAL'
        };
      case 'medium':
        return {
          gradient: 'from-yellow-500 via-orange-600 to-red-600',
          glowColor: 'shadow-yellow-500/80',
          ringColor: 'border-yellow-400',
          icon: Zap,
          label: 'MODERATE'
        };
      case 'low':
        return {
          gradient: 'from-yellow-400 via-yellow-500 to-orange-500',
          glowColor: 'shadow-yellow-500/60',
          ringColor: 'border-yellow-400',
          icon: Zap,
          label: 'MINOR'
        };
      default:
        return {
          gradient: 'from-red-600 via-red-700 to-red-800',
          glowColor: 'shadow-red-500/60',
          ringColor: 'border-red-400',
          icon: Shield,
          label: 'SOS'
        };
    }
  };

  const config = getSeverityConfig();
  const Icon = config.icon;

  return (
    <div className="relative flex items-center justify-center">
      {/* Floating Particles */}
      {(isEmergencyMode || crashSeverity) && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-red-400 rounded-full floating-particles"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Ripple Effects */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className={`absolute inset-0 rounded-full border-4 ${config.ringColor} animate-ping opacity-75`}
          style={{
            animation: 'ripple 3s cubic-bezier(0, 0, 0.2, 1) infinite'
          }}
        />
      ))}
      
      {/* Auto-call countdown overlay */}
      {autoCallCountdown !== null && (
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 glass-morph px-6 py-3 rounded-2xl shadow-2xl z-20 border border-red-500/50">
          <div className="text-center">
            <p className="text-sm font-bold text-red-600 dark:text-red-400 mb-1">
              AUTO-CALLING 112
            </p>
            <div className="text-3xl font-bold text-red-700 dark:text-red-300 tabular-nums">
              {autoCallCountdown}
            </div>
            <div className="w-12 h-1 bg-red-200 dark:bg-red-800 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-red-600 rounded-full transition-all duration-1000"
                style={{ width: `${((5 - autoCallCountdown) / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Outer Glow Ring */}
      <div 
        className={`absolute inset-0 rounded-full ${config.glowColor} blur-xl`}
        style={{
          transform: `scale(${glowIntensity})`,
          transition: 'transform 1.5s ease-in-out'
        }}
      />

      {/* Main SOS Button */}
      <button
        onClick={handlePress}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        className={`
          relative w-40 h-40 rounded-full shadow-2xl transition-all duration-300 transform
          ${isPressed ? 'scale-90' : 'scale-100'}
          ${isEmergencyMode || crashSeverity ? 'animate-pulse' : ''}
          bg-gradient-to-br ${config.gradient}
          hover:scale-105 active:scale-95
          focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800
          border-4 ${config.ringColor}
        `}
        style={{
          boxShadow: `
            0 0 40px ${crashSeverity ? 'rgba(239, 68, 68, 0.8)' : 'rgba(239, 68, 68, 0.4)'}, 
            0 0 80px ${crashSeverity ? 'rgba(239, 68, 68, 0.6)' : 'rgba(239, 68, 68, 0.2)'},
            inset 0 0 20px rgba(255, 255, 255, 0.1)
          `
        }}
      >
        {/* Inner highlight */}
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
        
        {/* Icon and text */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <Icon className={`w-12 h-12 mb-2 ${crashSeverity ? 'animate-bounce' : ''}`} />
          <span className="text-lg font-bold tracking-wider">
            {autoCallCountdown ? 'AUTO' : config.label}
          </span>
          {crashSeverity && (
            <span className="text-xs opacity-80 mt-1">
              {crashSeverity.toUpperCase()}
            </span>
          )}
        </div>

        {/* Breathing effect for emergency mode */}
        {(isEmergencyMode || crashSeverity) && (
          <div className="absolute inset-0 rounded-full bg-red-400/20 breathing-glow" />
        )}
      </button>

      {/* Status text */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
        {crashSeverity ? (
          <div className="slide-up-fade">
            <p className="text-lg font-bold text-red-600 dark:text-red-400 mb-1">
              {config.label} CRASH DETECTED
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {crashSeverity === 'high' ? 'Emergency services contacted' : 'Analyzing situation...'}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {isEmergencyMode ? 'Emergency Active' : 'Emergency SOS'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {isEmergencyMode ? 'Help is on the way' : 'Tap for immediate help'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FuturisticSOS;