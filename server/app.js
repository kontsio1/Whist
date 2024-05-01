const express = require('express')
const bodyParser = require('body-parser');
const {getUsers, getRoundScores, getRoundCalls, postRoundCalls, postRoundScores, postRoundTricks, getScores, postUsers,
    postRoundCall, postRoundTrick, getRoundTricks
} = require("./Handler");

const app = express()
const port = 8080

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

app.get('*', (req,res)=>{
    res.status(404).send('Invalid url my friend')
})