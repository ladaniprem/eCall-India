import express from 'express';
import { body } from 'express-validator';
import EmergencyLog from '../models/EmergencyLog.model.js';
import { 
  authenticate, 
  requireCompleteProfile,
  emergencyRateLimit 
} from '../middleware/auth.js';
import { 
  asyncHandler, 
  APIError, 
  sendSuccess,
  validateRequest,
  paginate 
} from '../middleware/errorHandler.js';
import { uploadEmergencyVideo } from '../config/cloudinary.js';

const router = express.Router();

// Validation schemas
const emergencyTriggerValidation = [
  body('emergencyType')
    .isIn(['crash', 'medical', 'manual', 'voice_triggered'])
    .withMessage('Invalid emergency type'),
  body('severity')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid severity level'),
  body('location.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),
  body('location.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude'),
  body('crashData')
    .optional()
    .isObject()
    .withMessage('Crash data must be an object'),
  body('deviceInfo')
    .optional()
    .isObject()
    .withMessage('Device info must be an object')
];

// @route   POST /api/emergency/trigger
// @desc    Trigger emergency response
// @access  Private
router.post('/trigger',
  authenticate,
  requireCompleteProfile,
  emergencyRateLimit,
  emergencyTriggerValidation,
  validateRequest,
  asyncHandler(async (req, res) => {
    const {
      emergencyType,
      severity,
      location,
      crashData,
      deviceInfo,
      notes
    } = req.body;

    // Create emergency log
    const emergencyLog = new EmergencyLog({
      userId: req.user.id,
      emergencyType,
      severity,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        address: location.address
      },
      crashData,
      deviceInfo,
      notes,
      detectionTime: new Date()
    });

    // Determine response actions based on severity
    const responseActions = [];

    switch (severity) {
      case 'high':
        responseActions.push(
          { action: 'call_112', status: 'pending' },
          { action: 'call_hospital', status: 'pending' },
          { action: 'notify_contacts', status: 'pending' },
          { action: 'send_sms', status: 'pending' },
          { action: 'send_whatsapp', status: 'pending' }
        );
        break;
      case 'medium':
        responseActions.push(
          { action: 'notify_contacts', status: 'pending' },
          { action: 'send_sms', status: 'pending' }
        );
        break;
      case 'low':
        responseActions.push(
          { action: 'notify_contacts', status: 'pending' }
        );
        break;
    }

    emergencyLog.responseActions = responseActions;
    await emergencyLog.save();

    // In a real implementation, you would trigger actual emergency services here
    // For now, we'll simulate the process
    setTimeout(async () => {
      try {
        // Simulate emergency response actions
        for (let action of emergencyLog.responseActions) {
          action.status = 'in_progress';
          await emergencyLog.save();
          
          // Simulate processing time
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          action.status = 'completed';
          action.timestamp = new Date();
          await emergencyLog.save();
        }
      } catch (error) {
        console.error('Error processing emergency actions:', error);
      }
    }, 100);

    sendSuccess(res, {
      emergencyLog: emergencyLog.toJSON(),
      message: 'Emergency response initiated'
    }, 'Emergency triggered successfully', 201);
  })
);

// @route   POST /api/emergency/:id/upload-video
// @desc    Upload emergency video
// @access  Private
router.post('/:id/upload-video',
  authenticate,
  requireCompleteProfile,
  uploadEmergencyVideo.single('video'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { recordingType = 'manual' } = req.body;

    if (!req.file) {
      throw new APIError('No video file provided', 400);
    }

    // Find emergency log
    const emergencyLog = await EmergencyLog.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!emergencyLog) {
      throw new APIError('Emergency log not found', 404);
    }

    // Add video file info to emergency log
    const videoInfo = {
      cloudinaryId: req.file.public_id,
      publicUrl: req.file.secure_url,
      duration: req.file.duration,
      fileSize: req.file.bytes,
      recordingType,
      uploadedAt: new Date()
    };

    emergencyLog.videoFiles.push(videoInfo);
    await emergencyLog.save();

    sendSuccess(res, {
      video: videoInfo,
      emergencyLog: emergencyLog.toJSON()
    }, 'Video uploaded successfully', 201);
  })
);

// @route   GET /api/emergency/logs
// @desc    Get user's emergency logs
// @access  Private
router.get('/logs',
  authenticate,
  asyncHandler(async (req, res) => {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      emergencyType, 
      severity,
      startDate,
      endDate 
    } = req.query;

    // Build query
    const query = { userId: req.user.id };
    
    if (status) query.status = status;
    if (emergencyType) query.emergencyType = emergencyType;
    if (severity) query.severity = severity;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Execute query with pagination
    const emergencyLogs = await paginate(
      EmergencyLog.find(query).sort({ createdAt: -1 }),
      parseInt(page),
      parseInt(limit)
    );

    const total = await EmergencyLog.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    sendSuccess(res, {
      emergencyLogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalLogs: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }, 'Emergency logs retrieved successfully');
  })
);

// @route   GET /api/emergency/logs/:id
// @desc    Get specific emergency log
// @access  Private
router.get('/logs/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const emergencyLog = await EmergencyLog.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!emergencyLog) {
      throw new APIError('Emergency log not found', 404);
    }

    sendSuccess(res, {
      emergencyLog: emergencyLog.toJSON()
    }, 'Emergency log retrieved successfully');
  })
);

// @route   PUT /api/emergency/logs/:id/resolve
// @desc    Resolve emergency
// @access  Private
router.put('/logs/:id/resolve',
  authenticate,
  [
    body('resolvedBy')
      .isIn(['user', 'emergency_services', 'family', 'auto_timeout'])
      .withMessage('Invalid resolved by value'),
    body('notes')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Notes cannot exceed 1000 characters')
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { resolvedBy, notes } = req.body;

    const emergencyLog = await EmergencyLog.findOne({
      _id: req.params.id,
      userId: req.user.id,
      status: 'active'
    });

    if (!emergencyLog) {
      throw new APIError('Active emergency log not found', 404);
    }

    emergencyLog.status = 'resolved';
    emergencyLog.resolvedAt = new Date();
    emergencyLog.resolvedBy = resolvedBy;
    if (notes) emergencyLog.notes = notes;

    await emergencyLog.save();

    sendSuccess(res, {
      emergencyLog: emergencyLog.toJSON()
    }, 'Emergency resolved successfully');
  })
);

// @route   GET /api/emergency/stats
// @desc    Get emergency statistics
// @access  Private
router.get('/stats',
  authenticate,
  asyncHandler(async (req, res) => {
    const { days = 30 } = req.query;
    
    const stats = await EmergencyLog.getEmergencyStats(req.user.id, parseInt(days));
    
    sendSuccess(res, {
      stats: stats[0] || {
        totalEmergencies: 0,
        crashCount: 0,
        highSeverityCount: 0,
        avgResponseTime: 0,
        falseAlarmCount: 0
      },
      period: `${days} days`
    }, 'Emergency statistics retrieved successfully');
  })
);

// @route   POST /api/emergency/test
// @desc    Test emergency system (development only)
// @access  Private
router.post('/test',
  authenticate,
  asyncHandler(async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      throw new APIError('Test endpoint not available in production', 403);
    }

    const testEmergency = {
      emergencyType: 'manual',
      severity: 'low',
      location: {
        latitude: 28.6139,
        longitude: 77.2090,
        address: 'Test Location, New Delhi'
      },
      notes: 'Test emergency - not a real emergency'
    };

    // Create test emergency log
    const emergencyLog = new EmergencyLog({
      userId: req.user.id,
      ...testEmergency,
      responseActions: [
        { action: 'notify_contacts', status: 'completed', timestamp: new Date() }
      ]
    });

    await emergencyLog.save();

    sendSuccess(res, {
      emergencyLog: emergencyLog.toJSON()
    }, 'Test emergency created successfully', 201);
  })
);

export default router;