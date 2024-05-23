const fs = require('fs');
const path = require('path');

const featureName = process.argv[2];

if (!featureName) {
  console.error('Please provide a feature name:');
  console.log('\     ');
  console.log('\            Example: \x1b[36m%s\x1b[0m', '- node generateFeature.js newFeaturesName');
  process.exit(1);
}

const featureFileName = `${featureName}.js`;
const swaggerFileName = `${featureName}.swagger.js`;
const controllerFileName = `${featureName}Controller.js`;
const modelFileName = `${featureName}Model.js`;

const routesDir = path.join(__dirname, 'v1', 'routes');
const controllersDir = path.join(__dirname, 'v1', 'controllers');
const modelsDir = path.join(__dirname, 'v1', 'models');
const serverFilePath = path.join(__dirname, 'server.js');

// Function to capitalize the first letter of the feature name
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Check if feature name clashes
if (
  fs.existsSync(path.join(routesDir, featureFileName)) ||
  fs.existsSync(path.join(routesDir, swaggerFileName)) ||
  fs.existsSync(path.join(controllersDir, controllerFileName)) ||
  fs.existsSync(path.join(modelsDir, modelFileName))
) {
  console.error(`Feature name "${featureName}" clashes with existing files. Please choose a different name.`);
  process.exit(1);
}

// Template for the route file
const routeTemplate = `
const express = require('express');
const { body } = require('express-validator');
const ${featureName}Controller = require('../controllers/${featureName}Controller');
const auth = require('../middlewares/auth');
const errorFormatter = require('../middlewares/errorFormatter');
const router = express.Router();

router.post('/${featureName}', [
  body('exampleField').isString().withMessage('Example field must be a string')
], auth, errorFormatter, ${featureName}Controller.handle${capitalizeFirstLetter(featureName)});

module.exports = router;
`;

// Template for the Swagger file
const swaggerTemplate = `
/**
 * @swagger
 * /api/${featureName}:
 *   post:
 *     summary: Description of the ${featureName} feature
 *     tags: [${capitalizeFirstLetter(featureName)}]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               exampleField:
 *                 type: string
 *                 description: Example field
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
`;

// Template for the controller file
const controllerTemplate = `
const { exampleFunction } = require('../models/${featureName}Model');

const handle${capitalizeFirstLetter(featureName)} = async (req, res, next) => {
  try {
    const { exampleField } = req.body;

    // Add your business logic here
    const result = await exampleFunction(exampleField);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handle${capitalizeFirstLetter(featureName)}
};
`;

// Template for the model file
const modelTemplate = `
const exampleFunction = async (exampleField) => {
  // Implement your model logic here
  return { exampleField };
};

module.exports = {
  exampleFunction
};
`;

// Create route file
fs.writeFileSync(path.join(routesDir, featureFileName), routeTemplate.trim());
console.log(`Created ${featureFileName} in routes directory`);

// Create Swagger file
fs.writeFileSync(path.join(routesDir, swaggerFileName), swaggerTemplate.trim());
console.log(`Created ${swaggerFileName} in routes directory`);

// Create controller file
fs.writeFileSync(path.join(controllersDir, controllerFileName), controllerTemplate.trim());
console.log(`Created ${controllerFileName} in controllers directory`);

// Create model file
fs.writeFileSync(path.join(modelsDir, modelFileName), modelTemplate.trim());
console.log(`Created ${modelFileName} in models directory`);

// Update server.js to include the new route and swagger file
let serverFileContent = fs.readFileSync(serverFilePath, 'utf8');

const routeImport = `const ${featureName}Routes = require('./v1/routes/${featureName}');\n`;
const swaggerImport = `require('./v1/routes/${featureName}.swagger.js');\n`;

const routeImportRegex = /\/\/ Import routes/;
const swaggerImportRegex = /\/\/ Import swagger/;
const routeUseRegex = /\/\/ Use routes/;

if (!serverFileContent.includes(routeImport)) {
  if (routeImportRegex.test(serverFileContent)) {
    serverFileContent = serverFileContent.replace(routeImportRegex, `// Import routes\n${routeImport}`);
    console.log(`Added route import to server.js`);
  } else {
    console.error("Couldn't find the '// Import routes' placeholder in server.js");
  }
}



const routeUse = `app.use('/api', ${featureName}Routes);`;
if (!serverFileContent.includes(routeUse)) {
  if (routeUseRegex.test(serverFileContent)) {
    serverFileContent = serverFileContent.replace(routeUseRegex, `// Use routes\n${routeUse}`);
    console.log(`Added route use to server.js`);
  } else {
    console.error("Couldn't find the '// Use routes' placeholder in server.js");
  }
}

fs.writeFileSync(serverFilePath, serverFileContent);
console.log(`Updated server.js to use ${featureFileName} and ${swaggerFileName}`);
