const express = require('express');
const router = express.Router({ mergeParams: true });
const jtw = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const generateToken = require('../utils/generateToken');

const User = require('../models/user')
const Cart = require('../models/cart')

router.post('/signup', catchAsync(async function (req, res, next) {
    const { name, email, password } = req.body

    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if (user) {
        res.cookie('mammamia', generateToken(user._id), { maxAge: 900000, httpOnly: true, sameSite: 'lax' })
        res.status(201).json({
            msg: "registered"
        })
    } else {
        throw new ExpressError(400, 'Invalid user data')
    }

}))

router.post('/login', catchAsync(async function (req, res, next) {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        throw new ExpressError(400, 'Invalid user data')
    }
}))



module.exports = router