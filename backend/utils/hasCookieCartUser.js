const Pizza = require('../models/pizza')
const Cart = require('../models/cart')
const User = require('../models/user')

const hasCookieCartUser = async function (req, res, next) {
    if (req.user) {
        next()
    } else {
        if (req.cookies.cart) {
            const findCart = await Cart.findById(req.cookies.cart)
            if (!findCart.user) {
                next()
            } else {
                res.status(400).json({ msg: 'Some user own this cart. You can delete cookie "cart" or log in to an accont.' })
            }
        } else {
            next()
        }
    }
}

module.exports = hasCookieCartUser;