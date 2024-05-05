const format = require('pg-format');
const db = require('./connection.js');
const {createDealerTable} = require("../extensionMethods");

const seed = async (numPlayers,firstToDeal) => {
    console.log("Seeding database")
    try {
    await db.query(`DROP TABLE IF EXISTS roundsScores;`);
    await db.query(`DROP TABLE IF EXISTS roundsCalls;`);
    await db.query(`DROP TABLE IF EXISTS roundsTricks;`);
    await db.query(`DROP TABLE IF EXISTS users;`);
    await db.query(`DROP TABLE IF EXISTS dealer;`);
    console.log("Dropping existing tables")

    let playersQuery = '';
    for (let i = 1; i <= numPlayers; i++) {
        playersQuery += `, player${i} INT`;
    }    
    const usersTablePromise = db.query(`
        CREATE TABLE users
        (
            Id SERIAL primary key,
            Username varchar
        )`)
        console.log("Creating users Table")
        
    const callsTablePromise = db.query(`
        CREATE TABLE roundsCalls
        (
            roundNo SERIAL PRIMARY KEY
            ${playersQuery}
        )`)
        console.log("Creating roundCalls Table")
        
    const tricksTablePromise = db.query(`
        CREATE TABLE roundsTricks
        (
            roundNo SERIAL PRIMARY KEY
            ${playersQuery}
        )`)
        console.log("Creating roundsTricks Table")
        
    await Promise.all([usersTablePromise, callsTablePromise, tricksTablePromise]);
    
    await db.query(`
        CREATE TABLE roundsScores
        (
            roundNo SERIAL PRIMARY KEY
            ${playersQuery}
        )`)
        console.log("Creating roundsScores Table")
        
    await createDealerTable(numPlayers, firstToDeal)
    }
    catch(ex) {
        throw ex
    }
};

module.exports = seed;