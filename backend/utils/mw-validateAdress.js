const ExpressError = require('./ExpressError');
const catchAsync = require('../utils/catchAsync')

const User = require('../models/user');

const { adressShippingSchema } = require('../models/joi');

module.exports.validateShippingAdress = catchAsync(async function (req, res, next) {
    const { error } = adressShippingSchema.validate(req.body);
    if (error) {
        console.log(error)
        res.status(400).json({ code: 300 })
    } else {
        next()
    }
})