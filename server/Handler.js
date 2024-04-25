const {getUsersRepo, getRoundScoresRepo, getRoundCallsRepo, postRoundCallsRepo, postRoundScoresRepo,
    postRoundTricksRepo, updateScores, checkRoundsSync, postUsersRepo, postRoundCallRepo, postRoundTrickRepo,
    getRoundTricksRepo
} = require("./Repo");
const getUsers = (req, res, next) => {
    getUsersRepo().then((users)=> {
        console.log('getting users')
        res.status(200).send(users)
    })
}
const getRoundScores = (req, res) => {
    console.log("getting scores")
    getRoundScoresRepo().then((data)=> {
        res.status(200)
    })
}
const getRoundCalls = (req, res) => {
    console.log("Handler: getting calls")
    getRoundCallsRepo().then((data)=> {
        res.status(200).send(data)
    })
}
const postRoundCalls = (req, res) => {
    if (req.body) {
        checkRoundsSync({calls: true}).then((passedCheck) => {
            if (passedCheck) {
                postRoundCallsRepo(req.body).then(() => {
                    res.status(200).send({msg: "calls updated"})
                })
            } else {
                console.log("Desynced rounds")
                res.status(400).send({msg: "Desynced rounds"})
            }
        })
    }
}
const postRoundCall = (req, res) => {
    if(req.body){
        postRoundCallRepo(req.body).then((msg) => {
            res.status(200).send(msg)
        })
    } else {
        return res.status(400).send({msg: "Empty request body"})
    }
} 
const postRoundTricks = (req, res) => {
    if(req.body){
        checkRoundsSync({tricks: true}).then((passedCheck)=>{
            if (passedCheck) {
                postRoundTricksRepo(req.body).then(()=>{
                    updateScores().then((data)=>{
                        res.status(200).send(data)  
                    })
                })
            } else res.status(400).send({msg: "Desynced tricks"})
        })
    }
}
const postRoundTrick = (req, res) => {
    if(req.body){
        postRoundTrickRepo(req.body).then((msg) => {
            res.status(200).send(msg)
        })
    } else {
        return res.status(400).send({msg: "Empty request body"})
    }
}
const getRoundTricks = (req, res) => {
    console.log("Handler: getting tricks")
    getRoundTricksRepo().then((data)=>{
        res.status(200).send(data)
    })
}
const postUsers = (req, res) => {
    if (req.body){
        postUsersRepo(req.body).then((data)=>{
            res.status(200).send(data)
        })
    }
}

module.exports = { getUsers, getRoundScores, getRoundCalls, postRoundCalls, postRoundTricks, postUsers, postRoundCall, postRoundTrick, getRoundTricks }