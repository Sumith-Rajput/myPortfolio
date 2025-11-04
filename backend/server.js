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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});

