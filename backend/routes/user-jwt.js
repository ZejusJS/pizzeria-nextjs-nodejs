const express = require('express');
const router = express.Router({ mergeParams: true });
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const generateToken = require('../utils/generateToken');

const User = require('../models/user')
const Cart = require('../models/cart')

router.post('/signup', catchAsync(async function (req, res, next) {
    const { name, email, password } = req.body
    const signedCookies = req.signedCookies

    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    const cart = new Cart()
    await cart.save()

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        interaction: {
            cart: cart._id
        }
    })

    if (user) {
        const newRefreshToken = jwt.sign(
            { "id": user._id }, process.env.SECRET_JWT_REFRESH, { expiresIn: '1d' }
        )

        let newRefreshTokenArray = !signedCookies?.mammamiaRefresh
            ? user.refreshToken : user.refreshToken.filter(rt => rt !== signedCookies.mammamiaRefresh)

        user.refreshToken = [...newRefreshTokenArray, newRefreshToken]
        const result = await user.save()

        if (signedCookies?.mammamiaRefresh) res.clearCookie('mammamiaRefresh', { httpOnly: true })
        res.cookie('mammamiaRefresh', newRefreshToken, { httpOnly: true, signed: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('mammamia', generateToken(user), { httpOnly: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000, })

        res.status(201).json({
            msg: "registered"
        })
    } else {
        throw new ExpressError(400, 'Invalid user data')
    }

}))

router.post('/login', catchAsync(async function (req, res, next) {
    const { email, password } = req.body
    const signedCookies = req.signedCookies

    const user = await User.findOne({ email }).exec()

    if (user && (await bcrypt.compare(password, user.password))) {

        const newRefreshToken = jwt.sign(
            { "id": user._id }, process.env.SECRET_JWT_REFRESH, { expiresIn: '1d' }
        )

        let newRefreshTokenArray = !signedCookies?.mammamiaRefresh
            ? user.refreshToken : user.refreshToken.filter(rt => rt !== signedCookies.mammamiaRefresh)

        if (signedCookies?.mammamiaRefresh) {

            /* 
            Scenario added here: 
                1) User logs in but never uses RT and does not logout 
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
            */
            const refreshToken = signedCookies.mammamiaRefresh;
            const foundToken = await User.findOne({ refreshToken }).exec();

            // Detected refresh token reuse!
            if (!foundToken) {
                console.log('attempted refresh token reuse at login!')
                // clear out ALL previous refresh tokens
                newRefreshTokenArray = [];
            }

            res.clearCookie('mammamiaRefresh', { httpOnly: true });
        }

        if (signedCookies?.mammamiaRefresh) res.clearCookie('mammamiaRefresh', { httpOnly: true })

        user.refreshToken = [...newRefreshTokenArray, newRefreshToken]
        const result = await user.save()

        res.cookie('mammamia', generateToken(user), { httpOnly: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000, })
        res.cookie('mammamiaRefresh', newRefreshToken, { httpOnly: true, signed: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 });
        res.sendStatus(201)

    } else {
        throw new ExpressError(401, 'Invalid user data')
    }
}))

router.post('/refresh', catchAsync(async function (req, res, next) {
    const signedCookies = req.signedCookies
    if (!signedCookies?.mammamiaRefresh) return res.sendStatus(401)
    const refreshToken = signedCookies.mammamiaRefresh
    res.clearCookie('mammamiaRefresh', { httpOnly: true })


    const user = await User.findOne({ refreshToken }).exec()
    if (!user) {
        jwt.verify(
            refreshToken,
            process.env.SECRET_JWT_REFRESH,
            async (err, decoded) => {
                if (err) return res.sendStatus(403)
                const hackedUser = await User.findOne({ email: decoded.email }).exec()
                hackedUser.refreshToken = [];
                const result = await hackedUser.save()
                console.log(result)
            }
        )
        return res.sendStatus(403)
    }

    const newRefreshTokenArray = user.refreshToken.filter(rt => rt !== refreshToken)

    jwt.verify(
        refreshToken,
        process.env.SECRET_JWT_REFRESH,
        async (err, decoded) => {
            if (err) {
                user.refreshToken = [...newRefreshTokenArray];
                const result = await user.save()
            }
            if (err || user._id !== decoded.id) return res.sendStatus(403);

            const accessToken = jwt.sign(
                {
                    "name": decoded.name,
                    "email": decoded.email,
                    "id": decoded.id,
                    "admin": user.roles?.admin
                },
                process.env.SECRET_JWT_ACCESS, { expiresIn: '30m', algorithm: 'HS384' }
            );
            res.cookie('mammamia', accessToken, { httpOnly: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000, })

            const newRefreshToken = jwt.sign(
                { "id": user._id }, process.env.SECRET_JWT_REFRESH, { expiresIn: '1d' }
            )
            user.refreshToken = [...newRefreshTokenArray, newRefreshToken]
            const result = await user.save()
            res.cookie('mammamiaRefresh', refreshToken, { httpOnly: true, signed: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 });

            res.status(201).json({
                msg: "New Token Created"
            })
        }
    );
}))

router.post('/logout', catchAsync(async function (req, res, next) {
    const cookies = req.cookies
    const signedCookies = req.signedCookies

    if (!signedCookies?.mammamiaRefresh) return res.sendStatus(204)
    const refreshToken = signedCookies.mammamiaRefresh

    const user = await User.findOne({ refreshToken }).exec()
    if (!user) {
        res.clearCookie('mammamiaRefresh', { httpOnly: true })
        return res.sendStatus(204);
    }

    user.refreshToken = user.refreshToken.filter(rt => rt !== refreshToken)
    const result = await user.save();

    res.clearCookie('mammamiaRefresh', { httpOnly: true })
    res.clearCookie('mammamia', { httpOnly: true })
    return res.sendStatus(204);
}))


module.exports = router