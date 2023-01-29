const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport')

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const User = require('../models/user')

router.post('/signup', catchAsync(async function (req, res, next) {
    const { email, username, password } = req.body;
    const user = new User({ username, email });
    try {
        const registeredUser = await User.register(user, password);
        req.login(user, function (err) {
            if (err) { return next(err); }
            return res.status(200).json({ msg: 'Signed up', context: 'Signed in and Logged in' })
        });
    } catch (e) {
        console.log(e)
        let errMsg = e.message;
        if (e.message === 'email taken') { // email taken je změněno v user.js (chema user)
            errMsg = `Email "${email}" is already taken`
        }
        res.status(400).json({ msg: errMsg, context: 'Bad signup' })
    }
}))

router.post('/login', passport.authenticate('local', {
    keepSessionInfo: true // pro zachování req.session.returnTo (původní URL, kam jsme se chtěli dostat ještě než nás to přesměrovalo)
}), catchAsync(async function (req, res, next) {
    console.log(req.body)
    res.json({msg: 'logged in'})
}))

module.exports = router