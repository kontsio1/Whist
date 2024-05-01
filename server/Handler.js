const {getUsersRepo, getRoundScoresRepo, getRoundCallsRepo, updateScores, checkRoundsSync, postUsersRepo, postRoundCallRepo, postRoundTrickRepo,
    getRoundTricksRepo
} = require("./Repo");
const getUsers = (req, res, next) => {
    getUsersRepo().then((users)=> {
        console.log('Api: getUsers')
        res.status(200).send(users)
    })
}
const getRoundScores = (req, res) => {
    console.log("Api: getRoundScores")
    getRoundScoresRepo().then((data)=> {
        res.status(200).send(data)
    })
}
const getRoundCalls = (req, res) => {
    console.log("Api: getRoundCalls")
    getRoundCallsRepo().then((data)=> {
        res.status(200).send(data)
    })
}
const postRoundCall = (req, res) => {
    if(req.body){
        postRoundCallRepo(req.body).then((msg) => {
            updateScores().then(r => res.status(200).send(msg))
        })
    } else {
        return res.status(400).send({msg: "Empty request body"})
    }
}
const postRoundTrick = (req, res) => {
    console.log("Api: postRoundTricks")
    if(req.body){
        postRoundTrickRepo(req.body).then((msg) => {
            updateScores().then(r => res.status(200).send(msg))
        })
    } else {
        return res.status(400).send({msg: "Empty request body"})
    }
}
const getRoundTricks = (req, res) => {
    console.log("Api: getRoundTricks")
    getRoundTricksRepo().then((data)=>{
        res.status(200).send(data)
    })
}
const postUsers = (req, res) => {
    console.log("Api: postUsers")
    if (req.body){
        postUsersRepo(req.body).then((data)=>{
            res.status(200).send(data)
        })
    }
}

module.exports = { getUsers, getRoundScores, getRoundCalls, postUsers, postRoundCall, postRoundTrick, getRoundTricks }