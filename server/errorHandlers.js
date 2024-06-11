exports.handleCustomErrors = (err, req, res, next) => {
    if (err.msg !== undefined) {
        res.status( err.status ).send({ msg: err.msg });
    } else {
        next(err)
    }
};
exports.finalHandleErrors = (err, req, res, next) => {
    res.status(500).send({ msg: "Server went bzz bzz...", err: err.msg });
};
exports.handleWrongPath = (err, req, res) => {
    res.status(404).send({msg: 'Invalid url my friend', err: err.msg})
}