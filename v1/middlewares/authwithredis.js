const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();
const redis = require('redis');


require('dotenv').config();


const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {


    return res.error('Access Token Error', 'No token, authorization denied', 401);
  }

  try {
    redisClient.get(token, async (err, reply) => {
      if (err) {
        console.error('Redis error:', err);
        return res.status(500).json({
          success: false,
          message: 'Server Error',
          error: 'Failed to check token blacklist'
        });
      }

      if (reply) {
        return res.status(401).json({
          success: false,
          message: 'Authentication Error',
          error: 'Invalid token'
        });
      }

      // Check if the token is blacklisted in the database
      const blacklistedToken = await pool.query('SELECT * FROM token_blacklist WHERE token = $1', [token]);
      if (blacklistedToken.rows.length > 0) {
        // Add the token to Redis cache
        redisClient.setex(token, 3600, 'blacklisted'); // Cache for 1 hour
        return res.status(401).json({
          success: false,
          message: 'Authentication Error',
          error: 'Invalid token'
        });
      }


      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log(decoded)
      next();
    })
  
  } catch (error) {
    

    res.error(error.name||'Access Token Error', error.message||"Invalid Token, Please Refresh", 401);

  }
};

module.exports = auth;
