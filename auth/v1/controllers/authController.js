const bcrypt = require('bcryptjs');
const { phone: phoneValidator } = require('phone');
const jwt = require('jsonwebtoken');
const {
  getUserByEmail,
  getUserByUsername,
  getRefreshToken,
  createUser,
  createAccessToken,
  createRefreshToken,
  deleteAccessToken,
  deleteRefreshToken,
  updateLastLogin,
  getUserByPhone
} = require('../models/userModel');
require('dotenv').config();

const generateToken = (user, expiresIn) => {
  return jwt.sign({ id: user.id, role: user.role || 'user' }, process.env.JWT_SECRET, { expiresIn });
};

const register = async (req, res, next) => {
  const { username, email, password, phone, prefix, passcode } = req.body;
  try {
    if (email) {
      const existingEmail = await getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: [{ field: 'email', message: 'Email already exists' }],
        });
      }
    }

    if (phone && prefix) {

      const { isValid, phoneNumber } = await phoneValidator(`+(${prefix})${phone}`)
      
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: [{ field: 'phone', message: 'Not a phone format' }],
        });
      }


      const existingPhone = await getUserByPhone(phoneNumber);


      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: [{ field: 'phone', message: 'Phone number already exists' }],
        });
      }
    }
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await createUser(username, email, phoneValidator(`+(${prefix})${phone}`).phoneNumber, hashedPassword, passcode);

    console.log(user)
    const accessToken = generateToken(user, '15m');
    const refreshToken = generateToken(user, '7d');
    const createdAt = new Date();
    const accessTokenExpiresAt = new Date(createdAt.getTime() + 15 * 60 * 1000); // 15 minutes
    const refreshTokenExpiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await createAccessToken(user.id, accessToken, accessTokenExpiresAt);
    await createRefreshToken(user.id, refreshToken, refreshTokenExpiresAt);
    await updateLastLogin(user.id);
    // Set the refresh token in an HttpOnly, Secure cookie with SameSite=Lax


    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        accessToken,
        refreshToken,
        createdAt: createdAt.getTime(),
        accessTokenExpiresAt: accessTokenExpiresAt.getTime(),
        refreshTokenExpiresAt:refreshTokenExpiresAt.getTime()
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, phone, password, passcode, prefix } = req.body;
  try {
    let user;
    if (email) {
      user = await getUserByEmail(email);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Authentication Error',
          errors: [{ field: 'email', message: 'Invalid email or password' }],
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Authentication Error',
          errors: [{ field: 'password', message: 'Invalid email or password' }],
        });
      }
    } else if (phone) {

      console.log(phone)
      const { isValid, phoneNumber } = await phoneValidator(`+(${prefix}) ${phone}`)
      console.log(phoneNumber)
      user = await getUserByPhone(phoneNumber||phone);
      console.log(user)
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Authentication Error',
          errors: [{ field: 'phone', message: 'No such number' }],
        });
      }
      if (passcode !== user.passcode) {
        return res.status(400).json({
          success: false,
          message: 'Authentication Error',
          errors: [{ field: 'passcode', message: 'Invalid phone number or passcode' }],
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Authentication Error',
        errors: [{ field: 'authentication', message: 'Email or phone number is required' }],
      });
    }
    const accessToken = generateToken(user, '15m');
    const refreshToken = generateToken(user, '7d');
    const createdAt = new Date();
    const accessTokenExpiresAt = new Date(createdAt.getTime() + 15 * 60 * 1000); // 15 minutes
    const refreshTokenExpiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await createAccessToken(user.id, accessToken, accessTokenExpiresAt);
    await createRefreshToken(user.id, refreshToken, refreshTokenExpiresAt);
    await updateLastLogin(user.id);
    // Set the refresh token in an HttpOnly, Secure cookie with SameSite=Lax
 
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        createdAt: createdAt.getTime(),
        accessTokenExpiresAt: accessTokenExpiresAt.getTime(),
        refreshTokenExpiresAt:refreshTokenExpiresAt.getTime()

      }
    });
  } catch (error) {
    next(error);
  }
};



const refreshAccessToken = async (req, res, next) => {
  const { token } = req.body;
  console.log(req.headers)
  try {

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication Error',
        error: 'Invalid refresh token'
      });
    }

    if (new Date(token.expires_at) < new Date()) {
      await deleteRefreshToken(token);
      return res.status(401).json({
        success: false,
        message: 'Authentication Error',
        error: 'Refresh token expired'
      });
    }

    const user = { id: token.user_id, role: token.role };
    const accessToken = generateToken(user, '15m');
    const accessTokenExpiresAt = new Date(new Date().getTime() + 15 * 60 * 1000); // 15 minutes

    await createAccessToken(user.id, accessToken, accessTokenExpiresAt);

    res.status(200).json({
      success: true,
      message: 'Access token refreshed',
      data: { accessToken, accessTokenExpiresAt: accessTokenExpiresAt.getTime() }
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    await deleteAccessToken(token);
    res.status(200).json({
      success: true,
      message: 'User logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

const addToBlacklist = async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    await pool.query('INSERT INTO token_blacklist (token) VALUES ($1)', [token]);
    redisClient.setex(token, 3600, 'blacklisted'); // Cache for 1 hour
    res.status(200).json({
      success: true,
      message: 'Token added to blacklist successfully'
    });
  } catch (error) {
    next(error);
  }
};


const dashboard = (req, res) => {
  res.send({
    "success": true,
    "message": "HelloWrold",
    "data": {
      "message": "hello World"
    }
  })
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  dashboard,
  addToBlacklist
};
