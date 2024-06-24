const { Pool } = require("pg");
const {readFileSync} = require("fs");
const ENV = process.env.NODE_ENV || "production";

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
            ssl: {
                ca: readFileSync('./db/ca.crt').toString(),
            }
        }
        : {};
const db = new Pool(config)

async function testQuery() {
    const client = await db.connect();
    try {
        return response = await client.query('SELECT 1');
    } finally {
        client.release();
    }
}

testQuery().then(r => console.log("Test query:", r.rows[0]['?column?']));

module.exports = db