// Removed unused mongoose import

// Custom error class for API errors
class APIError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle Mongoose validation errors
const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map(err => ({
    field: err.path,
    message: err.message,
    value: err.value
  }));
  
  return new APIError(
    `Validation failed: ${errors.map(e => e.message).join(', ')}`,
    400
  );
};

// Handle Mongoose duplicate key errors
const handleDuplicateKeyError = (error) => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];
  
  return new APIError(
    `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`,
    409
  );
};

// Handle Mongoose cast errors
const handleCastError = (error) => {
  return new APIError(
    `Invalid ${error.path}: ${error.value}`,
    400
  );
};

// Handle JWT errors
const handleJWTError = () => {
  return new APIError('Invalid token. Please log in again', 401);
};

const handleJWTExpiredError = () => {
  return new APIError('Token expired. Please log in again', 401);
};

// Handle Multer errors
const handleMulterError = (error) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return new APIError('File too large. Please upload a smaller file', 413);
  }
  if (error.code === 'LIMIT_FILE_COUNT') {
    return new APIError('Too many files. Please upload fewer files', 413);
  }
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return new APIError('Unexpected file field', 400);
  }
  return new APIError(`File upload error: ${error.message}`, 400);
};

// Send error response in development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });
};

// Send error response in production
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      timestamp: new Date().toISOString()
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥:', err);
    
    res.status(500).json({
      success: false,
      message: 'Something went wrong on our end. Please try again later.',
      timestamp: new Date().toISOString()
    });
  }
};

// Log error details
const logError = (error, req) => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode
    }
  };
  
  console.error('🚨 API Error:', JSON.stringify(errorInfo, null, 2));
  
  // In production, you might want to send this to a logging service
  // like Winston, Sentry, or CloudWatch
};

// Main error handling middleware
const globalErrorHandler = (err, req, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  // Log the error
  logError(err, req);
  
  let error = { ...err };
  error.message = err.message;
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    error = handleValidationError(err);
  }
  
  if (err.code === 11000) {
    error = handleDuplicateKeyError(err);
  }
  
  if (err.name === 'CastError') {
    error = handleCastError(err);
  }
  
  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }
  
  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }
  
  if (err.name === 'MulterError') {
    error = handleMulterError(err);
  }
  
  // Send appropriate response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler for undefined routes
const notFoundHandler = (req, _res, next) => {
  const error = new APIError(
    `Route ${req.originalUrl} not found on this server`,
    404
  );
  next(error);
};

// Validation middleware
const validateRequest = (schema) => {
  return (req, _res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));
      
      return next(new APIError(
        `Validation failed: ${validationErrors.map(e => e.message).join(', ')}`,
        400
      ));
    }
    
    next();
  };
};

// Success response helper
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  res.status(statusCode).json(response);
};

// Pagination helper
const paginate = (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};

export {
  APIError,
  globalErrorHandler,
  asyncHandler,
  notFoundHandler,
  validateRequest,
  sendSuccess,
  paginate,
  logError
};
