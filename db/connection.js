const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

const pathToCorrectEnvFile = `${__dirname}/../.env.${ENV}`;

const config = {};

require("dotenv").config({
  path: pathToCorrectEnvFile,
});

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

module.exports = new Pool(config);
