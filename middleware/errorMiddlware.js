function errorHandler(err, req, res, next) {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || 'An unexpected error occurred.',
    });
  }
  
module.exports = errorHandler;
  