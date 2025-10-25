const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);

  let error = { ...err };
  error.message = err.message;

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(e => e.message).join(', ');
    error = { statusCode: 400, message };
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Duplicate field value entered';
    error = { statusCode: 400, message };
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const message = 'Invalid reference to related data';
    error = { statusCode: 400, message };
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { statusCode: 401, message };
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { statusCode: 401, message };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
