const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
require("dotenv").config();
const path = require("path");
const initApiRoute = require("./routes/route");
const connectToDB = require("./configs/database.config");
const relationData = require("./configs/relationData");

const swaggerDefinition = {
  info: {
    // API informations (required)
    title: 'API for HA Mart', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'A sample API', // Description (optional)
  },
};
// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  // Note that this path is relative to the current directory from which the Node.js is ran, not the application itself.
  apis: ['./src/routes/*.route.js'],
};
const swaggerSpec = swaggerJsdoc(options);

const app = express();
app.use('/apis-doc', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
connectToDB();
initApiRoute(app);
relationData()
// create sample data
// generateSeed();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
