import mongoose from 'mongoose';

// Location Schema
const locationSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: [true, 'Latitude is required'],
    min: [-90, 'Latitude must be between -90 and 90'],
    max: [90, 'Latitude must be between -90 and 90']
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required'],
    min: [-180, 'Longitude must be between -180 and 180'],
    max: [180, 'Longitude must be between -180 and 180']
  },
  accuracy: {
    type: Number,
    min: [0, 'Accuracy cannot be negative']
  },
  address: {
    type: String,
    trim: true,
    maxLength: [300, 'Address cannot exceed 300 characters']
  }
}, { _id: false });

// Crash Data Schema
const crashDataSchema = new mongoose.Schema({
  gForce: {
    type: Number,
    required: [true, 'G-Force data is required'],
    min: [0, 'G-Force cannot be negative']
  },
  speedDrop: {
    type: Number,
    required: [true, 'Speed drop data is required'],
    min: [0, 'Speed drop cannot be negative']
  },
  rollover: {
    type: Boolean,
    default: false
  },
  audioLevel: {
    type: Number,
    min: [0, 'Audio level cannot be negative'],
    max: [200, 'Audio level cannot exceed 200 dB']
  },
  impactDirection: {
    type: String,
    enum: ['front', 'rear', 'left', 'right', 'rollover', 'unknown'],
    default: 'unknown'
  }
}, { _id: false });

// Response Action Schema
const responseActionSchema = new mongoose.Schema({
  action: {
    type: String,
    required: [true, 'Action type is required'],
    enum: ['call_112', 'call_hospital', 'notify_contacts', 'send_sms', 'send_whatsapp', 'record_video']
  },
  status: {
    type: String,
    required: [true, 'Action status is required'],
    enum: ['pending', 'in_progress', 'completed', 'failed'],
    default: 'pending'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  details: {
    type: mongoose.Schema.Types.Mixed // Flexible field for action-specific data
  },
  error: {
    type: String,
    trim: true
  }
}, { _id: true });

// Emergency Log Schema
const emergencyLogSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  
  // Emergency Details
  emergencyType: {
    type: String,
    required: [true, 'Emergency type is required'],
    enum: ['crash', 'medical', 'manual', 'voice_triggered'],
    index: true
  },
  severity: {
    type: String,
    required: [true, 'Severity is required'],
    enum: ['low', 'medium', 'high'],
    index: true
  },
  
  // Location Information
  location: {
    type: locationSchema,
    required: [true, 'Location is required']
  },
  
  // Crash-specific Data
  crashData: crashDataSchema,
  
  // Emergency Response
  responseActions: [responseActionSchema],
  
  // Media Files
  videoFiles: [{
    cloudinaryId: {
      type: String,
      required: true
    },
    publicUrl: {
      type: String,
      required: true
    },
    duration: Number, // in seconds
    fileSize: Number, // in bytes
    recordingType: {
      type: String,
      enum: ['pre_crash', 'post_crash', 'manual'],
      default: 'manual'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Status Tracking
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['active', 'resolved', 'false_alarm', 'cancelled'],
    default: 'active',
    index: true
  },
  
  // Resolution Details
  resolvedAt: Date,
  resolvedBy: {
    type: String,
    enum: ['user', 'emergency_services', 'family', 'auto_timeout']
  },
  notes: {
    type: String,
    trim: true,
    maxLength: [1000, 'Notes cannot exceed 1000 characters']
  },
  
  // Response Time Tracking
  detectionTime: {
    type: Date,
    required: [true, 'Detection time is required'],
    default: Date.now
  },
  firstResponseTime: Date,
  emergencyServicesContactTime: Date,
  
  // Device Information
  deviceInfo: {
    userAgent: String,
    platform: String,
    batteryLevel: Number,
    networkType: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
emergencyLogSchema.index({ userId: 1, createdAt: -1 });
emergencyLogSchema.index({ emergencyType: 1, severity: 1 });
emergencyLogSchema.index({ status: 1, createdAt: -1 });
emergencyLogSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

// Virtual for response time calculation
emergencyLogSchema.virtual('responseTime').get(function() {
  if (this.firstResponseTime && this.detectionTime) {
    return this.firstResponseTime - this.detectionTime;
  }
  return null;
});

// Virtual for emergency duration
emergencyLogSchema.virtual('duration').get(function() {
  const endTime = this.resolvedAt || new Date();
  return endTime - this.detectionTime;
});

// Pre-save middleware to update response times
emergencyLogSchema.pre('save', function(next) {
  // Set first response time when first action is completed
  if (!this.firstResponseTime) {
    const completedAction = this.responseActions.find(action => action.status === 'completed');
    if (completedAction) {
      this.firstResponseTime = completedAction.timestamp;
    }
  }
  
  // Set emergency services contact time
  if (!this.emergencyServicesContactTime) {
    const emergencyCall = this.responseActions.find(action => 
      (action.action === 'call_112' || action.action === 'call_hospital') && 
      action.status === 'completed'
    );
    if (emergencyCall) {
      this.emergencyServicesContactTime = emergencyCall.timestamp;
    }
  }
  
  next();
});

// Static method to get emergency statistics
emergencyLogSchema.statics.getEmergencyStats = function(userId, dateRange = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - dateRange);
  
  return this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalEmergencies: { $sum: 1 },
        crashCount: {
          $sum: { $cond: [{ $eq: ['$emergencyType', 'crash'] }, 1, 0] }
        },
        highSeverityCount: {
          $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] }
        },
        avgResponseTime: {
          $avg: {
            $subtract: ['$firstResponseTime', '$detectionTime']
          }
        },
        falseAlarmCount: {
          $sum: { $cond: [{ $eq: ['$status', 'false_alarm'] }, 1, 0] }
        }
      }
    }
  ]);
};

export default mongoose.model('EmergencyLog', emergencyLogSchema);