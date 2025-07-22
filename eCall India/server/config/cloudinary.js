import cloudinaryModule from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

export const configureCloudinary = () => {
  // Configure Cloudinary
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('❌ Missing Cloudinary environment variables. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

// Verify Cloudinary configuration
export const verifyCloudinaryConfig = () => {
  const { cloud_name, api_key, api_secret } = cloudinary.config();
  
  if (!cloud_name || !api_key || !api_secret) {
    console.error('❌ Cloudinary configuration incomplete. Please check your environment variables.');
    return false;
  }
  
  console.log('✅ Cloudinary configured successfully');
  console.log(`📁 Cloud Name: ${cloud_name}`);
  return true;
};

// Storage configuration for emergency videos
const emergencyVideoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecall-india/emergency-videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'webm', 'mov', 'avi'],
    transformation: [
      {
        quality: 'auto:good',
        fetch_format: 'auto'
      }
    ],
    public_id: (req) => {
      const userId = req.user?.id || 'anonymous';
      const timestamp = Date.now();
      const emergencyType = req.body.emergencyType || 'manual';
      return `emergency_${userId}_${emergencyType}_${timestamp}`;
    }
  },
});

// Storage configuration for profile images
const profileImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecall-india/profile-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [
      {
        width: 400,
        height: 400,
        crop: 'fill',
        gravity: 'face',
        quality: 'auto:good',
        fetch_format: 'auto'
      }
    ],
    public_id: (req) => {
      const userId = req.user?.id || 'anonymous';
      return `profile_${userId}_${Date.now()}`;
    }
  },
});

// Multer configuration for emergency videos
const uploadEmergencyVideo = multer({
  storage: emergencyVideoStorage,
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed for emergency uploads'), false);
    }
  }
});

// Multer configuration for profile images
const uploadProfileImage = multer({
  storage: profileImageStorage,
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for profile uploads'), false);
    }
  }
});

// Utility functions for Cloudinary operations
const cloudinaryUtils = {
  // Upload video with metadata
  uploadEmergencyVideo: async (filePath, metadata = {}) => {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video',
        folder: 'ecall-india/emergency-videos',
        context: {
          emergency_type: metadata.emergencyType || 'manual',
          severity: metadata.severity || 'unknown',
          user_id: metadata.userId || 'anonymous',
          timestamp: metadata.timestamp || new Date().toISOString()
        },
        tags: ['emergency', metadata.emergencyType, metadata.severity].filter(Boolean)
      });

      return {
        cloudinaryId: result.public_id,
        publicUrl: result.secure_url,
        duration: result.duration,
        fileSize: result.bytes,
        format: result.format,
        width: result.width,
        height: result.height
      };
    } catch (error) {
      throw new Error(`Failed to upload video to Cloudinary: ${error.message}`);
    }
  },

  // Delete video from Cloudinary
  deleteVideo: async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'video'
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to delete video from Cloudinary: ${error.message}`);
    }
  },

  // Get video details
  getVideoDetails: async (publicId) => {
    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: 'video'
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to get video details: ${error.message}`);
    }
  },

  // Generate video thumbnail
  generateThumbnail: (publicId, options = {}) => {
    return cloudinary.url(publicId, {
      resource_type: 'video',
      format: 'jpg',
      transformation: [
        {
          width: options.width || 300,
          height: options.height || 200,
          crop: 'fill',
          quality: 'auto:good'
        }
      ]
    });
  },

  // Get optimized video URL
  getOptimizedVideoUrl: (publicId, options = {}) => {
    return cloudinary.url(publicId, {
      resource_type: 'video',
      quality: options.quality || 'auto:good',
      fetch_format: 'auto',
      transformation: options.transformation || []
    });
  }
};

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
  try {
    await cloudinary.api.ping();
    console.log('✅ Cloudinary connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection test failed:', error.message);
    return false;
  }
};

export {
  cloudinary,
  uploadEmergencyVideo,
  uploadProfileImage,
  cloudinaryUtils,
  testCloudinaryConnection
};