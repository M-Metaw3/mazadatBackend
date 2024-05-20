const AppError = require('../../utils/appError');

const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof AppError) {
    // If the error is an instance of AppError (custom error), send the appropriate response
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    // Handle Multer file size limit exceeded error
    const fileSizeError = new AppError('File size limit exceeded. Please upload a smaller image less than 5MB', 400);
    res.status(fileSizeError.statusCode).json({
      status: fileSizeError.status,
      message: fileSizeError.message,
    });
  } else {
    // For other errors, send a generic error response
    const genericError = new AppError('Something went wrong!', 500);
    res.status(genericError.statusCode).json({
      status: genericError.status,
      message: genericError.message,
    });
  }
};

module.exports = handleMulterErrors;
