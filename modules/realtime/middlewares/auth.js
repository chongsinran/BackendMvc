const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (info, callback) => {
  const token = info.req.headers['authorization']?.replace('Bearer ', '');
  if (!token) {
    return callback(new Error('No token, authorization denied'), false);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    info.req.user = decoded; // Attach decoded user to the request
    callback(null, true);
  } catch (error) {
    callback(new Error('Invalid Token, Please Refresh'), false);
  }
};

module.exports = auth;