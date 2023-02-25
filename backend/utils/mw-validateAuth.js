const ExpressError = require('./ExpressError');

const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')

const { registerSchema, loginSchema } = require('../models/joi');

module.exports.validateRegister = catchAsync(async function (req, res, next) {
    req.body.firstname = req.body.firstname.replace(/[\s.;,'"$<>*÷×()/|?%0-9]/g, '')
    req.body.lastname = req.body.lastname.replace(/[\s.;,'"$<>*÷×()/|?%0-9]/g, '')
    const { error } = registerSchema.validate(req.body);
    if (error) {
        console.log(error.details[0])
        const msg = error.details.map(el => el.message).join(',');
        req.flash('error', msg);
        if (error.details[0]?.path[0] === 'password') {
            res.status(400).json({ code: 150 })
        } else if (error.details[0]?.path[0] === 'name') {
            res.status(400).json({ code: 200 })
        } else if (error.details[0]?.path[0] === 'email') {
            res.status(400).json({ code: 250 })
        } else {
            res.status(400).json({ code: 300 })
        }
    } else {
        next();
    }
})

module.exports.validateLogin = catchAsync(async function (req, res, next) {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        console.log(error.details[0])
        const msg = error.details.map(el => el.message).join(',');
        if (error.details[0].path[0] === 'password') {
            res.status(400).json({ code: 150 })
        } else if (error.details[0].path[0] === 'email') {
            res.status(400).json({ code: 250 })
        }
    } else {
        next();
    }
})