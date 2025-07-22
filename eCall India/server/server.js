let app;

import { configureCloudinary } from './config/cloudinary.js';

// Dynamically import app after dotenv has loaded environment variables
import('./app.js').then(module => {
  app = module.default;
  configureCloudinary();
  startServer();
}).catch(error => {
  console.error('Failed to load app:', error);
  process.exit(1);
});

let serverInstance;

function startServer() {
  const PORT = process.env.PORT || 3001;

  serverInstance = app.listen(PORT, () => {
  console.log(`🌐 eCall India API Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  console.log('🚨 Emergency Response System Ready');
});

// Handle server errors
serverInstance.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  switch (error.code) {
    case 'EACCES':
      console.error(`❌ ${bind} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`❌ ${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
});

}

export default serverInstance;