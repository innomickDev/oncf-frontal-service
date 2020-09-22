"use strict";

var SwaggerExpress = require("swagger-express-mw");
var app = require("express")();
const auth = require("./api/helpers/auth");
const SwaggerUi = require("swagger-tools/middleware/swagger-ui");
const bodyParser = require("body-parser");
const env = require("dotenv")
const https = require('https');
const fs = require('fs')
const cors = require('cors')
env.config({ path: '.env' })
module.exports = app; // for testing

var config = {
  appRoot: __dirname, // required config
  //middleware for token
  swaggerSecurityHandlers: {
    Bearer: auth.verifyToken
  }
};

SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) {
    throw err;
  }
  app.use(cors());
  app.use(SwaggerUi(swaggerExpress.runner.swagger));
  app.use(bodyParser.json({ limit: 100 * 1024 * 1024 }));


  // install middleware
  swaggerExpress.register(app);

  var port = process.env.port ||
    process.env.API_RUNNING_PORT;


  if (process.env.SERVICE_PATH_CERTIFICATE_KEY && process.env.SERVICE_PATH_CERTIFICATE_BUNDLE) {
    https.createServer({
      cert: fs.readFileSync(process.env.SERVICE_PATH_CERTIFICATE_BUNDLE),
      key: fs.readFileSync(process.env.SERVICE_PATH_CERTIFICATE_KEY),
      passphrase: process.env.SERVICE_PATH_CERTIFICATE_PASSPHRASE,
      ca: fs.readFileSync(process.env.SERVICE_PATH_CERTIFICATE_CA)
    }, app).listen(port, () => {
      console.log('Listening...')
    })
  }
  else {
    app.listen(port);
  }
  if (swaggerExpress.runner.swagger.paths["/"]) {
    console.log("Application started working on port: " + port);
  }
});
