// realtime/routes/websocketRoutes.js

const express = require('express');
const router = express.Router();
const websocketController = require('../controllers/websocketController');

router.post('/subscribe', websocketController.subscribe);

module.exports = router;
