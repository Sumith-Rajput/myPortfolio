import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration - Allow frontend origin
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Data file path
const DATA_FILE = join(__dirname, 'data.json');

// Verify data.json exists on startup
try {
  const testData = readFileSync(DATA_FILE, 'utf8');
  JSON.parse(testData);
  console.log('✅ data.json file found and valid');
} catch (error) {
  console.error('❌ CRITICAL: data.json file missing or invalid:', error.message);
  console.error('   File path:', DATA_FILE);
  process.exit(1);
}

// Helper function to read data
function readData() {
  try {
    const data = readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return null;
  }
}

// Helper function to write data
function writeData(data) {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing data file:', error);
    return false;
  }
}

// API Routes

// Get all personal information
app.get('/api/personal', (req, res) => {
  const data = readData();
  if (!data) {
    return res.status(500).json({ error: 'Failed to read data' });
  }
  res.json(data.personal);
});

// Get all professional information
app.get('/api/professional', (req, res) => {
  const data = readData();
  if (!data) {
    return res.status(500).json({ error: 'Failed to read data' });
  }
  res.json(data.professional);
});

// Get complete profile (personal + professional)
app.get('/api/profile', (req, res) => {
  const data = readData();
  if (!data) {
    return res.status(500).json({ error: 'Failed to read data' });
  }
  res.json(data);
});

// Get specific personal field
app.get('/api/personal/:field', (req, res) => {
  const data = readData();
  if (!data) {
    return res.status(500).json({ error: 'Failed to read data' });
  }
  const field = req.params.field;
  if (data.personal[field] !== undefined) {
    res.json({ [field]: data.personal[field] });
  } else {
    res.status(404).json({ error: 'Field not found' });
  }
});

// Get skills
app.get('/api/skills', (req, res) => {
  const data = readData();
  if (!data) {
    return res.status(500).json({ error: 'Failed to read data' });
  }
  res.json(data.professional.skills);
});

// Get experience
app.get('/api/experience', (req, res) => {
  const data = readData();
  if (!data) {
    return res.status(500).json({ error: 'Failed to read data' });
  }
  res.json(data.professional.experience);
});

// Get projects
app.get('/api/projects', (req, res) => {
  const data = readData();
  if (!data) {
    return res.status(500).json({ error: 'Failed to read data' });
  }
  res.json(data.professional.projects);
});

// Update personal information
app.put('/api/personal', (req, res) => {
  const data = readData();
  if (!data) {
    return res.status(500).json({ error: 'Failed to read data' });
  }
  data.personal = { ...data.personal, ...req.body };
  if (writeData(data)) {
    res.json({ message: 'Personal information updated', data: data.personal });
  } else {
    res.status(500).json({ error: 'Failed to update data' });
  }
});

// Update professional information
app.put('/api/professional', (req, res) => {
  const data = readData();
  if (!data) {
    return res.status(500).json({ error: 'Failed to read data' });
  }
  data.professional = { ...data.professional, ...req.body };
  if (writeData(data)) {
    res.json({ message: 'Professional information updated', data: data.professional });
  } else {
    res.status(500).json({ error: 'Failed to update data' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio API is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Portfolio API Server', 
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      personal: '/api/personal',
      professional: '/api/professional',
      profile: '/api/profile',
      skills: '/api/skills',
      experience: '/api/experience',
      projects: '/api/projects'
    }
  });
});

// Catch-all for undefined routes (must be last)
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    availableRoutes: [
      '/api/health',
      '/api/personal',
      '/api/professional',
      '/api/profile',
      '/api/skills',
      '/api/experience',
      '/api/projects'
    ]
  });
});

// Process error handlers
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 API endpoints available at /api`);
  console.log(`🌐 Health check: http://0.0.0.0:${PORT}/api/health`);
  console.log(`✅ Server ready to accept connections`);
  console.log(`📁 Working directory: ${process.cwd()}`);
  console.log(`📁 Data file: ${DATA_FILE}`);
});

server.on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`   Port ${PORT} is already in use`);
  }
  process.exit(1);
});

