const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport')

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { mwIsLoggedIn } = require('../utils/mw-isLoggedIn');
const { validateRegister, validateLogin } = require('../utils/mw-validateAuth');
const { validateShippingAdress } = require('../utils/mw-validateAdress');
const { validateUserDetails } = require('../utils/mw-validateDetails');
const { validateUserBilling } = require('../utils/mw-validateBilling');
const { mwRecaptchaAuth } = require('../utils/payment/recaptcha')

const User = require('../models/user')
const Cart = require('../models/cart')
const Order = require('../models/order')

router.post('/signup', validateRegister, mwRecaptchaAuth, catchAsync(async function (req, res, next) {
    const { email, name, password, firstname, lastname, adress, city, zip } = req.body;
    const user = new User({ name, email, invoiceInfo: { firstname, lastname, adress, city, zip, country: 'Czech Republic' } });
    try {
        const registeredUser = await User.register(user, password);
        const findCart = await Cart.findById(req.cookies.cart)
        if (req.cookies.cart && findCart) {
            registeredUser.interaction.cart = req.cookies.cart
            findCart.user = registeredUser._id
            await registeredUser.save()
            res.clearCookie("cart");
        } else {
            const cart = new Cart()
            cart.user = req.user._id
            registeredUser.interaction.cart = cart._id
            await cart.save()
            await registeredUser.save()
        }
        req.login(user, async function (err) {
            if (err) { return next(err); }
            const user = {
                email: req.user?.email,
                name: req.user?.name,
                admin: req.user?.roles?.admin
            }
            const invoiceInfo = req.user?.invoiceInfo
            console.log(user)
            const cart = await Cart.findById(registeredUser.interaction.cart).populate('items.item')
            return res.status(201).json({ msg: 'Signed up', context: 'Signed in and Logged in', user, cart, invoiceInfo })
        });
    } catch (e) {
        console.log(e)
        let errMsg = e.message;
        if (e.message === 'email taken') { // email taken je změněno v user.js (chema user)
            errMsg = `Email "${email}" is already taken`
        }
        res.status(400).json({ msg: errMsg, context: 'Bad signup', code: 100 })
    }
}))

router.post('/login', validateLogin, passport.authenticate('local', {
    keepSessionInfo: true // pro zachování req.session.returnTo (původní URL, kam jsme se chtěli dostat ještě než nás to přesměrovalo)
}), catchAsync(async function (req, res, next) {
    // console.log(req.query)
    const findCart = await Cart.findById(req.cookies?.cart)
    // console.log(findCart)
    if (req.body.newCart === true && findCart?.items?.length) {
        // const cart = await Cart.findById(req.cookies.cart)

        if (!req.user || !findCart) return res.sendStatus(400)
        req.user.interaction.cart = findCart._id
        findCart.user = req.user._id

        await req.user.save()
        await findCart.save()
    } else if (req.user && !req.user.interaction && !req.user.interaction.cart) {
        const cart = new Cart()

        if (!req.user || !cart) return res.sendStatus(400)
        req.user.interaction.cart = cart._id
        cart.user = req.user._id

        await req.user.save()
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

router.post('/logout', catchAsync(async function (req, res, next) {
    if (req.user && req.user._id) {
        // req.logout(function (err) {
        //     if (err) return next(err)
        //     res.clearCookie("mamma-mia");
        //     res.redirect(process.env.FRONTEND)
        // });
        req.session.destroy(function (err) {
            res.clearCookie("mammamia");
            res.sendStatus(200);
        });
    } else {
        res.redirect(process.env.FRONTEND)
    }
}))

//

router.get('/getUser', mwIsLoggedIn, catchAsync(async function (req, res, next) {
    // const orders = await Order.find({ _id: { $in: req.user.orders } }).sort({createdAt: -1})

    const user = {
        name: req.user?.name,
        email: req.user?.email,
        roles: req.user?.roles,
        id: req.user?._id,
        invoiceInfo: req.user?.invoiceInfo,
        shippingAdress: req.user?.shippingAdress,
        orders: req.user?.orders
    }
    res.status(200).json(user)
}))

router.post('/adress', mwIsLoggedIn, validateShippingAdress, catchAsync(async function (req, res, next) {
    // const userId = req.user?._id
    // const findUser = await User.findById(userId)
    // if (!findUser) return res.status(400).json({ code: 350 })

    Object.entries(req.body).map(entry => {
        req.user.shippingAdress[entry[0]] = entry[1]
    })
    await req.user.save()

    return res.sendStatus(200)
}))

router.post('/details', mwIsLoggedIn, validateUserDetails, catchAsync(async function (req, res, next) {
    // const userId = req.user?._id
    // const findUser = await User.findById(userId)
    // if (!findUser) return res.status(400).json({ code: 350 })

    req.user.name = req.body.name
    await req.user.save()

    return res.sendStatus(200)
}))

router.post('/billing', mwIsLoggedIn, validateUserBilling, catchAsync(async function (req, res, next) {
    // const userId = req.user?._id
    // const findUser = await User.findById(userId)
    // if (!findUser) return res.status(400).json({ code: 350 })

    req.user.invoiceInfo.adress = req.body.adress
    req.user.invoiceInfo.zip = req.body.zip
    req.user.invoiceInfo.city = req.body.city
    req.user.invoiceInfo.firstname = req.body.firstname
    req.user.invoiceInfo.lastname = req.body.lastname
    await req.user.save()

    return res.sendStatus(200)
}))

module.exports = router