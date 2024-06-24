const express = require('express')
const bodyParser = require('body-parser');
const {getUsers, getRoundScores, getRoundCalls, postRoundCalls, postRoundScores, postRoundTricks, getScores, postUsers,
    postRoundCall, postRoundTrick, getRoundTricks, getGameDealers, postFirstToDeal, getEndOfGameInfo
} = require("./Handler");
const {handleWrongPath, handleNotFoundErrors, handleCustomErrors, finalHandleErrors} = require("./errorHandlers");

const app = express()
// const port = 8080

const { port = 8080 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log("App.js executing:")
    console.log(`Whist server listening on port ${port}`)
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/users', getUsers)
app.post('/users', postUsers)

app.get('/scores', getRoundScores)

app.get('/calls', getRoundCalls)
app.post('/call', postRoundCall)

app.post('/trick', postRoundTrick)
app.get('/tricks', getRoundTricks)

app.get('/dealer', getGameDealers)
app.post('/dealer', postFirstToDeal)

app.get('/stats/:player', getEndOfGameInfo);

app.get('*', handleWrongPath);

app.use(handleCustomErrors)

app.use(handleCustomErrors)

app.use(finalHandleErrors)