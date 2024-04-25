const db = require('./db/connection');
const {query} = require("express");
const {SELECT} = require("pg-format/lib/reserved");
const format = require('pg-format');

async function getUsersRepo() {
        const users = await db.query("SELECT * FROM users")
        return users.rows;
}

async function getRoundScoresRepo() {
        const scores = await db.query("SELECT * FROM roundsScores")
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

async function postRoundCallsRepo({player1, player2, player3, player4, player5, player6}) {
       await db.query(`INSERT INTO roundsCalls VALUES (DEFAULT,${player1},${player2},${player3},${player4},${player5},${player6})`)
}

async  function postRoundCallRepo(playerObj) {
        const columns = ['player1', 'player2', 'player3', 'player4', 'player5', 'player6'];
        const playerNumber = Object.keys(playerObj)[1]
        console.log(playerNumber)
        
        if (columns.includes(playerNumber)) {
                const callValue = playerObj[playerNumber]
                const roundNo = playerObj.roundNo
                const lastPlayedRound = await getLastRound()
                if(roundNo <= lastPlayedRound.calls) {
                        console.log("old round", playerNumber, callValue, roundNo)
                        await db.query(`UPDATE roundsCalls SET ${playerNumber} = ${callValue} WHERE roundno = ${roundNo}`);
                } else if (roundNo === lastPlayedRound.calls +1) {
                        console.log("new round")
                        await db.query(`INSERT INTO roundsCalls (${playerNumber}) VALUES (${callValue})`)
                }

        } else {
                return {msd: "Not valid player key"}
        }
}

async function postRoundTricksRepo({player1, player2, player3, player4, player5, player6}) {
        await db.query(`INSERT INTO roundsTricks VALUES (DEFAULT,${player1},${player2},${player3},${player4},${player5},${player6})`)
}

async  function postRoundTrickRepo(playerObj) {
        const columns = ['player1', 'player2', 'player3', 'player4', 'player5', 'player6'];
        const playerNumber = Object.keys(playerObj)[1]

        if (columns.includes(playerNumber)) {
                const trickValue = playerObj[playerNumber]
                const roundNo = playerObj.roundNo
                const lastPlayedRound = await getLastRound()
                if(roundNo <= lastPlayedRound.tricks) {
                        console.log("old round", playerNumber, trickValue, roundNo)
                        await db.query(`UPDATE roundsTricks SET ${playerNumber} = ${trickValue} WHERE roundno = ${roundNo}`);
                } else if (roundNo === lastPlayedRound.tricks +1) {
                        console.log("new round")
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
        const tricks = await db.query('SELECT * FROM roundsTricks ORDER BY roundno DESC LIMIT 1')
        const calls = await db.query('SELECT * FROM roundsCalls ORDER BY roundno DESC LIMIT 1')
        await Promise.all([tricks, calls])
        
        const tricksObj = tricks.rows[0]
        const callsObj = calls.rows[0]
        const scoresObj = {}
        let updatedScores = {}
        
        if(callsObj.roundno == tricksObj.roundno){
                const {rows} = await db.query('SELECT player1, player2, player3, player4, player5, player6 FROM roundsScores ORDER BY roundno DESC LIMIT 1')
                for (const player in callsObj) {
                        if (player !== "roundno"){
                                scoresObj[player] = tricksObj[player]*2
                                if (callsObj[player] === null || tricksObj[player] === null) {
                                     scoresObj[player] = null   
                                }
                                else if (tricksObj[player] == callsObj[player]) {
                                        scoresObj[player] += 10
                                }
                        }
                }
                if(rows[0]){
                        for (const player in scoresObj) {
                                if (scoresObj[player]) {
                                        updatedScores[player] = rows[0][player] + scoresObj[player]
                                } else {
                                        updatedScores[player] = null
                                }
                        }
                } else {
                        updatedScores = {...scoresObj}
                }
                await db.query(`INSERT INTO roundsScores VALUES (DEFAULT,1,${updatedScores.player1},${updatedScores.player2},${updatedScores.player3},${updatedScores.player4},${updatedScores.player5},${updatedScores.player6})`)
                return  {msg: "scores updated"}
        } else {
                return {msg: "Desynced... calls round number doesn't match tricks round"}
        }
}

async function postUsersRepo(users) {
        playersArr = users.map((user)=> user.username)
        if (playersArr.length !== 0){
                await db.query(`DELETE FROM users`)
                await db.query(format("INSERT INTO users (Username) VALUES %L RETURNING *;",
                    playersArr.map((playerName)=> [
                        playerName,
                    ])
                ))
        }
        return playersArr
}

async function getLastRound() {
        const calls = await db.query('SELECT roundNo FROM roundsCalls ORDER BY roundno DESC LIMIT 1')
        const tricks = await db.query('SELECT roundNo FROM roundsTricks ORDER BY roundno DESC LIMIT 1')
        await Promise.all([tricks, calls])
        return {
                calls: calls.rows[0].roundno,
                tricks: tricks.rows[0].roundno
        }
}

module.exports = { getUsersRepo, getRoundScoresRepo, getRoundCallsRepo, postRoundCallsRepo, postRoundTricksRepo, updateScores, checkRoundsSync, postUsersRepo, postRoundCallRepo, postRoundTrickRepo, getRoundTricksRepo }