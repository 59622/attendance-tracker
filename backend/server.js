require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const attendanceRoutes = require('./routes/attendance');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Database setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Render PostgreSQL
  },
});

// Test database connection
async function testConnection() {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Connected to PostgreSQL database successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Initialize tables (optional)
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        employee_name VARCHAR(100) NOT NULL,
        status VARCHAR(20) NOT NULL,
        date DATE NOT NULL DEFAULT CURRENT_DATE
      );
    `);
    console.log('✅ Attendance table initialized');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/attendance', attendanceRoutes(pool));

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      message: 'Attendance Tracker API is running',
      database: 'PostgreSQL',
      serverTime: result.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Database check failed' });
  }
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Start server
(async function startServer() {
  const connected = await testConnection();
  if (connected) {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } else {
    console.error('Server stopped due to database connection issue');
    process.exit(1);
  }
})();
