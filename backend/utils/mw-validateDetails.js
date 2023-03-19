const ExpressError = require('./ExpressError');
const catchAsync = require('./catchAsync')

const User = require('../models/user');

const { userDetailsSchema } = require('../models/joi');

module.exports.validateUserDetails = catchAsync(async function (req, res, next) {
    const { error } = userDetailsSchema.validate(req.body);
    if (error) {
        console.log(error)
        res.status(400).json({ code: 300 })
    } else {
        req.body.name = req.body.name.trim()
        next()
    }
})