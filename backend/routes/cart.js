const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const Pizza = require('../models/pizza')
const Cart = require('../models/cart')

router.post('/singleAdd', catchAsync(async function (req, res, next) {
    const productId = req.body.productId
    const cartId = req.cookies.cart
    const product = await Pizza.findById(productId)
    const cart = await Cart.findById(cartId).populate('items.item')
    if (cart && product) {
        let prevProduct = cart.items.filter(pro => pro.item.equals(productId))[0]
        // console.log(prevProduct)
        if (prevProduct) {
            prevProduct.quantity += 1
            if (prevProduct.quantity > 15) {
                return res.status(400).json({ msg: 'Maximum quantity is 15' })
            }
            cart.items = cart.items.map(item => {
                if (item.item === prevProduct.item) return prevProduct
                return item
            })
        } else {
            cart.items.push({ item: product._id, quantity: 1 })
        }

        await cart.save()
        await cart.populate('items.item')
        res.status(200).json(cart)
    } else {
        res.status(400).json({ msg: 'ProductID or CartID was not found' })
    }
}))

router.delete('/deleteItem', catchAsync(async function (req, res, next) {
    const productId = req.body.productId
    const cartId = req.cookies.cart
    console.log(productId)
    console.log(cartId)
    const cart = await Cart.findByIdAndUpdate(cartId, { $pull: { items: { item: productId } } })
    res.json(cart)
}))

router.post('/changeQuantity', catchAsync(async function (req, res, next) {
    const productId = req.body.productId
    const quantity = req.body.quantity
    const cartId = req.cookies.cart
    const product = await Pizza.findById(productId)
    const cart = await Cart.findById(cartId)
    if (quantity > 15) return res.status(400).json({ msg: 'Maximum quantity is 15' })
    if (cart && product) {
        let prevProduct = cart.items.filter(pro => pro.item.equals(productId))[0]
        cart.items = cart.items.map(item => {
            prevProduct.quantity = quantity
            if (item.item === prevProduct.item) return prevProduct
            return item
        })
        await cart.save()
        res.status(200).json({ msg: 'Product quantity updated', qnt: prevProduct.quantity })
    } else {
        res.status(400).json({ msg: 'ProductID or CartID was not found' })
    }
}))

router.get('/getCart', catchAsync(async function (req, res, next) {
    console.log('USERRRR... ', req.user)
    const cart = await Cart.findById(req.cookies.cart).populate('items.item')
    res.status(200).json(cart)
}))

router.get('/getIdCart', catchAsync(async function (req, res, next) {
    console.log('USERRRR... ', req.user)
    const cart = new Cart()
    if (req.user) cart.user = req.user._id
    await cart.save()
    res.json({ cart: cart._id })
}))

module.exports = router