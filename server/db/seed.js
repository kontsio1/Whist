const format = require('pg-format');
const db = require('./connection.js');

const seed = async (numPlayers) => {
    await db.query(`DROP TABLE IF EXISTS roundsScores;`);
    await db.query(`DROP TABLE IF EXISTS roundsCalls;`);
    await db.query(`DROP TABLE IF EXISTS roundsTricks;`);
    await db.query(`DROP TABLE IF EXISTS users;`);

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
    
    const callsTablePromise = db.query(`
        CREATE TABLE roundsCalls
        (
            roundNo SERIAL PRIMARY KEY
            ${playersQuery}
        )`)

    const tricksTablePromise = db.query(`
        CREATE TABLE roundsTricks
        (
            roundNo SERIAL PRIMARY KEY
            ${playersQuery}
        )`)
    
    await Promise.all([usersTablePromise, callsTablePromise, tricksTablePromise]);

    const roundsScoreTablePromise = db.query(`
        CREATE TABLE roundsScores
        (
            roundNo SERIAL PRIMARY KEY
            dealer  INT,
            ${playersQuery}
        )`)
};
    //inserting data - delete later?
    // const insertUsersQueryStr = format(
    //     "INSERT INTO users ( Username ) VALUES %L RETURNING *;",
    //     data.userData.map(({username}) => [
    //         username,
    //     ])
    // );

    // const insertRoundsData = format(
    //     "INSERT INTO roundsscores ( dealer, player1, player2, player3, player4, player5, player6 ) VALUES %L RETURNING *;",
    //     data.rounds.map(({dealer, player1, player2, player3, player4, player5, player6}) => [
    //         dealer, player1, player2, player3, player4, player5, player6
    //     ]) 
    // )

    // const usersPromise = db
    //     .query(insertUsersQueryStr)
    //     .then((result) => result.rows);
    
    // const roundsPromise = db
    //     .query(insertRoundsData)
    //     .then((result) => result.rows);
 
    // await Promise.all([usersPromise, roundsPromise]);
    // await Promise.all([usersPromise]);

module.exports = seed;