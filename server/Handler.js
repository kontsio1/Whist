const {getUsersRepo, getRoundScoresRepo, getRoundCallsRepo, updateScores, postUsersRepo, postRoundCallRepo, postRoundTrickRepo,
    getRoundTricksRepo,
    getGameDealersRepo,
    postFirstDealerRepo,
    getEndOfGameStatistics
} = require("./Repo");
const getUsers = (req, res, next) => {
    getUsersRepo().then((users)=> {
        console.log('Api: getUsers')
        res.status(200).send(users)
    }).catch((err)=>{
        next(err)
    })
}
const getRoundScores = (req, res, next) => {
    console.log("Api: getRoundScores")
    getRoundScoresRepo().then((data)=> {
        res.status(200).send(data)
    }).catch((err)=>{
        next(err)
    })
}
const getRoundCalls = (req, res, next) => {
    console.log("Api: getRoundCalls")
    getRoundCallsRepo().then((data)=> {
        res.status(200).send(data)
    }).catch((err)=>{
        next(err)
    })
}
const postRoundCall = (req, res, next) => {
    if(req.body) {
        postRoundCallRepo(req.body).then((msg) => {
            updateScores().then(r => res.status(200).send(msg))
        }).catch((err) => {
            next(err)
        })
    }
}
const postRoundTrick = (req, res, next) => {
    console.log("Api: postRoundTricks")
    if(req.body) {
        postRoundTrickRepo(req.body).then((msg) => {
            updateScores().then(r => res.status(200).send(msg))
        }).catch((err) => {
            next(err)
        })
    }
}
const getRoundTricks = (req, res, next) => {
    console.log("Api: getRoundTricks")
    getRoundTricksRepo().then((data)=>{
        res.status(200).send(data)
    }).catch((err)=>{
        next(err)
    })
}
const postUsers = (req, res, next) => {
    console.log("Api: postUsers")
    if (req.body){
        postUsersRepo(req.body).then((data)=>{
            res.status(200).send(data)
        }).catch((err)=>{
            next(err)
        })
    }
}

const getGameDealers = (req, res, next) => {
    console.log("Api: getRoundTricks")
    getGameDealersRepo().then((data)=>{
        res.status(200).send(data)
    }).catch((err)=>{
        next(err)
    })
}

const postFirstToDeal = (req, res, next) => {
    console.log("Api: Posting First Dealer")
    postFirstDealerRepo(req.body).then((data)=>{
        res.status(200).send(data)
    }).catch((err)=>{
        next(err)
    })
}

const getEndOfGameInfo = async (req, res, next) => {
    console.log(`Api: Checking if ${req.params.player} is a valid player`)
    const activeUsers = await getUsersRepo()
    const playerNo = activeUsers.findIndex(u=> u.username === req.params.player)
    if(playerNo >= 0){
    console.log(`Api: Getting stats for ${req.params.player}`)
    getEndOfGameStatistics(`player${playerNo}`).then((data) => {
        res.status(200).send(data)
    }).catch((err)=>{
        next(err)
    })
    } else {
        console.log("Api: Error finding player stats")
        res.status(400).send("Not a valid player")
    }
}

module.exports = { getUsers, getRoundScores, getRoundCalls, postUsers, postRoundCall, postRoundTrick, getRoundTricks, getGameDealers, postFirstToDeal, getEndOfGameInfo }