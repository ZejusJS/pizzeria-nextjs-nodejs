const ExpressError = require('./ExpressError');
const catchAsync = require('./catchAsync')

const User = require('../models/user');

const { userBillingSchema } = require('../models/joi');

module.exports.validateUserBilling = catchAsync(async function (req, res, next) {
    const { error } = userBillingSchema.validate(req.body);
    if (error) {
        console.log(error)
        res.status(400).json({ code: 300 })
    } else {
        req.body.firstname = req.body.firstname.replace(/[\s.;,'"$<>*÷×()/|?%0-9]/g, '')
        req.body.lastname = req.body.lastname.replace(/[\s.;,'"$<>*÷×()/|?%0-9]/g, '')
        next()
    }
})