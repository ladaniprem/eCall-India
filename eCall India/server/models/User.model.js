import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Emergency Contact Schema
const emergencyContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Contact name is required'],
    trim: true,
    maxlength: 100
  },
  phone: {
    type: String,
    required: [true, 'Contact phone is required'],
    validate: {
      validator: function(v) {
        return /^\+?[\d\s\-\(\)]{10,15}$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  relation: {
    type: String,
    required: [true, 'Contact relation is required'],
    enum: ['Family', 'Friend', 'Doctor', 'Colleague', 'Spouse', 'Parent', 'Sibling', 'Other']
  },
  priority: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, { _id: true });

// Vehicle Details Schema
const vehicleSchema = new mongoose.Schema({
  model: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true,
    maxlength: 100
  },
  number: {
    type: String,
    required: [true, 'Vehicle number is required'],
    trim: true,
    uppercase: true,
    validate: {
      validator: function(v) {
        return /^[A-Z]{2}\s?\d{2}\s?[A-Z]{1,2}\s?\d{4}$/.test(v);
      },
      message: 'Please enter a valid Indian vehicle number (e.g., DL 01 AB 1234)'
    }
  },
  insuranceNumber: {
    type: String,
    trim: true,
    maxlength: 50
  }
}, { _id: false });

// Medical Information Schema
const medicalInfoSchema = new mongoose.Schema({
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
    default: ''
  },
  medicalConditions: {
    type: String,
    trim: true,
    maxlength: 500
  },
  allergies: {
    type: String,
    trim: true,
    maxlength: 300
  }
}, { _id: false });

// User Settings Schema
const settingsSchema = new mongoose.Schema({
  language: {
    type: String,
    enum: ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi'],
    default: 'English'
  },
  notifications: {
    type: Boolean,
    default: true
  },
  autoCall: {
    type: Boolean,
    default: true
  },
  locationSharing: {
    type: Boolean,
    default: true
  },
  crashSensitivity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  voiceAssistant: {
    type: Boolean,
    default: true
  }
}, { _id: false });

// Main User Schema
const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password required only if not Google auth
    },
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  
  // Google Authentication
  googleId: {
    type: String,
    sparse: true // Allows multiple null values
  },
  
  // Personal Details
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^\+?[\d\s\-\(\)]{10,15}$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v < new Date();
      },
      message: 'Date of birth cannot be in the future'
    }
  },
  address: {
    type: String,
    trim: true,
    maxlength: 300
  },
  
  // Location Information
  country: {
    type: String,
    default: 'India',
    trim: true
  },
  state: {
    type: String,
    trim: true,
    maxlength: 50
  },
  
  // Emergency Information
  emergencyContacts: [emergencyContactSchema],
  vehicle: vehicleSchema,
  medicalInfo: medicalInfoSchema,
  settings: {
    type: settingsSchema,
    default: () => ({})
  },
  
  // Profile Completion Status
  profileComplete: {
    type: Boolean,
    default: false
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(_, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ 'vehicle.number': 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full profile completion check
userSchema.virtual('isProfileComplete').get(function() {
  return !!(
    this.name &&
    this.email &&
    this.vehicle?.model &&
    this.vehicle?.number &&
    this.state &&
    this.emergencyContacts?.length > 0
  );
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified and exists
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update profile completion status
userSchema.pre('save', function(next) {
  this.profileComplete = this.isProfileComplete;
  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate auth token payload
userSchema.methods.getAuthTokenPayload = function() {
  return {
    id: this._id,
    email: this.email,
    name: this.name,
    profileComplete: this.profileComplete
  };
};

// Static method to find user by email or Google ID
userSchema.statics.findByEmailOrGoogleId = function(email, googleId) {
  const query = { $or: [{ email }] };
  if (googleId) {
    query.$or.push({ googleId });
  }
  return this.findOne(query);
};

export default mongoose.model('User', userSchema);