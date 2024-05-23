const { RateLimiterMemory } = require('rate-limiter-flexible');

// Define rate limiter for brute force protection
const rateLimiter = new RateLimiterMemory({
  points: 5, // Number of points
  duration: 15 * 60, // Per 15 minutes
  blockDuration: 15 * 60, // Block for 15 minutes after exceeding points
});

const preventBruteForce = (key) => {
  return (req, res, next) => {
    const keyValue = req.body[key];
    if (keyValue) {
      console.log(`Applying brute force protection for key: ${key}, value: ${keyValue}`);

      rateLimiter.consume(keyValue)
        .then(() => {
          console.log('Brute force middleware passed');
          next();
        })
        .catch((err) => {
          console.error('Brute force protection triggered:', err);
          res.status(429).json({
            success: false,
            message: 'Too many failed attempts, please try again later.',
          });
        });
    } else {
      console.log(`No value found for key: ${key}`);
      next();
    }
  };
};

module.exports = preventBruteForce;
