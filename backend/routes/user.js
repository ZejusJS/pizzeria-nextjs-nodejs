const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport')

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const User = require('../models/user')
const Cart = require('../models/cart')

router.post('/signup', catchAsync(async function (req, res, next) {
    const { email, username, password } = req.body;
    const user = new User({ username, email });
    if (req.cookies.cart) {
        user.interaction.cart = req.cookies.cart
        res.clearCookie("cart");
    } else {
        const cart = new Cart()
        cart.user = req.user._id
        await cart.save()
        user.interaction.cart = cart._id
    } 
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
    if (req.user && !req.user.interaction && !req.user.interaction.cart) {
        const cart = new Cart()
        cart.user = req.user._id
        const user = await User.findById(req.user._id)
        user.interaction.cart = cart._id
        await user.save()
        await cart.save()
    }
    res.status(200).json({ msg: 'logged in' })
}))

router.get('/logout', catchAsync(async function (req, res, next) {
    if (req.user && req.user._id) {
        // req.logout(function (err) {
        //     if (err) return next(err)
        //     res.clearCookie("mamma-mia");
        //     res.redirect(process.env.FRONTEND)
        // });
        req.session.destroy(function (err) {
            res.redirect(process.env.FRONTEND); //Inside a callback… bulletproof!
        });
    } else {
        res.redirect(process.env.FRONTEND)
    }
}))

module.exports = router