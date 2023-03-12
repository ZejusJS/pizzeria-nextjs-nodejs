const ExpressError = require('./ExpressError');
const catchAsync = require('./catchAsync')

const User = require('../models/user');

const { pizzaSchema } = require('../models/joi');

module.exports.validatePizza = catchAsync(async function (req, res, next) {
    req.body.currency = 'CZK'
    const { error } = pizzaSchema.validate(req.body);
    req.body.description = req.body.description.trim()
    req.body.title = req.body.title.trim()
    req.body.price = req.body.price.trim()
    if (error) {
        console.log(error)
        return res.status(400).json({ msg: 'Some values are empty or invalid', err: 'invalid', code: 300, stack: error.details })
    } else {
        next()
    }
})