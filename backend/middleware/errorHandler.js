function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  if (err.message.includes('Attendance already recorded')) {
    return res.status(409).json({
      success: false,
      error: err.message
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
}

module.exports = errorHandler;