const ExpressError = require('./ExpressError');
const catchAsync = require('../utils/catchAsync')

const User = require('../models/user');

const { paymentSchema } = require('../models/joi');

module.exports.validatePayment = catchAsync(async function(req,res,next) {
    const { error } = paymentSchema.validate(req.body);
    if (error) {
        res.status(400).json({ code: 300 })
    } else {
        next()
    }
})