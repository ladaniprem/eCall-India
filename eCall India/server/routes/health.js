import express from 'express';
import database from '../config/database.js';
import { testCloudinaryConnection } from '../config/cloudinary.js';
import { asyncHandler, sendSuccess } from '../middleware/errorHandler.js';
import User from '../models/User.model.js';
import EmergencyLog from '../models/EmergencyLog.model.js';

const router = express.Router();

// @route   GET /api/health
// @desc    Basic health check
// @access  Public
router.get('/',
  asyncHandler(async (_res, res) => {
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      node_version: process.version,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      }
    };

    sendSuccess(res, healthCheck, 'System is healthy');
  })
);

// @route   GET /api/health/database
// @desc    Database connection health check
// @access  Public
router.get('/database',
  asyncHandler(async (_res, res) => {
    const dbStatus = await database.checkConnection();
    
    if (dbStatus.status === 'connected') {
      const stats = await database.getStats();
      
      sendSuccess(res, {
        ...dbStatus,
        stats
      }, 'Database connection is healthy');
    } else {
      res.status(503).json({
        success: false,
        message: 'Database connection is unhealthy',
        data: dbStatus,
        timestamp: new Date().toISOString()
      });
    }
  })
);

// @route   GET /api/health/services
// @desc    External services health check
// @access  Public
router.get('/services',
  asyncHandler(async (_res, res) => {
    const services = {
      database: { status: 'unknown', message: '', responseTime: 0 },
      cloudinary: { status: 'unknown', message: '', responseTime: 0 }
    };

    // Test database connection
    const dbStart = Date.now();
    try {
      const dbStatus = await database.checkConnection();
      services.database = {
        status: dbStatus.status === 'connected' ? 'healthy' : 'unhealthy',
        message: dbStatus.message,
        responseTime: Date.now() - dbStart
      };
    } catch (error) {
      services.database = {
        status: 'unhealthy',
        message: error.message,
        responseTime: Date.now() - dbStart
      };
    }

    // Test Cloudinary connection
    const cloudinaryStart = Date.now();
    try {
      const cloudinaryHealthy = await testCloudinaryConnection();
      services.cloudinary = {
        status: cloudinaryHealthy ? 'healthy' : 'unhealthy',
        message: cloudinaryHealthy ? 'Connection successful' : 'Connection failed',
        responseTime: Date.now() - cloudinaryStart
      };
    } catch (error) {
      services.cloudinary = {
        status: 'unhealthy',
        message: error.message,
        responseTime: Date.now() - cloudinaryStart
      };
    }

    // Determine overall health
    const allHealthy = Object.values(services).every(service => service.status === 'healthy');
    const statusCode = allHealthy ? 200 : 503;

    res.status(statusCode).json({
      success: allHealthy,
      message: allHealthy ? 'All services are healthy' : 'Some services are unhealthy',
      data: {
        overall: allHealthy ? 'healthy' : 'degraded',
        services
      },
      timestamp: new Date().toISOString()
    });
  })
);

// @route   GET /api/health/detailed
// @desc    Detailed system health check
// @access  Public
router.get('/detailed',
  asyncHandler(async (_res, res) => {
    const startTime = Date.now();
    
    // System metrics
    const systemMetrics = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      pid: process.pid
    };

    // Database metrics
    let databaseMetrics = null;
    try {
      const dbStatus = await database.checkConnection();
      if (dbStatus.status === 'connected') {
        databaseMetrics = await database.getStats();
      }
    } catch (error) {
      databaseMetrics = { error: error.message };
    }

    // Application metrics
    let applicationMetrics = null;
    try {
      const [userCount, emergencyCount] = await Promise.all([
        User.countDocuments({ isActive: true }),
        EmergencyLog.countDocuments({ 
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
        })
      ]);

      applicationMetrics = {
        activeUsers: userCount,
        emergenciesLast24h: emergencyCount,
        totalResponseTime: Date.now() - startTime
      };
    } catch (error) {
      applicationMetrics = { error: error.message };
    }

    sendSuccess(res, {
      system: systemMetrics,
      database: databaseMetrics,
      application: applicationMetrics,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime
    }, 'Detailed health check completed');
  })
);

// @route   GET /api/health/ready
// @desc    Readiness probe for container orchestration
// @access  Public
router.get('/ready',
  asyncHandler(async (_res, res) => {
    try {
      // Check critical dependencies
      const dbStatus = await database.checkConnection();
      
      if (dbStatus.status !== 'connected') {
        return res.status(503).json({
          success: false,
          message: 'Service not ready - database unavailable',
          timestamp: new Date().toISOString()
        });
      }

      sendSuccess(res, {
        ready: true,
        checks: {
          database: 'connected'
        }
      }, 'Service is ready');
    } catch (error) {
      res.status(503).json({
        success: false,
        message: 'Service not ready',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  })
);

// @route   GET /api/health/live
// @desc    Liveness probe for container orchestration
// @access  Public
router.get('/live',
  asyncHandler(async (_res, res) => {
    // Simple liveness check - if we can respond, we're alive
    sendSuccess(res, {
      alive: true,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }, 'Service is alive');
  })
);

export default router;