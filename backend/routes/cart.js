const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const hasCookieCartUser = require('../utils/hasCookieCartUser')

const Pizza = require('../models/pizza')
const Cart = require('../models/cart')

router.post('/singleAdd', catchAsync(async function (req, res, next) {
    const productId = req.body.productId
    const cartId = function () {
        if (req.user && req.user.interaction && req.user.interaction.cart) return req.user.interaction.cart
        return req.cookies.cart
    }
    const product = await Pizza.findById(productId)
    const cart = await Cart.findById(cartId()).populate('items.item')
    if (cart && product) {
        let prevProduct = cart.items.filter(pro => pro.item.equals(productId))[0]
        // console.log(prevProduct)
        if (cart.user && !req.user.interaction.cart.equals(cart._id)) {
            return res.status(400).json({ msg: `You don't have permisson to edit this cart.` })
        }
        
        if (prevProduct) {
            prevProduct.quantity += 1
            if (prevProduct.quantity > 15 || prevProduct.quantity < 1) {
                return res.status(400).json({ msg: 'Quantity of product must be between 15 and 1' })
            }
            prevProduct.totalPrice = prevProduct.price * prevProduct.quantity
            cart.items = cart.items.map(item => {
                if (item.item === prevProduct.item) return prevProduct
                return item
            })
        } else {
            cart.items.push({ item: product._id, quantity: 1, totalPrice: product.price, price: product.price })
        }

        await cart.save()
        await cart.populate('items.item')
        res.status(200).json(cart)
    } else {
        console.log('xdddddddddddddddd')
        res.status(400).json({ msg: 'ProductID or CartID was not found' })
    }
}))

router.delete('/deleteItem', catchAsync(async function (req, res, next) {
    const productId = req.body.productId
    const cartId = function () {
        if (req.user && req.user.interaction && req.user.interaction.cart) return req.user.interaction.cart
        return req.cookies.cart
    }
    const cart = await Cart.findById(cartId()).populate('items.item') 
    if (cart.user && user.interaction && user.interaction.cart && !user.interaction.cart.equals(cart._id)) {
        return res.status(400).json({ msg: `You don't have permission to edit this cart` })
    }
    cart.items = cart.items.filter(item => {
        if (!item.item.equals(productId)) return item 
    })
    await cart.save()
    console.log(cart)
    // console.log(cart)
    // , { $pull: { items: { item: productId } } }, { new: true }
    res.json(cart)
}))

router.post('/changeQuantity', catchAsync(async function (req, res, next) {
    const productId = req.body.productId
    const quantity = req.body.quantity
    const cartId = function () {
        if (req.user && req.user.interaction && req.user.interaction.cart) return req.user.interaction.cart
        return req.cookies.cart
    }
    const product = await Pizza.findById(productId)
    const cart = await Cart.findById(cartId())
    if (quantity > 15 || quantity < 1) return res.status(400).json({ msg: 'Quantity of product must be between 15 and 1' })
    if (cart && product) {
        let prevProduct = cart.items.filter(pro => pro.item.equals(productId))[0]
        prevProduct.quantity = quantity
        prevProduct.totalPrice = quantity * prevProduct.price
        cart.items = cart.items.map(item => {
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
    console.log('USER... ', req.user)
    let cart = {}
    if (req.user && req.user.interaction && req.user.interaction.cart) {
        const findCart = await Cart.findById(req.user.interaction.cart).populate('items.item')
        cart = findCart
    } else {
        try {
            const findCart = await Cart.findById(req.cookies.cart).populate('items.item')
            if (!findCart.user) cart = findCart
            else {
                const cart = new Cart()
                await cart.save()
                return res.status(400).json({ cart: cart._id, msg: `You don't have permission to view this cart` })
            }
        } catch (e) {
            const cart = new Cart()
            await cart.save()
            return res.status(400).json({ cart: cart._id, msg: `Bad cart id` })
        }
    }
    res.status(200).json(cart)
}))

router.get('/getIdCart', catchAsync(async function (req, res, next) {
    console.log('USERRRR... ', req.user)
    const cart = new Cart()
    await cart.save()
    res.json({ cart: cart._id })
}))

module.exports = router