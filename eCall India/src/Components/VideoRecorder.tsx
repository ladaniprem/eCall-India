import React, { useState } from 'react';
import { Play, Square, Video, Upload, Download, Trash2 } from 'lucide-react';

const VideoRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState([
    {
      id: 1,
      name: "Emergency_2024-01-15_14-30.mp4",
      duration: "00:32",
      size: "12.5 MB",
      timestamp: "2024-01-15 14:30:22",
      uploaded: false
    },
    {
      id: 2,
      name: "Emergency_2024-01-15_11-45.mp4",
      duration: "00:28",
      size: "9.8 MB",
      timestamp: "2024-01-15 11:45:18",
      uploaded: true
    },
  ]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    // Simulate recording time
    const interval = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 30) {
          setIsRecording(false);
          clearInterval(interval);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
    // Add new recording to the list
    const newRecording = {
      id: recordings.length + 1,
      name: `Emergency_${new Date().toISOString().slice(0, 10)}_${new Date().toTimeString().slice(0, 8).replace(/:/g, '-')}.mp4`,
      duration: formatTime(recordingTime),
      size: "8.2 MB",
      timestamp: new Date().toLocaleString(),
      uploaded: false
    };
    setRecordings([newRecording, ...recordings]);
  };

  const handleUpload = (id: number) => {
    setRecordings(recordings.map(recording => 
      recording.id === id ? { ...recording, uploaded: true } : recording
    ));
  };

  const handleDelete = (id: number) => {
    setRecordings(recordings.filter(recording => recording.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Emergency Recorder</h1>
        <p className="text-gray-600">Auto-record crashes and emergencies</p>
      </div>

      {/* Camera View */}
      <div className="p-4">
        <div className="bg-black rounded-xl overflow-hidden mb-6 relative">
          <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Camera View</p>
              <p className="text-sm text-gray-400">Ready to record emergency footage</p>
            </div>
          </div>
          
          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">REC {formatTime(recordingTime)}</span>
            </div>
          )}

          {/* Recording controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-4">
              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  className="w-16 h-16 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center justify-center shadow-lg"
                >
                  <Play className="w-8 h-8" />
                </button>
              ) : (
                <button
                  onClick={handleStopRecording}
                  className="w-16 h-16 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center justify-center shadow-lg"
                >
                  <Square className="w-8 h-8" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Recording Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Auto-record on crash</span>
              <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Max recording time</span>
              <select className="text-sm border border-gray-300 rounded px-2 py-1">
                <option>30 seconds</option>
                <option>1 minute</option>
                <option>2 minutes</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Auto-upload to cloud</span>
              <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked />
            </div>
          </div>
        </div>

        {/* Recordings List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Recent Recordings</h3>
          </div>
          <div className="p-4">
            {recordings.length === 0 ? (
              <div className="text-center py-8">
                <Video className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No recordings yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recordings.map((recording) => (
                  <div key={recording.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Video className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{recording.name}</p>
                        <p className="text-xs text-gray-500">
                          {recording.duration} • {recording.size} • {recording.timestamp}
                        </p>
                        {recording.uploaded && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                            Uploaded
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!recording.uploaded && (
                        <button
                          onClick={() => handleUpload(recording.id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(recording.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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