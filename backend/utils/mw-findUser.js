const jwt = require('jsonwebtoken')
const User = require('../models/user')

const catchAsync = require('./catchAsync');
const ExpressError = require('./ExpressError');

module.exports = catchAsync(async function (req, res, next) {
    const jwtToken = req.cookies.mammamia
    console.log(jwtToken)
    console.log(req.signedCookies)

    let token

    if (jwtToken) {
        try {
            token = jwtToken

            const decoded = jwt.verify(token, process.env.SECRET_JWT_ACCESS)

            req.user = await User.findById(decoded.id).select('-password')
            console.log(req.user)

            return next()
        } catch (err) {
            console.log(err)
            throw new ExpressError(401, 'Not authorized')
        }
    }
    if (!token) {
        req.user = undefined
        return next()
    }
})