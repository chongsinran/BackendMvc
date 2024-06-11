const { body } = require('express-validator');

const sanitizeInputs = [
  body('*').trim().escape()
];

module.exports = sanitizeInputs;
