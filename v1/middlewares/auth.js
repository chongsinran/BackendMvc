const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {


    return res.error('Access Token Error', 'No token, authorization denied', 401);
  }

  try {
    //too heavy
    // const blacklistedToken = await pool.query('SELECT * FROM token_blacklist WHERE token = $1', [token]);
    // if (blacklistedToken.rows.length > 0) {
    //   return res.error('Access Token Error', 'Blacklisted, authorization denied', 401);
    // }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(decoded)
    next();
  } catch (error) {
    

    res.error(error.name||'Access Token Error', error.message||"Invalid Token, Please Refresh", 401);

  }
};

module.exports = auth;
