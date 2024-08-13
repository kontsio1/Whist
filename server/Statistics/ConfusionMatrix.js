const db = require('../db/connection');
const ConfusionMatrixForPlayer = async (player) => {
    console.log("Getting data...")
    const callsDbo = await db.query(`SELECT ${player}
                                     FROM roundscalls
                                     ORDER BY roundno`)
    const tricksDbo = await db.query(`SELECT ${player}
                                      FROM roundstricks
                                      ORDER BY roundno`)

    const calls = callsDbo.rows.map(e => e[player] ?? 0)
    const tricks = tricksDbo.rows.map(e => e[player] ?? 0)
    console.log("calls:", calls, "\ntricks:", tricks)

    console.log("Constructing confusion matrix...")
    const arr = calls.concat(tricks)
    const n = Math.max(...arr) + 1
    let confusionMatrix = new Array(n).fill(0).map(() => new Array(n).fill(0));
    const predictions = [...Array(n).keys()] //array [0...n]

    console.log("Populating confusion matrix...")
    for (let i = 0; i < calls.length; i++) {
        const call = calls[i]
        const trick = tricks[i]
        console.log(call, trick)
        confusionMatrix[call][trick]++
    }

    console.log("Extracting data...")
    const stats = {accuracy: null, precision: [], recall: [], F1Score: []}
    stats.accuracy = SumDiagonal(confusionMatrix) / Sum(confusionMatrix)
    stats.precision = predictions.map(p => PrecisionForClass(confusionMatrix, p))
    stats.recall = predictions.map(p => RecallForClass(confusionMatrix, p))
    stats.F1Score = predictions.map(p => F1ScoreForClass(stats.precision[p], stats.recall[p]))

    console.log("Sending stats...")
    return stats
}

function SumDiagonal(matrix) {
    let p = 0
    let n = matrix[0].length

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === j) {
                p += matrix[i][j];
            }
        }
    }
    return p
}

function Sum(matrix) {
    let sum = 0
    let n = matrix.length

    for (let i = 0; i < n; i++) {
        const rowSum = matrix[i].reduce((partialSum, a) => partialSum + a, 0);
        sum += rowSum
    }
    return sum
}

function PrecisionForClass(matrix, classNum) {
    let TP = matrix[classNum][classNum]
    let FP = 0
    matrix.map((row, indexPrev) => {
        row.map((x, index) => {
            if (index === classNum) {
                if (index !== indexPrev) {
                    FP += x
                }
            }
        })
    })
    return TP / (TP + FP)
}

function RecallForClass(matrix, classNum) {
    let TP = matrix[classNum][classNum]
    let FN = 0;
    matrix[classNum].map((x, index) => {
        if (index !== classNum) {
            FN += x
        }
    })
    return TP / (TP + FN)
}

function F1ScoreForClass(precision, recall) {
    return 2 * (precision * recall) / (precision + recall)
}

module.exports = {ConfusionMatrixForPlayer}