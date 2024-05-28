const express = require('express');
const { phone } = require('phone');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

// Import routes
const websocketRoutes = require('./realtime/routes/websocketRoutes'); 
const authRoutes = require('./auth/v1/routes/authRoutes');
const errorHandler = require('./auth/v1/middlewares/errorHandler');
const responseFormatter = require('./auth/v1/middlewares/responseFormatter');
const sanitizeInputs = require('./auth/v1/middlewares/sanitize');
const setupSwagger = require('./swagger/config/swaggerConfig');


const initializeWebSocketServer = require('./realtime/config/websocketConfig');
dotenv.config();
const app = express();
const server = http.createServer(app);

const wss = initializeWebSocketServer(server); // Initialize WebSocket server
app.use(cors({
  origin: '*', // Allow all origins (you can restrict this to specific origins)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Use routes

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

app.use(sanitizeInputs);
app.use(responseFormatter);

app.use('/auth', authRoutes);
app.use('/realtime', websocketRoutes); // Add this line
app.use(errorHandler);


setupSwagger(app);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


