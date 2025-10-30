const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// GET all attendance records
router.get('/', async (req, res, next) => {
  try {
    const { date, employeeName, employeeID } = req.query;
    
    let records;
    if (date || employeeName || employeeID) {
      records = await Attendance.getByFilters({ date, employeeName, employeeID });
    } else {
      records = await Attendance.getAll();
    }
    
    res.json({
      success: true,
      data: records,
      count: records.length
    });
  } catch (error) {
    next(error);
  }
});

// GET attendance statistics
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await Attendance.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

// POST new attendance record
router.post('/', async (req, res, next) => {
  try {
    const { employeeName, employeeID, date, status } = req.body;

    // Validation
    if (!employeeName || !employeeID || !date || !status) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    if (!['Present', 'Absent'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be either "Present" or "Absent"'
      });
    }

    const record = await Attendance.create({
      employeeName,
      employeeID,
      date,
      status
    });

    res.status(201).json({
      success: true,
      message: 'Attendance recorded successfully',
      data: record
    });
  } catch (error) {
    next(error);
  }
});

// DELETE attendance record
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Attendance.delete(id);
    
    if (result.deleted === 0) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }

    res.json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;