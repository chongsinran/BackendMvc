const express = require('express');
const { body } = require('express-validator');
const { 
  register, 
  login, 
  refreshAccessToken, 
  dashboard, 
  logout,
  addToBlacklist  } = require('../controllers/authController');
const auth = require('../middlewares/auth');
const errorFormatter = require('../middlewares/errorFormatter');
const roleMiddleware = require('../middlewares/roleMiddleware');
const sanitizeInputs = require('../middlewares/sanitize');
const responseFormatter = require('../middlewares/responseFormatter');
const router = express.Router();
const loginLimiter = require('../middlewares/rateLimiter');
const preventbrute  = require('../middlewares/bruteForceProtection');


const registerValidation = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').optional().isEmail().withMessage('Email must be valid'),
    body('phone').optional().isMobilePhone().withMessage('Phone number must be valid'),
    body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('passcode').optional().isLength({ min: 6, max: 6 }).withMessage('Passcode must be 6 characters long'),
];

const loginValidation = [
  body('email').optional().isEmail().withMessage('Email must be valid'),
  body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('phone').optional().isMobilePhone().withMessage('Phone number must be valid'),
  body('passcode').optional().isLength({ min: 6, max: 6 }).withMessage('Passcode must be 6 characters long')
];
router.post('/register',sanitizeInputs, registerValidation, errorFormatter, register);
router.post('/login',sanitizeInputs,loginValidation, preventbrute ('email'),preventbrute ('phone'),errorFormatter, login);
router.post('/refresh-token', errorFormatter, refreshAccessToken);
router.post('/logout', auth, logout);
router.post('/add-to-blacklist', sanitizeInputs, [
  body('token').exists().withMessage('Token is required')
], errorFormatter, addToBlacklist);
router.get('/dashboard', auth,  roleMiddleware('admin'),errorFormatter,responseFormatter, dashboard);

module.exports = router;






