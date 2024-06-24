const userData = require('./data/users');
const roundsData = require('./data/rounds');
const seed = require('./seed');
const db = require('./connection')

console.log("Seeding data for 6 players...")
seed(6,1).then(async () => {  //(numPlayers,firstToDeal)
    console.log("Seeding completed")
    await db.end()
})