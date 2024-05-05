const db = require('./db/connection');
const format = require('pg-format');
const seed = require("./db/seed");
const {calculateRowScores, arrayToStringWithNull} = require("./extensionMethods");

async function getUsersRepo() {
        const users = await db.query("SELECT * FROM users")
        return users.rows;
}

async function getRoundScoresRepo() {
        const scores = await db.query("SELECT * FROM roundsScores ORDER BY roundno ASC")
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
async  function postRoundCallRepo(playerObj) {
        const columns = ['player1', 'player2', 'player3', 'player4', 'player5', 'player6'];
        const playerNumber = Object.keys(playerObj)[1]
        console.log("postRoundCallRepo:", playerObj, "-playerObj")
        
        if (columns.includes(playerNumber)) {
                const callValue = playerObj[playerNumber]
                const roundNo = playerObj.roundNo
                const lastPlayedRound = await getLastRound()
                if (lastPlayedRound.calls===undefined) {
                        console.log("First round")
                        await db.query(`INSERT INTO roundsCalls (${playerNumber}) VALUES (${callValue})`)
                } else if(roundNo <= lastPlayedRound.calls) {
                        console.log("Old round")
                        await db.query(`UPDATE roundsCalls SET ${playerNumber} = ${callValue} WHERE roundno = ${roundNo}`);
                } else if (roundNo === lastPlayedRound.calls +1) {
                        console.log("New round")
                        await db.query(`INSERT INTO roundsCalls (${playerNumber}) VALUES (${callValue})`)
                }
        } else {
                return {msd: "Not valid player key"}
        }
}
async  function postRoundTrickRepo(playerObj) {
        const columns = ['player1', 'player2', 'player3', 'player4', 'player5', 'player6'];
        const playerNumber = Object.keys(playerObj)[1]
        console.log("postRoundTrickRepo:", playerObj, "-playerObj")
        if (columns.includes(playerNumber)) {
                const trickValue = playerObj[playerNumber]
                const roundNo = playerObj.roundNo
                const lastPlayedRound = await getLastRound()
                
                if (lastPlayedRound.tricks===undefined) {
                        console.log("First round")
                        await db.query(`INSERT INTO roundsTricks (${playerNumber}) VALUES (${trickValue})`)
                } else if(roundNo <= lastPlayedRound.tricks) {
                        console.log("Old round")
                        await db.query(`UPDATE roundsTricks SET ${playerNumber} = ${trickValue} WHERE roundno = ${roundNo}`);
                } else if (roundNo === lastPlayedRound.tricks +1) {
                        console.log("New round")
                        await db.query(`INSERT INTO roundsTricks (${playerNumber}) VALUES (${trickValue})`)
                } else {
                        return {msg: "Not valid round"}   
                }
        } else {
                return {msg: "Not valid player key"}
        }
}
async function checkRoundsSync({calls, tricks}) {
        const lastRoundNoCall = await db.query('SELECT roundNo FROM roundsCalls ORDER BY roundno DESC LIMIT 1')
        const lastRoundNoTrick = await db.query('SELECT roundNo FROM roundsTricks ORDER BY roundno DESC LIMIT 1')
        if (calls){
                console.log('checking calls')
                if(!(lastRoundNoCall.rows[0] && lastRoundNoTrick.rows[0])) {
                        return true
                } else return lastRoundNoCall.rows[0].roundno === lastRoundNoTrick.rows[0].roundno;
        }
        if (tricks){
                console.log('checking tricks')
                if(!(lastRoundNoCall.rows[0] && lastRoundNoTrick.rows[0])) {
                        return true
                } else return (lastRoundNoCall.rows[0].roundno - 1) === lastRoundNoTrick.rows[0].roundno;
        }
        console.log('not checking')
        return false
}
async function updateScores(){
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
        console.log("New scores:",scores)
        const playersString = rows.map((userRow)=> `player${userRow.id}`).join(", ")
        const valuesStringArray = scores.map((row)=>{
                return arrayToStringWithNull( Object.values(row) )
        })
        const rounds = scores.map(row => row.roundno)
        
        console.log(playersString, valuesStringArray, rounds)
        valuesStringArray.map(async(valuesString, index)=>{
                try {
                        if(rounds[index] <= lastScoresRound) {
                                console.log(`UPDATE roundsscores SET (${playersString}) = (${valuesString}) WHERE roundno = ${rounds[index]};`)
                                await db.query(`UPDATE roundsscores SET (${playersString}) = (${valuesString}) WHERE roundno = ${rounds[index]};`)
                        } else {
                                console.log(`INSERT INTO roundsscores (${playersString}) VALUES (${rounds[index]}, ${valuesString})`)
                                await db.query(`INSERT INTO roundsscores (roundno,${playersString}) VALUES (${rounds[index]}, ${valuesString})`)
                        }
                }
                catch (ex) {
                        console.log("Error updating scores",ex)
                }
        })
}
async function postUsersRepo(users) {
        playersArr = users.map((user)=> user.username)
        if (playersArr.length !== 0){
                console.log("Adding users")
                try {
                        await seed(playersArr.length, 2) //first to play change later
                        await db.query(format("INSERT INTO users (Username) VALUES %L RETURNING *;",
                            playersArr.map((playerName)=> [
                                playerName,
                            ])
                        ))
                } catch (e) {
                        console.log(e)
                }
        }
        console.log("Updating table structure")
        return playersArr
}
async function getLastRound() {
        const calls = await db.query('SELECT roundNo FROM roundsCalls ORDER BY roundno DESC LIMIT 1')
        const tricks = await db.query('SELECT roundNo FROM roundsTricks ORDER BY roundno DESC LIMIT 1')
        await Promise.all([tricks, calls])
        return { 
                calls: calls.rows.length!==0? calls.rows[0].roundno : undefined, 
                tricks: tricks.rows.length!==0? tricks.rows[0].roundno : undefined,
        }
}

module.exports = { getUsersRepo, getRoundScoresRepo, getRoundCallsRepo, updateScores, checkRoundsSync, postUsersRepo, postRoundCallRepo, postRoundTrickRepo, getRoundTricksRepo }