const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Get all attendance records
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM attendance ORDER BY id ASC');
      res.json({ success: true, data: result.rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to fetch attendance' });
    }
  });

  // Add a new attendance record
  router.post('/', async (req, res) => {
    const { employee_name, status, date } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO attendance(employee_name, status, date) VALUES($1, $2, $3) RETURNING *',
        [employee_name, status, date || new Date()]
      );
      res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to add attendance' });
    }
  });

  // Update attendance record
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { employee_name, status, date } = req.body;
    try {
      const result = await pool.query(
        'UPDATE attendance SET employee_name=$1, status=$2, date=$3 WHERE id=$4 RETURNING *',
        [employee_name, status, date, id]
      );
      res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to update attendance' });
    }
  });

  // Delete attendance record
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM attendance WHERE id=$1', [id]);
      res.json({ success: true, message: 'Attendance record deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to delete attendance' });
    }
  });

  return router;
};
