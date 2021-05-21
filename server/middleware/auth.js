const ensureAuthenticated = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(400).json({error: "Error authenticating", logout: true});
    }
}

module.exports = ensureAuthenticated;