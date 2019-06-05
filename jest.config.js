const path = require("path");

module.exports = {
  verbose: true,
  collectCoverage: true,
  testEnvironment: "node",
  transform: {
    "\\.ts$": "ts-jest"
  },
  testMatch: ["**/src/**/__tests__/**/*.spec.[jt]s"],
  moduleFileExtensions: ["ts", "js", "json", "node"]
};
