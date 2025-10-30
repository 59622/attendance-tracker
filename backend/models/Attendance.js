const { pool } = require('../config/database');

class Attendance {
  static async create(attendanceData) {
    const client = await pool.connect();
    try {
      const { employeeName, employeeID, date, status } = attendanceData;
      const sql = `
        INSERT INTO attendance (employeeName, employeeID, date, status) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *
      `;
      
      const result = await client.query(sql, [employeeName, employeeID, date, status]);
      
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Attendance already recorded for this employee on the selected date');
      }
      throw error;
    } finally {
      client.release();
    }
  }

  static async getAll() {
    try {
      const sql = `SELECT * FROM attendance ORDER BY date DESC, timestamp DESC`;
      const result = await pool.query(sql);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getByFilters(filters) {
    try {
      let sql = `SELECT * FROM attendance WHERE 1=1`;
      const params = [];
      let paramCount = 0;

      if (filters.date) {
        paramCount++;
        sql += ` AND date = $${paramCount}`;
        params.push(filters.date);
      }

      if (filters.employeeName) {
        paramCount++;
        sql += ` AND employeeName ILIKE $${paramCount}`;
        params.push(`%${filters.employeeName}%`);
      }

      if (filters.employeeID) {
        paramCount++;
        sql += ` AND employeeID ILIKE $${paramCount}`;
        params.push(`%${filters.employeeID}%`);
      }

      sql += ` ORDER BY date DESC, timestamp DESC`;

      const result = await pool.query(sql, params);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const sql = `DELETE FROM attendance WHERE id = $1 RETURNING *`;
      const result = await pool.query(sql, [id]);
      
      return { deleted: result.rowCount };
    } catch (error) {
      throw error;
    }
  }

  // Additional method to get attendance statistics
  static async getStats() {
    try {
      const sql = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present,
          SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent
        FROM attendance
      `;
      const result = await pool.query(sql);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Attendance;