const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");

const welcomeSource = fs.readFileSync(
  path.resolve(__dirname, "./welcome.handlebars"),
  "utf8"
);
const workerSource = fs.readFileSync(
  path.resolve(__dirname, "./worker.handlebars"),
  "utf8"
);

const welcomeEmailTemplate = handlebars.compile(welcomeSource);
const workerEmailTemplate = handlebars.compile(workerSource);

module.exports = { welcomeEmailTemplate, workerEmailTemplate };
