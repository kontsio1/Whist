const db = require("./db/connection");

function calculateRowScores(roundno, callsRow, tricksRow) {
    const scoresRow = {roundno}
    for (const player in callsRow) {
        if (player !== "roundno"){
            scoresRow[player] = tricksRow[player]*2
            if (callsRow[player] === null || tricksRow[player] === null) {
                scoresRow[player] = null
            }
            else if (callsRow[player] == tricksRow[player]) {
                scoresRow[player] += 10
            }
        }
    }
    return scoresRow
}

function arrayToStringWithNull(array) {
    const transformedArray = array.slice(1).map(element => element === null ? 'null' : element);
    return transformedArray.join(', ');
}

async function createDealerTable (usersLength, startingDealer) {
    const totalRounds = Math.floor(2*52/(usersLength))
    
    const createTableQuery = `
        CREATE TABLE dealer (
        roundno SERIAL PRIMARY KEY,
        cards INT,
        dealerPlayer VARCHAR
        );`

    const populateCardsTableQuery = `
      DO $$
      DECLARE
        i INT := 1;
        BEGIN
            WHILE i <= ${totalRounds} LOOP
                DECLARE
                    cards INT;
                BEGIN
                    IF i <= ${totalRounds} / 2 THEN
                        cards := i;
                    ELSE
                        cards := ${totalRounds} - i;
                    END IF;
                    INSERT INTO dealer (cards) VALUES (cards);
                    i := i + 1;
                END;
            END LOOP;
        END $$;
        DELETE FROM dealer
            WHERE roundno = (
                SELECT roundno
                FROM dealer
                ORDER BY roundno DESC
                LIMIT 1
            );
        `;
    
    db.query(createTableQuery)
        .then(async () => {
            console.log('Dealer table created successfully');
            await db.query(populateCardsTableQuery)
            await seedDealerPlayerData(totalRounds, startingDealer, usersLength)
        })
        .then(() => {
            console.log('Dealer table populated successfully');
        })
        .catch(err => {
            console.error('Error creating table or seeding', err);
        });
}
async function seedDealerPlayerData(totalRounds,startingDealer,usersLength) {
    const player = enumerator(startingDealer,usersLength);
    let i= 1
    while (i <= totalRounds) {
        let playerNumber = player()
        await db.query(`UPDATE dealer SET dealerplayer = ${playerNumber} WHERE roundno=${i}`)
        i++;
    }
}
function enumerator (startingDealer,usersLength){
    let currentNumber = startingDealer-1
    return function getPlayer() {
        if(currentNumber <= usersLength-1){
            currentNumber += 1
            return currentNumber
        } else {
            currentNumber -= usersLength-1
            return currentNumber
        }
    }
}
module.exports = {calculateRowScores, arrayToStringWithNull, createDealerTable}