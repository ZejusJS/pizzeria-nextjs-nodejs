const ExpressError = require('./ExpressError');

const User = require('../models/user');

const { registerSchema, loginSchema } = require('../models/joi');

module.exports.validateRegister = async function (req, res, next) {
    const { error } = registerSchema.validate(req.body);
    const { username } = req.body
    if (error) {
        console.log(error.details[0])
        const msg = error.details.map(el => el.message).join(',');
        req.flash('error', msg);
        if (error.details[0].path[0] === 'password') {
            res.status(400).json({ code: 150 })
        } else if (error.details[0].path[0] === 'name') {
            res.status(400).json({ code: 200 })
        } else if (error.details[0].path[0] === 'email') {
            res.status(400).json({ code: 250 })
        }
    } else {
        next();
    }
}