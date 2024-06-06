const db = require('./db/connection');
const format = require('pg-format');
const seed = require("./db/seed");
const {
    calculateRowScores,
    arrayToStringWithNull,
    createDealerTable,
    getLastRound,
    checkIfGameEnd
} = require("./extensionMethods");
const {ConfusionMatrixForPlayer} = require("./Statistics/ConfusionMatrix");

async function getUsersRepo() {
    const users = await db.query("SELECT * FROM users")
    if(users.rows.length === 0){
        return Promise.reject({status: 404, msg: "Users table not Found"})
    }
    return users.rows;
}

async function getRoundScoresRepo() {
    const scores = await db.query("SELECT * FROM roundsscores ORDER BY roundno ASC")
    return scores.rows;
}

async function getRoundCallsRepo() {
    const calls = await db.query("SELECT * FROM roundsCalls ORDER BY roundno ASC")
    return calls.rows;
}

async function getRoundTricksRepo() {
    const tricks = await db.query("SELECT * FROM roundsTricks")
    return tricks.rows
}

async function postRoundCallRepo(playerObj) {
    const columns = ['player1', 'player2', 'player3', 'player4', 'player5', 'player6'];
    const playerNumber = Object.keys(playerObj)[1]
    console.log("postRoundCallRepo:", playerObj, "-playerObj")
    await checkIfGameEnd({calls: true, tricks: false})

    if (columns.includes(playerNumber)) {
        const callValue = playerObj[playerNumber]
        const roundNo = playerObj.roundNo
        const lastPlayedRound = await getLastRound()
        if (lastPlayedRound.calls === undefined) {
            console.log("First round")
            await db.query(`INSERT INTO roundsCalls (${playerNumber})
                            VALUES (${callValue})`)
        } else if (roundNo <= lastPlayedRound.calls) {
            console.log("Old round")
            await db.query(`UPDATE roundsCalls
                            SET ${playerNumber} = ${callValue}
                            WHERE roundno = ${roundNo}`);
        } else if (roundNo === lastPlayedRound.calls + 1) {
            console.log("New round")
            await db.query(`INSERT INTO roundsCalls (${playerNumber})
                            VALUES (${callValue})`)
        }
    } else {
        return Promise.reject({status: 400, msg: "Not a valid player key"})
    }
}

async function postRoundTrickRepo(playerObj) {
    const columns = ['player1', 'player2', 'player3', 'player4', 'player5', 'player6'];
    const playerNumber = Object.keys(playerObj)[1]
    console.log("postRoundTrickRepo:", playerObj, "-playerObj")
    if (columns.includes(playerNumber)) {
        const trickValue = playerObj[playerNumber]
        const roundNo = playerObj.roundNo
        const lastPlayedRound = await getLastRound()

        if (lastPlayedRound.tricks === undefined) {
            console.log("First round")
            await db.query(`INSERT INTO roundsTricks (${playerNumber})
                            VALUES (${trickValue})`)
        } else if (roundNo <= lastPlayedRound.tricks) {
            console.log("Old round")
            await db.query(`UPDATE roundsTricks
                            SET ${playerNumber} = ${trickValue}
                            WHERE roundno = ${roundNo}`);
        } else if (roundNo === lastPlayedRound.tricks + 1) {
            console.log("New round")
            await db.query(`INSERT INTO roundsTricks (${playerNumber})
                            VALUES (${trickValue})`)
        } else {
            return Promise.reject({status: 400, msg: "Not a valid round"})
        }
    } else {
        return Promise.reject({status: 400, msg: "Not a valid player key"})
    }
}

async function updateScores() {
    console.log("Updating scores")
    const tricksObj = await db.query('SELECT * FROM roundsTricks ORDER BY roundno ASC')
    const callsObj = await db.query('SELECT * FROM roundsCalls ORDER BY roundno ASC')
    const scoresObj = await db.query('SELECT roundno FROM roundsscores ORDER BY roundno DESC LIMIT 1')
    const {rows} = await db.query('SELECT * FROM users')
    await Promise.all([callsObj, tricksObj, scoresObj])

    const tricks = tricksObj.rows
    const calls = callsObj.rows
    const lastScoresRound = scoresObj.rows[0]?.roundno

    const scores = tricks.map((tricksRow, index) => {
        let callsRow = calls[index]
        return calculateRowScores(tricksRow.roundno, callsRow, tricksRow)
    })
    console.log("New scores:", scores)
    const playersString = rows.map((userRow) => `player${userRow.id}`).join(", ")
    const valuesStringArray = scores.map((row) => {
        return arrayToStringWithNull(Object.values(row))
    })
    const rounds = scores.map(row => row.roundno)

    valuesStringArray.map(async (valuesString, index) => {
        try {
            if (rounds[index] <= lastScoresRound) {
                console.log(`UPDATE roundsscores
                             SET (${playersString}) = (${valuesString})
                             WHERE roundno = ${rounds[index]};`)
                await db.query(`UPDATE roundsscores
                                SET (${playersString}) = (${valuesString})
                                WHERE roundno = ${rounds[index]};`)
            } else {
                console.log(`INSERT INTO roundsscores (${playersString})
                             VALUES (${rounds[index]}, ${valuesString})`)
                await db.query(`INSERT INTO roundsscores (roundno, ${playersString})
                                VALUES (${rounds[index]}, ${valuesString})`)
            }
        } catch (ex) {
            return Promise.reject({status: 500, msg: "Error updating scores"})
        }
    })
}

async function postUsersRepo(users) {
    let playersArr = users.map((user) => user.username)
    if (playersArr.length !== 0) {
        console.log("Adding users")
        try {
            await seed(playersArr.length, 1)
            await db.query(format("INSERT INTO users (Username) VALUES %L RETURNING *;",
                playersArr.map((playerName) => [
                    playerName,
                ])
            ))
        } catch (e) {
            console.log(e)
            return Promise.reject({status:500,msg:"Users table not created"})
        }
    }
    console.log("Updating table structure")
    return playersArr
}

async function getGameDealersRepo() {
    const gameDealers = await db.query("SELECT * FROM dealer")
    if(gameDealers.rows.length === 0){
        return Promise.reject({status:404, msg:"Dealer table not found"})
    }
    return gameDealers.rows
}

async function postFirstDealerRepo({firstToDeal}) {
    try {
        await db.query(`DROP TABLE IF EXISTS dealer;`);
        console.log("Dropping existing dealer table")
        const numPlayers = await getUsersRepo()
        await createDealerTable(numPlayers.length, firstToDeal)
    } catch (e) {
        console.log('Error occured while posting first dealer:', e)
        return Promise.reject({status:500,msg:"Dealer table not created"})
    }
    return "Dealer Updated"
}

async function getEndOfGameStatistics(player) {
    try {
        return await ConfusionMatrixForPlayer(player)
    } catch (e) {
        console.log(`Failed to evaluate confusion matrix for player:${player}`, e)
        return Promise.reject({status: 404, msg: "User not Found"})
    }
}

module.exports = {
    getUsersRepo,
    getRoundScoresRepo,
    getRoundCallsRepo,
    updateScores,
    postUsersRepo,
    postRoundCallRepo,
    postRoundTrickRepo,
    getRoundTricksRepo,
    getGameDealersRepo,
    postFirstDealerRepo,
    getLastRound,
    getEndOfGameStatistics
}