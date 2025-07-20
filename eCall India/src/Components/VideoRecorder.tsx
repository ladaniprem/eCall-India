import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, Video, Upload, Download, Trash2, Camera, AlertTriangle } from 'lucide-react';

const VideoRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [autoRecordEnabled, setAutoRecordEnabled] = useState(true);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [crashDetected, setCrashDetected] = useState(false);
  const [recordings, setRecordings] = useState([
    {
      id: 1,
      name: "Emergency_2024-01-15_14-30.mp4",
      duration: "00:32",
      size: "12.5 MB",
      timestamp: "2024-01-15 14:30:22",
      uploaded: false,
      type: "crash",
      severity: "high"
    },
    {
      id: 2,
      name: "Emergency_2024-01-15_11-45.mp4",
      duration: "00:28",
      size: "9.8 MB",
      timestamp: "2024-01-15 11:45:18",
      uploaded: true,
      type: "manual",
      severity: "low"
    },
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  // Simulate speed tracking
  useEffect(() => {
    const interval = setInterval(() => {
      const newSpeed = Math.max(0, currentSpeed + (Math.random() - 0.5) * 10);
      setCurrentSpeed(newSpeed);
      
      // Simulate crash detection based on sudden speed drop
      if (currentSpeed > 40 && newSpeed < 10 && autoRecordEnabled) {
        setCrashDetected(true);
        handleAutoRecord();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentSpeed, autoRecordEnabled]);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: true 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const handleStartRecording = async () => {
    if (!videoRef.current?.srcObject) {
      await startCamera();
    }
    
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      mediaRecorderRef.current = new MediaRecorder(stream);
      recordedChunks.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
        saveRecording(blob);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

  const handleAutoRecord = async () => {
    if (!isRecording) {
      await handleStartRecording();
      // Auto-stop after 30 seconds for crash recordings
      setTimeout(() => {
        if (isRecording) {
          handleStopRecording();
        }
      }, 30000);
    }
  };

  const saveRecording = (blob: Blob) => {
    const newRecording = {
      id: recordings.length + 1,
      name: `${crashDetected ? 'Crash' : 'Manual'}_${new Date().toISOString().slice(0, 10)}_${new Date().toTimeString().slice(0, 8).replace(/:/g, '-')}.webm`,
      duration: formatTime(recordingTime),
      size: `${(blob.size / (1024 * 1024)).toFixed(1)} MB`,
      timestamp: new Date().toLocaleString(),
      uploaded: false,
      type: crashDetected ? 'crash' : 'manual',
      severity: crashDetected ? 'high' : 'low'
    };
    setRecordings([newRecording, ...recordings]);
    setCrashDetected(false);
  };

  const handleUpload = (id: number) => {
    setRecordings(recordings.map(recording => 
      recording.id === id ? { ...recording, uploaded: true } : recording
    ));
  };

  const handleDelete = (id: number) => {
    setRecordings(recordings.filter(recording => recording.id !== id));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="glass-morph shadow-lg px-6 py-8 slide-up-fade">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Emergency Recorder
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Auto-record crashes and emergencies with AI detection
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Speed Monitor & Crash Detection */}
        <div className="glass-morph rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Live Monitoring
            </h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              crashDetected ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-green-100 text-green-600'
            }`}>
              {crashDetected ? 'CRASH DETECTED' : 'MONITORING'}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-morph rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Speed</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {currentSpeed.toFixed(0)} km/h
              </p>
            </div>
            
            <div className="glass-morph rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Camera className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto Record</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRecordEnabled}
                  onChange={(e) => setAutoRecordEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Camera View */}
        <div className="glass-morph rounded-2xl shadow-lg overflow-hidden border border-white/20 dark:border-gray-700/50">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full aspect-video bg-black object-cover"
            />
            
            {/* Recording indicator */}
            {isRecording && (
              <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 animate-pulse">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">REC {formatTime(recordingTime)}</span>
              </div>
            )}

            {/* Crash detection overlay */}
            {crashDetected && (
              <div className="absolute inset-0 bg-red-600/20 border-4 border-red-500 animate-pulse flex items-center justify-center">
                <div className="bg-red-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2">
                  <AlertTriangle className="w-6 h-6" />
                  <span className="font-bold">CRASH DETECTED - AUTO RECORDING</span>
                </div>
              </div>
            )}

            {/* Recording controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-4">
                {!isRecording ? (
                  <button
                    onClick={handleStartRecording}
                    className="w-16 h-16 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center justify-center shadow-lg hover:scale-110 transform transition-transform"
                  >
                    <Play className="w-8 h-8 ml-1" />
                  </button>
                ) : (
                  <button
                    onClick={handleStopRecording}
                    className="w-16 h-16 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center justify-center shadow-lg animate-pulse"
                  >
                    <Square className="w-8 h-8" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recording Settings */}
        <div className="glass-morph rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Recording Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Auto-record on crash detection</span>
              <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Max recording duration</span>
              <select className="text-sm glass-morph border border-white/30 dark:border-gray-600 rounded px-3 py-1 text-gray-900 dark:text-white">
                <option>30 seconds</option>
                <option>1 minute</option>
                <option>2 minutes</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Auto-upload to cloud</span>
              <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Pre-crash buffer</span>
              <select className="text-sm glass-morph border border-white/30 dark:border-gray-600 rounded px-3 py-1 text-gray-900 dark:text-white">
                <option>10 seconds</option>
                <option>30 seconds</option>
                <option>60 seconds</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recordings List */}
        <div className="glass-morph rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50">
          <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Emergency Recordings ({recordings.length})
            </h3>
          </div>
          <div className="p-6">
            {recordings.length === 0 ? (
              <div className="text-center py-8">
                <Video className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No recordings yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recordings.map((recording) => (
                  <div key={recording.id} className="glass-morph rounded-xl p-4 hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Video className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {recording.name}
                            </p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(recording.severity)}`}>
                              {recording.type.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {recording.duration} • {recording.size} • {recording.timestamp}
                          </p>
                          {recording.uploaded && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 mt-1">
                              ✓ Uploaded
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!recording.uploaded && (
                          <button
                            onClick={() => handleUpload(recording.id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-full transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(recording.id)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoRecorder;