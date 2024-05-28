const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
      if (req.user.role !== requiredRole) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Insufficient permissions'
        });
      }
      next();
    };
  };
  
  module.exports = roleMiddleware;
  