const { Pool } = require('pg');

// PostgreSQL database configuration - hardcoded for now
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '123456', // Change this to your PostgreSQL password
  database: 'attendance_tracker',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Initialize database and table
async function initializeDatabase() {
  try {
    // Create attendance table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        employeeName VARCHAR(255) NOT NULL,
        employeeID VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        status VARCHAR(20) CHECK (status IN ('Present', 'Absent')) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_attendance UNIQUE (employeeID, date)
      )
    `);
    
    console.log('PostgreSQL database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    throw error;
  }
}

// Test database connection
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database successfully');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.log('Please make sure:');
    console.log('1. PostgreSQL is running');
    console.log('2. Database "attendance_tracker" exists');
    console.log('3. Username and password are correct');
    return false;
  }
}

module.exports = { pool, initializeDatabase, testConnection };