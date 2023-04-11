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
    const cart = await Cart.findById(cartId())
    // console.log('req.body.productId ----- ', req.body.productId)
    // console.log('req.cookies.cart ------ ', req.cookies.cart)
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

        await cart.save()
        await cart.populate('items.item')
        res.status(200).json(cart)
    } else {
        res.status(400).json({ msg: 'Product or Cart was not found by IDs', code: 300 })
    }
}))

router.post('/deleteItem', catchAsync(async function (req, res, next) {
    const productId = req.body.productId
    // console.log('productId...... ', productId)
    // console.log('req.body...... ', req.body)
    const cartId = function () {
        if (req.user && req.user.interaction && req.user.interaction.cart) return req.user.interaction.cart
        return req.cookies.cart
    }
    // console.log('cartId...... ', cartId())
    const cart = await Cart.findById(cartId()).populate('items.item')
    if (cart.user && req.user.interaction && req.user.interaction.cart && !req.user.interaction.cart.equals(cart._id)) {
        return res.status(400).json({ msg: `You don't have permission to edit this cart`, code: 400 })
    }
    cart.items = cart.items.filter(item => {
        // console.log(item)
        if (!item?.item?.equals(productId)) return item
    })
    await cart.save()
    // console.log(cart)
    // , { $pull: { items: { item: productId } } }, { new: true }
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
    const product = await Pizza.findById(productId)
    const cart = await Cart.findById(cartId)

    if (cart.user && req.user.interaction && req.user.interaction.cart && !req.user.interaction.cart.equals(cart._id)) {
        return res.status(400).json({ msg: `You don't have permission to edit this cart`, code: 400 })
    }

    if (cart && product) {
        let prevProduct = cart?.items?.filter(pro => pro?.item?.equals(productId))[0]
        if (prevProduct && product.show === false) {
            cart.items = cart.items.filter(pro => !pro?.item?.equals(productId))
            if (product.show === false) {
                await cart.save()
                await cart.populate('items.item')
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
        const findCart = await Cart.findById(req.user.interaction.cart).populate('items.item')
        if (!findCart) {
            const newCart = new Cart()
            newCart.user = req.user._id
            req.user.interaction.cart = newCart._id
            await newCart.save()
            await req.user.save()
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
        if (item.item) item.totalPrice = item.quantity * item.item.price
        if (item?.item !== null
            && item?.item !== undefined
            && item?.item?.show === true) {
            return item
        }
    }).filter(item => item)
    if (findNull) await cart.save()

    const user = {
        email: req.user?.email,
        name: req.user?.name,
        roles: req.user?.roles
    }
    // console.log(cart)
    // console.log(cart.items)
    res.status(200).json({ cart: cart, user })
}))

router.get('/getCartCheckout', catchAsync(async function (req, res, next) {
    const cartId = req.query.cart
    const findCart = await Cart.findById(cartId).populate('items.item')

    findCart.items = findCart.items.filter(item => item.item !== null && item.item !== undefined && item.item.show === true)

    console.log(findCart)
    if (findCart.user && !findCart.user.equals(req.user._id)) return res.status(403).json({ msg: 'Not allowed to access this cart' })

    let totalPrice = 0
    const itemsId = findCart.items.map(item => item.item?._id)
    for (let i = 0; i < itemsId.length; i++) {
        findPizza = await Pizza.findById(itemsId[i])
        if (!findPizza) return res.status(400).json({ code: 300 })
        const findItemInCart = findCart.items.filter((item) => findPizza.equals(item.item?._id))[0]
        totalPrice += (findPizza.price * findItemInCart.quantity)
    }
    findCart.totalCartPrice = totalPrice.toFixed(2)
    console.log(findCart)
    res.status(200).json(findCart)
}))

router.get('/getIdCart', catchAsync(async function (req, res, next) {
    const cart = new Cart()
    await cart.save()
    res.json({ cart: cart._id })
}))

module.exports = router