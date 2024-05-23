const responseFormatter = (req, res, next) => {
    res.success = (data, message = 'Success', statusCode = 200) => {
      res.status(statusCode).json({
        success: true,
        message,
        data
      });
    };
  
    res.error = (error, message = 'Error', statusCode = 500) => {
      res.status(statusCode).json({
        success: false,
        message,
        error: error.message || error
      });
    };
  
    next();
  };
  
  module.exports = responseFormatter;
  