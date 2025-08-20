const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

console.log('🚀 Starting simple test server...');

// Basic middleware
app.use(express.json());

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Simple server working' });
});

// Railway health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Simple server working' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Simple test server running' });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Simple server running on port ${port}`);
  console.log(`🔗 Health: http://localhost:${port}/health`);
  console.log(`🔗 API Health: http://localhost:${port}/api/health`);
});

// Error handling
app.on('error', (err) => {
  console.error('❌ Server error:', err);
});
