import React, { useState, useEffect } from 'react';
import { AlertTriangle, Zap, Activity, Volume2, Shield } from 'lucide-react';

interface CrashData {
  severity: 'low' | 'medium' | 'high';
  gForce: number;
  speedDrop: number;
  rollover: boolean;
  audioLevel: number;
  timestamp: Date;
}

interface IntelligentCrashDetectionProps {
  onCrashDetected: (severity: 'low' | 'medium' | 'high', data: CrashData) => void;
  isActive: boolean;
}

const IntelligentCrashDetection: React.FC<IntelligentCrashDetectionProps> = ({ 
  onCrashDetected, 
  isActive 
}) => {
  const [currentData, setCurrentData] = useState<CrashData>({
    severity: 'low',
    gForce: 1.0,
    speedDrop: 0,
    rollover: false,
    audioLevel: 45,
    timestamp: new Date()
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastCrashTime, setLastCrashTime] = useState<Date | null>(null);

  // Simulate advanced physics-based crash detection
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Simulate sensor data
      const gForce = 1.0 + (Math.random() - 0.5) * 0.3;
      const speedDrop = Math.random() * 15;
      const rollover = Math.random() > 0.95;
      const audioLevel = 40 + Math.random() * 40;
      
      // Advanced crash analysis algorithm
      let severity: 'low' | 'medium' | 'high' = 'low';
      let crashDetected = false;
      
      // High severity: Heavy impact + speed drop + potential rollover
      if (gForce > 4.0 || speedDrop > 40 || rollover || audioLevel > 120) {
        severity = 'high';
        crashDetected = true;
        setIsAnalyzing(true);
      }
      // Medium severity: Strong shock but vehicle upright
      else if (gForce > 2.5 || speedDrop > 25 || audioLevel > 90) {
        severity = 'medium';
        crashDetected = true;
        setIsAnalyzing(true);
      }
      // Low severity: Minor collision
      else if (gForce > 2.0 || speedDrop > 15 || audioLevel > 80) {
        severity = 'low';
        crashDetected = true;
        setIsAnalyzing(true);
      }
      
      const newData: CrashData = {
        severity,
        gForce,
        speedDrop,
        rollover,
        audioLevel,
        timestamp: new Date()
      };
      
      setCurrentData(newData);
      
      if (crashDetected) {
        setLastCrashTime(new Date());
        onCrashDetected(severity, newData);
        
        // Reset analyzing state after detection
        setTimeout(() => setIsAnalyzing(false), 3000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onCrashDetected]);

  const getSeverityConfig = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return {
          color: 'text-red-500',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/50',
          glowColor: 'shadow-red-500/50',
          label: 'CRITICAL',
          actions: ['Auto-call 112', 'Alert hospitals', 'Notify all contacts']
        };
      case 'medium':
        return {
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/50',
          glowColor: 'shadow-yellow-500/50',
          label: 'MODERATE',
          actions: ['Alert family', 'Optional hospital', 'Share location']
        };
      case 'low':
        return {
          color: 'text-green-500',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/50',
          glowColor: 'shadow-green-500/50',
          label: 'MINOR',
          actions: ['Notify emergency contact', 'Share location']
        };
    }
  };

  const config = getSeverityConfig(currentData.severity);

  return (
    <div className="space-y-4">
      {/* Main Detection Panel */}
      <div className={`glass-morph rounded-2xl p-6 border-2 ${config.borderColor} ${isAnalyzing ? 'electric-shock' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-full ${config.bgColor} ${isAnalyzing ? 'neon-glow' : ''}`}>
              <Shield className={`w-6 h-6 ${config.color}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Intelligent Crash Detection
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isAnalyzing ? 'Analyzing impact...' : 'Monitoring sensors'}
              </p>
            </div>
          </div>
          
          {isAnalyzing && (
            <div className={`px-3 py-1 rounded-full ${config.bgColor} ${config.borderColor} border`}>
              <span className={`text-sm font-bold ${config.color}`}>
                {config.label}
              </span>
            </div>
          )}
        </div>

        {/* Sensor Data Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="glass-morph rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">G-Force</span>
            </div>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {currentData.gForce.toFixed(1)}G
            </p>
          </div>
          
          <div className="glass-morph rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Speed Drop</span>
            </div>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {currentData.speedDrop.toFixed(0)} km/h
            </p>
          </div>
          
          <div className="glass-morph rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Volume2 className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Audio Level</span>
            </div>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {currentData.audioLevel.toFixed(0)} dB
            </p>
          </div>
          
          <div className="glass-morph rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rollover</span>
            </div>
            <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
              {currentData.rollover ? 'YES' : 'NO'}
            </p>
          </div>
        </div>

        {/* AI Analysis Actions */}
        {isAnalyzing && (
          <div className="slide-up-fade">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Automatic Response Actions:
            </h4>
            <div className="space-y-2">
              {config.actions.map((action, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')} animate-pulse`}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{action}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Last Crash Info */}
      {lastCrashTime && (
        <div className="glass-morph rounded-lg p-4 slide-up-fade">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Last Impact Detected
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {lastCrashTime.toLocaleString()} • Severity: {config.label}
          </p>
        </div>
      )}

      {/* Floating Particles Effect */}
      {isAnalyzing && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 ${config.color.replace('text-', 'bg-')} rounded-full floating-particles`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default IntelligentCrashDetection;