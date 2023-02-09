const catchAsync = require('./catchAsync')

const User = require('../models/user')

const mwIsLoggedIn = catchAsync(async function (req, res, next) {
    // console.log(req.isAuthenticated())
    if (!req.isAuthenticated()) {
        res.sendStatus(401)
    } else {
        next();
    }
})

module.exports = {
    mwIsLoggedIn
}