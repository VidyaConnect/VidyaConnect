const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()}`, err);

  if (err.code === 'P2002') {
    return res.status(409).json({ 
      success: false, 
      message: 'Record already exists' 
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ 
      success: false, 
      message: 'Record not found' 
    });
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
};

module.exports = errorHandler;