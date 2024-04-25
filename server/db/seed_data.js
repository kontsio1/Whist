const userData = require('./data/users');
const roundsData = require('./data/rounds');
const seed = require('./seed');
const db = require('./connection')

const data = {
    userData: userData,
    rounds: roundsData
}
console.log("Seeding data for 6 players...")
seed(6).then(()=>{
    return db.end()
})