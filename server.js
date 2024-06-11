const express = require('express');
const { phone } = require('phone');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
// const { Pool } = require('pg');
require('dotenv').config();
dotenv.config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL
// });



// Import routes
const websocketRoutes = require('./modules/realtime/v1/routes/websocketRoutes');
const authRoutes = require('./modules/auth/v1/routes/authRoutes');



// Global middlewares
const errorHandler = require('./modules/middlewares/errorHandler');
const responseFormatter = require('./modules/middlewares/responseFormatter');
const sanitizeInputs = require('./modules/middlewares/sanitize');
const setupSwagger = require('./swagger/config/swaggerConfig');



// language
const i18next = require("i18next");
const Backend = require('i18next-fs-backend')


//logging
const { join } = require('path')
const { readdirSync, lstatSync } = require('fs')
const Logger = require('./utils/logUtils.js');
const logger = new Logger();



i18next.use(Backend).init({
  // debug: true,
  initImmediate: false,
  fallbackLng: 'en',
  lng: 'en',
  preload: readdirSync(join(__dirname, '/locales')).filter((fileName) => {
    const joinedPath = join(join(__dirname, '/locales'), fileName)
    const isDirectory = lstatSync(joinedPath).isDirectory()
    return isDirectory
  }),
  backend: {
    loadPath: join(__dirname, '/locales/{{lng}}/{{ns}}.json')
  }
}, (err, t) => {
  if (err) return console.error(err)
  console.log('i18next is ready...')
  // console.log(t('welcome', { lng: 'de' }))
})




const initializeWebSocketServer = require('./modules/realtime/v1/config/websocketConfig');
const app = express();
const server = http.createServer(app);
const wss = initializeWebSocketServer(server); // Initialize WebSocket server



app.set('i18next', i18next)
// app.set('pool', pool)

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
app.use(errorHandler);




app.use('/auth', authRoutes);
app.use('/realtime', websocketRoutes); // Add this line


setupSwagger(app);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(i18next.t('Please login', { what: 'i18next', how: 'not great', lng: 'de' }))
  console.log(`Server running on port ${PORT}`);
});
