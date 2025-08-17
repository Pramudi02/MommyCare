// Test script to verify server startup in production mode
require('dotenv').config();

console.log('🧪 Testing MommyCare Backend Production Startup...');
console.log('📊 Environment Variables:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  PORT:', process.env.PORT);
console.log('  MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not Set');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Not Set');

// Test if we can require the server
try {
  console.log('\n🔌 Testing server module import...');
  const { app } = require('./src/server');
  console.log('✅ Server module imported successfully');
  
  // Test health endpoint
  const request = require('supertest');
  const server = app.listen(0, () => {
    const port = server.address().port;
    console.log(`🚀 Test server running on port ${port}`);
    
    request(app)
      .get('/health')
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.error('❌ Health check failed:', err.message);
        } else {
          console.log('✅ Health check passed:', res.body);
        }
        
        request(app)
          .get('/api/health')
          .expect(200)
          .end((err2, res2) => {
            if (err2) {
              console.error('❌ Railway health check failed:', err2.message);
            } else {
              console.log('✅ Railway health check passed:', res2.body);
            }
            
            server.close(() => {
              console.log('\n🎉 All tests completed!');
              process.exit(0);
            });
          });
      });
  });
  
} catch (error) {
  console.error('❌ Failed to import server:', error.message);
  console.error('🔍 Error details:', error);
  process.exit(1);
}
