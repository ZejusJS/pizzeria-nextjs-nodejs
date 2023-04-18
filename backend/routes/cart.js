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
    let product
    let cart
    await Promise.all([Pizza.findById(productId), Cart.findById(cartId())])
        .then(values => {
            product = values[0]
            cart = values[1]
        })

    if (cart && product) {
        let prevProduct = cart.items.filter(pro => pro?.item?.equals(productId))[0]
        // console.log(prevProduct)
        if (cart.user && !req?.user?.interaction?.cart?.equals(cart._id)) {
            return res.status(400).json({ msg: `You don't have permisson to edit this cart.`, code: 400 })
        }

        if (prevProduct) {
            prevProduct.quantity += 1
            if (prevProduct.quantity > 15 || prevProduct.quantity < 1) {
                return res.status(400).json({ msg: 'Quantity of product must be between 15 and 1', code: 300 })
            }
            prevProduct.totalPrice = product.price * product.quantity
            cart.items = cart.items.map(item => {
                if (item?.item === prevProduct?.item) return prevProduct
                return item
            })
        } else {
            cart.items.push({ item: product._id, quantity: 1, totalPrice: product.price, price: product.price })
        }

        await Promise.all([cart.save(), cart.populate('items.item')])

        res.status(200).json(cart)
    } else {
        res.status(400).json({ msg: 'Product or Cart was not found by IDs', code: 300 })
    }
}))

router.post('/deleteItem', catchAsync(async function (req, res, next) {
    const productId = req.body.productId

    const cartId = function () {
        if (req.user && req.user.interaction && req.user.interaction.cart) return req.user.interaction.cart
        return req.cookies.cart
    }

    const cart = await Cart.findById(cartId()).populate('items.item')
    if (cart.user && !req?.user?.interaction?.cart?.equals(cart._id)) {
        return res.status(400).json({ msg: `You don't have permission to edit this cart`, code: 400 })
    }

    cart.items = cart.items.filter(item => !item?.item?.equals(productId))
    await cart.save()

    res.json(cart)
}))

router.post('/changeQuantity', catchAsync(async function (req, res, next) {
    const productId = req.body.productId
    const quantity = req.body.quantity
    if (quantity > 15 || quantity < 1 || Number.isNaN(quantity)) return res.status(400).json({ msg: 'Quantity of product must be between 15 and 1' })

    const cartId = (function () {
        if (req.user && req.user.interaction && req.user.interaction.cart) return req.user.interaction.cart
        return req.cookies.cart
    })()

    let product
    let cart
    await Promise.all([await Pizza.findById(productId), await Cart.findById(cartId)])
        .then(values => {
            product = values[0]
            cart = values[1]
        })

    if (cart && product) {
        if (cart.user && !req?.user?.interaction?.cart?.equals(cart._id)) {
            return res.status(400).json({ msg: `You don't have permission to edit this cart`, code: 400 })
        }

        let prevProduct = cart?.items?.filter(pro => pro?.item?.equals(productId))[0]
        if (prevProduct && product.show === false) {
            cart.items = cart.items.filter(pro => !pro?.item?.equals(productId))
            if (product.show === false) {
                await Promise.all([cart.save(), cart.populate('items.item')])
                return res.status(400).json({ msg: "Product in cart was no longer for sale", cart, code: 300, codeE: 1 })
            }
            return res.status(400).json({ msg: "Your cart doesn't have this product", cart, code: 300, codeE: 2 })
        }
        prevProduct.quantity = quantity
        prevProduct.totalPrice = (quantity * product.price).toFixed(2)
        cart.items = cart.items.map(item => {
            if (item.item === prevProduct.item) return prevProduct
            return item
        })
        await cart.save()
        res.status(200).json({
            msg: 'Product quantity updated',
            qnt: prevProduct.quantity,
            totalCartPrice: cart.totalCartPrice
        })
    } else {
        res.status(400).json({ msg: 'ProductID or CartID was not found', code: 300 })
    }
}))

router.get('/getCartAndUser', catchAsync(async function (req, res, next) {
    let cart

    if (req.user && req.user.interaction && req.user.interaction.cart) {
        let findCart
        try { findCart = await Cart.findById(req.user.interaction.cart).populate('items.item') }
        catch (e) { }

        if (!findCart) {
            const newCart = new Cart()
            newCart.user = req.user._id
            req.user.interaction.cart = newCart._id

            await Promise.all([req.user.save(), newCart.save()])
            cart = newCart
        } else {
            cart = findCart
        }
    } else {
        try {
            const findCart = await Cart.findById(req.cookies.cart).populate('items.item')
            // console.log(findCart)
            if (!findCart.user) cart = findCart
            else {
                return res.status(400).json({ msg: `You don't have permission to view this cart`, code: 400 })
            }
        } catch (e) {
            const newCart = new Cart()
            await newCart.save()
            res.cookie('cart', newCart._id, { httpOnly: true })
            return res.status(400).json({ msg: `Bad cart id`, code: 400, newCart })
        }
    }

    let findNull = false
    cart.items = cart.items.map(item => {
        // console.log(item)
        if (!item.item || !(item?.item?.show === true)) findNull = true
        if (item.item && item?.item?.show === true) return item
    }).filter(item => item)
    if (findNull) await cart.save()

    const user = {
        name: req.user?.name,
        email: req.user?.email,
        roles: req.user?.roles,
        _id: req.user?._id,
        invoiceInfo: req.user?.invoiceInfo,
        shippingAdress: req.user?.shippingAdress,
        orders: req.user?.orders
    }
    // console.log(cart)
    // console.log(cart.items)
    res.status(200).json({ cart: cart, user })
}))

router.get('/getCartCheckout', catchAsync(async function (req, res, next) {
    const cartId = req.query.cart
    const findCart = await Cart.findById(cartId).populate('items.item')

    findCart.items = findCart.items.filter(item => item.item && item.item.show === true)

    if (findCart.user && !findCart.user.equals(req.user._id)) return res.status(403).json({ msg: 'Not allowed to access this cart' })

    let totalPrice = 0
    findCart.items.map(item => {
        console.log(item.item.price, item.quantity)
        totalPrice += (item.item.price * item.quantity)
    })
    findCart.totalCartPrice = totalPrice

    res.status(200).json(findCart)
}))

router.get('/getIdCart', catchAsync(async function (req, res, next) {
    const cart = new Cart()
    await cart.save()
    res.json({ cart: cart._id })
}))

module.exports = router