import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Mic, MicOff, Volume2, Zap } from 'lucide-react';

interface CrashDetectionSystemProps {
  onCrashDetected: (severity: 'minor' | 'moderate' | 'severe') => void;
  onVoiceTrigger: () => void;
}

const CrashDetectionSystem: React.FC<CrashDetectionSystemProps> = ({ 
  onCrashDetected, 
  onVoiceTrigger 
}) => {
  const [isListening, setIsListening] = useState(true);
  const [gForce, setGForce] = useState(1.0);
  const [speed, setSpeed] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [crashProbability, setCrashProbability] = useState(0);
  const [lastImpactTime, setLastImpactTime] = useState<Date | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Simulate physics-based crash detection
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate accelerometer data
      const baseGForce = 1.0 + (Math.random() - 0.5) * 0.2;
      setGForce(baseGForce);
      
      // Simulate speed changes
      const currentSpeed = Math.max(0, speed + (Math.random() - 0.5) * 10);
      setSpeed(currentSpeed);
      
      // Crash detection algorithm
      const suddenDeceleration = speed > 30 && currentSpeed < 5;
      const highGForce = baseGForce > 3.0;
      const rapidSpeedChange = Math.abs(speed - currentSpeed) > 25;
      
      let probability = 0;
      if (suddenDeceleration) probability += 0.4;
      if (highGForce) probability += 0.3;
      if (rapidSpeedChange) probability += 0.3;
      
      setCrashProbability(probability);
      
      // Trigger crash detection if probability is high
      if (probability > 0.7) {
        setLastImpactTime(new Date());
        const severity = probability > 0.9 ? 'severe' : probability > 0.8 ? 'moderate' : 'minor';
        onCrashDetected(severity);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [speed, onCrashDetected]);

  // Voice detection setup
  useEffect(() => {
    if (isListening) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          audioContextRef.current = new AudioContext();
          analyserRef.current = audioContextRef.current.createAnalyser();
          microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
          
          microphoneRef.current.connect(analyserRef.current);
          analyserRef.current.fftSize = 256;
          
          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          
          const checkAudio = () => {
            if (analyserRef.current) {
              analyserRef.current.getByteFrequencyData(dataArray);
              
              // Check for high-frequency distress sounds (3-6 kHz range)
              const highFreqStart = Math.floor((3000 / audioContextRef.current!.sampleRate) * bufferLength);
              const highFreqEnd = Math.floor((6000 / audioContextRef.current!.sampleRate) * bufferLength);
              
              let highFreqSum = 0;
              for (let i = highFreqStart; i < highFreqEnd; i++) {
                highFreqSum += dataArray[i];
              }
              
              const avgHighFreq = highFreqSum / (highFreqEnd - highFreqStart);
              setAudioLevel(avgHighFreq);
              
              // Trigger voice SOS if high-frequency distress detected
              if (avgHighFreq > 120) { // Simulating 120dB+ detection
                onVoiceTrigger();
              }
              
              requestAnimationFrame(checkAudio);
            }
          };
          
          checkAudio();
        })
        .catch(err => console.log('Microphone access denied:', err));
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isListening, onVoiceTrigger]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Crash Detection System</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${crashProbability > 0.5 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
          <span className="text-sm text-gray-600">
            {crashProbability > 0.5 ? 'Alert' : 'Monitoring'}
          </span>
        </div>
      </div>

      {/* Physics Sensors */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800 font-medium">G-Force</span>
          </div>
          <p className="text-lg font-bold text-blue-900">{gForce.toFixed(1)}G</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Volume2 className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800 font-medium">Audio</span>
          </div>
          <p className="text-lg font-bold text-green-900">{audioLevel.toFixed(0)}dB</p>
        </div>
      </div>

      {/* Voice Detection Toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${isListening ? 'bg-red-100' : 'bg-gray-200'}`}>
            {isListening ? (
              <Mic className={`w-4 h-4 text-red-600 ${isListening ? 'animate-pulse' : ''}`} />
            ) : (
              <MicOff className="w-4 h-4 text-gray-600" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">Voice SOS Detection</p>
            <p className="text-xs text-gray-500">Listening for distress calls</p>
          </div>
        </div>
        <button
          onClick={() => setIsListening(!isListening)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isListening ? 'bg-red-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isListening ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Crash Probability Indicator */}
      {crashProbability > 0.3 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">Potential Impact Detected</p>
              <p className="text-sm text-yellow-700">
                Crash probability: {(crashProbability * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {lastImpactTime && (
        <div className="mt-2 text-xs text-gray-500">
          Last impact: {lastImpactTime.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default CrashDetectionSystem;