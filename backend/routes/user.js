const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport')

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const User = require('../models/user')
const Cart = require('../models/cart')

router.post('/signup', catchAsync(async function (req, res, next) {
    const { email, name, password } = req.body;
    const user = new User({ name, email });
    try {
        const registeredUser = await User.register(user, password);
        if (req.cookies.cart) {
            registeredUser.interaction.cart = req.cookies.cart
            await registeredUser.save()
            res.clearCookie("cart");
        } else {
            const cart = new Cart()
            cart.user = req.user._id
            registeredUser.interaction.cart = cart._id
            await cart.save()
            await registeredUser.save()
        }
        req.login(user, function (err) {
            if (err) { return next(err); }
            const user = {
                email: req.user?.email,
                name: req.user?.name,
                admin: req.user?.roles?.admin
            }
            console.log(user)
            const cart = Cart.findById(registeredUser.interaction.cart).populate('items.item')
            return res.status(201).json({ msg: 'Signed up', context: 'Signed in and Logged in', user, cart })
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
    if (req.cookies.cart) res.clearCookie("cart");
    const user = {
        email: req.user?.email,
        name: req.user?.name,
        admin: req.user?.roles?.admin
    }
    const cart = await Cart.findById(req.user?.interaction?.cart).populate('items.item')
    res.status(200).json({ msg: 'logged in', user, cart })
}))
// 
router.post('/logout', catchAsync(async function (req, res, next) {
    if (req.user && req.user._id) {
        // req.logout(function (err) {
        //     if (err) return next(err)
        //     res.clearCookie("mamma-mia");
        //     res.redirect(process.env.FRONTEND)
        // });
        req.session.destroy(function (err) {
            res.clearCookie("mammamia");
            res.redirect(process.env.FRONTEND); //Inside a callback… bulletproof!
        });
    } else {
        res.redirect(process.env.FRONTEND)
    }
}))

module.exports = router