import express from 'express';
import { body } from 'express-validator';
import User from '../models/User.model.js';
import { 
  generateToken, 
  authenticate, 
  authRateLimit 
} from '../middleware/auth.js';
import { 
  asyncHandler, 
  APIError, 
  sendSuccess,
  validateRequest 
} from '../middleware/errorHandler.js';

const router = express.Router();

// Validation schemas
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const profileUpdateValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s\-\(\)]{10,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('vehicle.model')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Vehicle model is required'),
  body('vehicle.number')
    .optional()
    .trim()
    .matches(/^[A-Z]{2}\s?\d{2}\s?[A-Z]{1,2}\s?\d{4}$/)
    .withMessage('Please provide a valid Indian vehicle number'),
  body('emergencyContacts')
    .optional()
    .isArray({ min: 1, max: 5 })
    .withMessage('Please provide 1-5 emergency contacts'),
  body('emergencyContacts.*.name')
    .if(body('emergencyContacts').exists())
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Contact name is required'),
  body('emergencyContacts.*.phone')
    .if(body('emergencyContacts').exists())
    .matches(/^\+?[\d\s\-\(\)]{10,15}$/)
    .withMessage('Please provide a valid phone number for contact')
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', 
  authRateLimit,
  registerValidation,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new APIError('User with this email already exists', 409);
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user.getAuthTokenPayload());

    // Remove password from response
    const userResponse = user.toJSON();

    sendSuccess(res, {
      token,
      user: userResponse
    }, 'User registered successfully', 201);
  })
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login',
  authRateLimit,
  loginValidation,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      throw new APIError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new APIError('Account is deactivated. Please contact support', 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user.getAuthTokenPayload());

    // Remove password from response
    const userResponse = user.toJSON();

    sendSuccess(res, {
      token,
      user: userResponse
    }, 'Login successful');
  })
);

// @route   POST /api/auth/google
// @desc    Google OAuth login/register
// @access  Public
router.post('/google',
  authRateLimit,
  asyncHandler(async (req, res) => {
    const { googleId, email, name } = req.body;

    if (!googleId || !email || !name) {
      throw new APIError('Google ID, email, and name are required', 400);
    }

    // Find existing user by email or Google ID
    let user = await User.findByEmailOrGoogleId(email, googleId);

    if (user) {
      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
      
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user
      user = new User({
        name,
        email,
        googleId,
        emailVerified: true // Google accounts are pre-verified
      });
      
      await user.save();
    }

    // Generate token
    const token = generateToken(user.getAuthTokenPayload());

    sendSuccess(res, {
      token,
      user: user.toJSON()
    }, user.isNew ? 'Account created successfully' : 'Login successful');
  })
);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me',
  authenticate,
  asyncHandler(async (req, res) => {
    sendSuccess(res, {
      user: req.user.toJSON()
    }, 'Profile retrieved successfully');
  })
);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile',
  authenticate,
  profileUpdateValidation,
  validateRequest,
  asyncHandler(async (req, res) => {
    const allowedUpdates = [
      'name', 'phone', 'dateOfBirth', 'address', 'state', 
      'vehicle', 'emergencyContacts', 'medicalInfo', 'settings'
    ];
    
    const updates = {};
    
    // Filter allowed updates
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!user) {
      throw new APIError('User not found', 404);
    }

    sendSuccess(res, {
      user: user.toJSON()
    }, 'Profile updated successfully');
  })
);

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password',
  authenticate,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user.password) {
      throw new APIError('Cannot change password for Google authenticated accounts', 400);
    }

    // Verify current password
    if (!(await user.comparePassword(currentPassword))) {
      throw new APIError('Current password is incorrect', 401);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    sendSuccess(res, null, 'Password changed successfully');
  })
);

// @route   DELETE /api/auth/account
// @desc    Deactivate user account
// @access  Private
router.delete('/account',
  authenticate,
  asyncHandler(async (req, res) => {
    // Soft delete - deactivate account
    await User.findByIdAndUpdate(req.user.id, { 
      isActive: false,
      deactivatedAt: new Date()
    });

    sendSuccess(res, null, 'Account deactivated successfully');
  })
);

// @route   GET /api/auth/profile-completion
// @desc    Check profile completion status
// @access  Private
router.get('/profile-completion',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = req.user;
    const missingFields = [];
    
    if (!user.name) missingFields.push('name');
    if (!user.vehicle?.model) missingFields.push('vehicle.model');
    if (!user.vehicle?.number) missingFields.push('vehicle.number');
    if (!user.state) missingFields.push('state');
    if (!user.emergencyContacts?.length) missingFields.push('emergencyContacts');
    
    const completionPercentage = Math.round(
      ((5 - missingFields.length) / 5) * 100
    );

    sendSuccess(res, {
      profileComplete: user.profileComplete,
      completionPercentage,
      missingFields,
      nextStep: missingFields.length > 0 ? missingFields[0] : null
    }, 'Profile completion status retrieved');
  })
);

export default router;