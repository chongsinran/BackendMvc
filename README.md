# BENTO MVC Backend Boilerplate

PostgreSQL, NodeJS, Express, JWT Auth with Cookies Session Refresh Token

```
.
├── .env
├── .gitignore
├── drawDirectory.js
├── generateFeature.js
├── package-lock.json
├── package.json
├── postgresQuery.sql
├── server.js
└── v1
    ├── config
    │   └── swaggerConfig.js
    ├── controllers
    │   └── authController.js
    ├── middlewares
    │   ├── auth.js
    │   ├── authwithredis.js
    │   ├── bruteForceProtection.js
    │   ├── errorFormatter.js
    │   ├── errorHandler.js
    │   ├── rateLimiter.js
    │   ├── responseFormatter.js
    │   ├── roleMiddleware.js
    │   └── sanitize.js
    ├── models
    │   └── userModel.js
    ├── routes
    │   ├── authRoutes.js
    │   └── authRoutes.swagger.js
    └── views
        └── index.ejs
```


## Installation

Use the package manager [npm](https://nodejs.org/en) to install structure after git clone.

```bash
npm i 
```

## Usage
Change the .env to to fit your own posgreSQL setting

Create Tables in your database

```sql


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15) UNIQUE,
    password VARCHAR(255),
    passcode VARCHAR(6),
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE access_tokens (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE TABLE token_blacklist (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    blacklisted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



```

## Summary of Steps: 
### generateFeature.js Scripts will auto generate the file with imported routes boilerplate into the correct directory and formated naming base on MVC standards 

```
node generateFeature.js newFeature
```

   1. Define the Feature Requirements: Document expected inputs, outputs, and behavior.

   2. Create the Model: Define the data structure and database interactions.

   3. Create the Controller: Handle business logic and interact with the model.

   4. Create the Route: Define the API endpoint and link it to the controller function

   5. Add in middlewares into the routes:
        e.g router.post('/feature',auth, errorFormatter, featureController.handleFeature);

   6. Create the Swagger Documentation: Document the API endpoint.

   7. Update server.js: Import and use the new route and Swagger documentation.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
CodeBento 2024
