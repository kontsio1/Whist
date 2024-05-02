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

module.exports = {calculateRowScores, arrayToStringWithNull}