const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "dev";

require("dotenv").config({
    path: `${__dirname}/../.env.${ENV}`,
});


if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("PGDATABASE not set");
} else {
    console.log(`Database set: ${ENV}`)
}

const config =
    ENV === "production"
        ? {
            connectionString: process.env.DATABASE_URL,
            max: 2,
        }
        : {};
const db = new Pool(config)

module.exports = db