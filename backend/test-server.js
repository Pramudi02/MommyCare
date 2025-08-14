const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'MommyCare API is running (test mode)',
    timestamp: new Date().toISOString(),
    environment: 'test'
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is working!',
    endpoints: [
      '/health',
      '/api/auth/register',
      '/api/auth/login',
      '/api/mom/profile',
      '/api/doctor/dashboard',
      '/api/service-provider/dashboard'
    ]
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 MommyCare Test Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API test: http://localhost:${PORT}/api/test`);
});
