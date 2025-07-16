import React, { useState, useEffect } from 'react';
import { Shield, Zap } from 'lucide-react';

interface AnimatedSOSProps {
  onEmergency: () => void;
  isEmergencyMode?: boolean;
  crashSeverity?: 'minor' | 'moderate' | 'severe' | null;
}

const AnimatedSOS: React.FC<AnimatedSOSProps> = ({ 
  onEmergency, 
  isEmergencyMode = false,
  crashSeverity = null 
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; timestamp: number }>>([]);
  const [autoCallCountdown, setAutoCallCountdown] = useState<number | null>(null);

  // Auto-call countdown for severe crashes
  useEffect(() => {
    if (crashSeverity === 'severe') {
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

  // Continuous ripple effect for emergency mode
  useEffect(() => {
    if (isEmergencyMode) {
      const interval = setInterval(() => {
        const newRipple = { id: Date.now(), timestamp: Date.now() };
        setRipples(prev => [...prev, newRipple]);
        
        // Remove old ripples
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
        }, 2000);
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [isEmergencyMode]);

  const handlePress = () => {
    setIsPressed(true);
    const newRipple = { id: Date.now(), timestamp: Date.now() };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setIsPressed(false);
      onEmergency();
    }, 200);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 2000);
  };

  const getSeverityColor = () => {
    switch (crashSeverity) {
      case 'severe': return 'from-red-600 to-red-800';
      case 'moderate': return 'from-orange-500 to-red-600';
      case 'minor': return 'from-yellow-500 to-orange-500';
      default: return 'from-red-600 to-red-700';
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Ripple Effects */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-75"
          style={{
            animation: 'ripple 2s cubic-bezier(0, 0, 0.2, 1) infinite'
          }}
        />
      ))}
      
      {/* Auto-call countdown overlay */}
      {autoCallCountdown !== null && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-10">
          <div className="text-center">
            <p className="text-sm font-medium">Auto-calling 112 in</p>
            <p className="text-2xl font-bold">{autoCallCountdown}</p>
          </div>
        </div>
      )}

      {/* Main SOS Button */}
      <button
        onClick={handlePress}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        className={`
          relative w-32 h-32 rounded-full shadow-2xl transition-all duration-200 transform
          ${isPressed ? 'scale-95' : 'scale-100'}
          ${isEmergencyMode ? 'animate-pulse' : ''}
          bg-gradient-to-br ${getSeverityColor()}
          hover:shadow-red-500/50 active:shadow-red-600/60
          focus:outline-none focus:ring-4 focus:ring-red-300
        `}
        style={{
          boxShadow: isEmergencyMode 
            ? '0 0 40px rgba(239, 68, 68, 0.6), 0 0 80px rgba(239, 68, 68, 0.4)' 
            : '0 20px 40px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Inner glow effect */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
        
        {/* Icon and text */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          {crashSeverity ? (
            <Zap className="w-10 h-10 mb-1 animate-bounce" />
          ) : (
            <Shield className="w-10 h-10 mb-1" />
          )}
          <span className="text-sm font-bold tracking-wider">
            {autoCallCountdown ? 'AUTO' : 'SOS'}
          </span>
        </div>

        {/* Breathing effect for emergency mode */}
        {isEmergencyMode && (
          <div className="absolute inset-0 rounded-full bg-red-400 opacity-30 animate-ping" />
        )}
      </button>

      {/* Status text */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
        {crashSeverity ? (
          <p className="text-sm text-red-600 font-medium">
            {crashSeverity.toUpperCase()} CRASH DETECTED
          </p>
        ) : (
          <p className="text-xs text-gray-500">
            {isEmergencyMode ? 'Emergency Active' : 'Hold for 3 seconds'}
          </p>
        )}
      </div>

      <style>{`
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedSOS;