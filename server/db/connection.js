const { Pool } = require("pg");
const {readFileSync} = require("fs");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
    path: `${__dirname}/../.env.${ENV}`,
});


if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    console.log(process.env.NODE_ENV, process.env.PGDATABASE, process.env.DATABASE_URL)
    throw new Error("PGDATABASE not set");
} else {
    console.log(`Database set: ${ENV}`)
}

const config =
    ENV === "production"
        ? {
            connectionString: process.env.DATABASE_URL,
            max: 2,
            ssl: {
                ca: readFileSync('./db/ca.crt').toString(),
            }
        }
        : {};
const db = new Pool(config)
console.log(`Database url:${process.env.DATABASE_URL}`)

module.exports = db