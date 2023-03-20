const Cart = require('../../models/cart')
const User = require('../../models/user')
const catchAsync = require('../../utils/catchAsync')
const ExpressError = require('../ExpressError');

module.exports = async function emptyCart(cartId, res, req) {
    try {
        await Cart.findByIdAndUpdate(cartId, { $set: { items: [] } })
        return 'ok'
    } catch (error) {
        return res.sendStatus(500)
    }
}