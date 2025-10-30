const express = require('express');
const cors = require('cors');
const attendanceRoutes = require('./routes/attendance');
const errorHandler = require('./middleware/errorHandler');
const { initializeDatabase, testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database on startup
async function startServer() {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('Failed to connect to database. Please check your MySQL configuration.');
      process.exit(1);
    }

    // Initialize database tables
    await initializeDatabase();
    console.log('Database initialization completed');

    // Routes
    app.use('/api/attendance', attendanceRoutes);

    // Health check route
    app.get('/api/health', (req, res) => {
      res.json({ 
        success: true, 
        message: 'Attendance Tracker API is running',
        database: 'MySQL',
        timestamp: new Date().toISOString()
      });
    });

    // Error handling middleware
    app.use(errorHandler);

    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });

  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();