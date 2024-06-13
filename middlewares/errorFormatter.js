const { validationResult } = require('express-validator');

const errorFormatter = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: formattedErrors
    });
  }
  next();
};

module.exports = errorFormatter;
