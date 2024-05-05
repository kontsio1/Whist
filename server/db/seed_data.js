const userData = require('./data/users');
const roundsData = require('./data/rounds');
const seed = require('./seed');
const db = require('./connection')

console.log("Seeding data for 6 players...")
seed(6,2).then(()=>{  //(numPlayers,firstToDeal)
    return db.end()
})