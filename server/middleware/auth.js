const ensureAuthenticated = (req, res, next) => {
    console.log(Object.keys(req));
    // console.log(req)
    if (req.user) {
        next();
    } else {
        res.status(400).json({error: "Error authenticating"});
    }
}

module.exports = ensureAuthenticated;