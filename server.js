const express = require('express');
const {phone} = require('phone');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');


// Import routes
const errorHandler = require('./v1/middlewares/errorHandler');
const responseFormatter = require('./v1/middlewares/responseFormatter');
const sanitizeInputs = require('./v1/middlewares/sanitize');
const setupSwagger = require('./v1/config/swaggerConfig');
const authRoutes = require('./v1/routes/authRoutes');



dotenv.config();

const app = express();





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
app.use(errorHandler);


setupSwagger(app);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
