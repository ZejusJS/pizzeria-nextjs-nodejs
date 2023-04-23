const express = require('express');
const crypto = require('crypto');
const fs = require('fs')
const axios = require('axios')
const router = express.Router({ mergeParams: true });

const CSOB_PRIVATE = fs.readFileSync('./keys/rsa_A3492UfuSm.key', 'utf8')
const CSOB_PUBLIC = fs.readFileSync('./keys/rsa_A3492UfuSm.txt', 'utf8')

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const getRetezec = require('../utils/func/getRetezec')
const emptyCart = require('../utils/func/emptyCart');

const { mwCardPaymentPoints } = require('../utils/limiter')

const Pizza = require('../models/pizza')
const Cart = require('../models/cart')
const User = require('../models/user')
const Order = require('../models/order')

const { validatePayment } = require('../utils/mw-validatePayment')
const { mwIsLoggedIn } = require('../utils/mw-isLoggedIn');
const { mwRecaptcha } = require('../utils/payment/recaptcha')

const merchantId = 'A3492UfuSm'


router.post('/card', mwIsLoggedIn, validatePayment, mwRecaptcha, mwCardPaymentPoints, catchAsync(async function (req, res, next) {
    const { firstname, lastname, adress, city, zip, shipping } = req.body
    const items = []
    let totalPriceItems = 0
    let totalPrice = 0
    let shippingPrice = shipping === 'standard' ? 70 : 90
    let firstName = firstname
    let lastName = lastname
    // let fullname = (firstName + ' ' + lastName).slice(0, 45)

    const findUser = await User.findById(req.user._id)
    // const billingFullname = (findUser.invoiceInfo.firstname + ' ' + findUser.invoiceInfo.lastname).slice(0, 45)

    const itemsId = req.body.cartData.items.map(item => item.item?._id)

    for (let i = 0; i < itemsId.length; i++) {
        const findPizza = await Pizza.findById(itemsId[i])
        if (!findPizza || findPizza.show === false) return res.status(400).json({ code: 300 })
        const findItemInCart = req.body.cartData.items.filter((item) => findPizza.equals(item.item?._id))[0]
        let totalPriceItem = (findPizza.price * findItemInCart.quantity)
        totalPriceItems += totalPriceItem
        items.push({
            item: findPizza._id,
            totalPrice: totalPriceItem,
            quantity: findItemInCart.quantity,
            price: findPizza.price
        })
    }
    if (!items.length) return res.status(400).json({ code: 300, msg: 'No items in cart' })

    totalPrice = totalPriceItems + shippingPrice

    // console.log(totalPriceItems)
    // console.log(shippingPrice)
    // console.log(totalPrice)

    const data = {
        merchantId: merchantId,
        orderNo: Math.floor(Math.random() * 9999999999) + 1,
        dttm: new Date().toISOString().replace(/(\.\d{3})|[^\d]/g, ''),
        payOperation: 'payment',
        payMethod: 'card',
        totalAmount: (totalPrice * 100).toFixed(0),
        currency: 'CZK',
        closePayment: true,
        returnUrl: process.env.FRONTEND + `/user/profile/orders`,
        returnMethod: 'GET',
        cart: [
            {
                "name": "Mamma Mia",
                "quantity": 1,
                "amount": (totalPriceItems * 100).toFixed(0),
                "description": 'Purchase in Mamma Mia store'
            },
            {
                "name": "Shipping",
                "quantity": 1,
                "amount": (shippingPrice * 100).toFixed(0),
                "description": req.body.shipping
            }
        ],
        "customer": {
            "name": req.user.name,
            "email": req.user.email,
            // "mobilePhone": "+420.800300300",
        },
        "order": {
            "type": "purchase",
            "availability": "now",
            "delivery": "shipping",
            "deliveryMode": "1",
            "addressMatch": false,
            "billing": {
                "address1": findUser.invoiceInfo.adress,
                "city": findUser.invoiceInfo.city,
                "zip": findUser.invoiceInfo.zip,
                "country": "CZE",
            },
            "shipping": {
                "address1": adress,
                "city": city,
                "zip": zip,
                "country": "CZE",
            },
        },
        language: 'en'
    }

    const RETEZEC = getRetezec(data)
    const sign = crypto.createSign('SHA256')
    sign.update(RETEZEC)
    sign.end()
    const signature = sign.sign(CSOB_PRIVATE);
    const signatureString = signature.toString('base64');
    data.signature = signatureString

    let resData = {}

    await axios({
        method: 'post',
        url: 'https://iapi.iplatebnibrana.csob.cz/api/v1.9/payment/init',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
        .then(ress => resData = ress.data)
        .catch(e => e)

    let merchantIdBase64url = encodeURIComponent(data.merchantId)
    let payIdBase64url = encodeURIComponent(resData.payId)
    let dttmBase64url = encodeURIComponent(resData.dttm)

    const RETEZEC_PROCESS = getRetezec({ merchantId: data.merchantId, payId: resData.payId, dttm: resData.dttm })
    const signProcess = crypto.createSign('SHA256')
    signProcess.update(RETEZEC_PROCESS)
    signProcess.end()
    const signatureProcess = signProcess.sign(CSOB_PRIVATE);
    const signatureProcessString = signatureProcess.toString('base64');
    const signatureProcessUri = encodeURIComponent(signatureProcessString)

    let url = `https://iapi.iplatebnibrana.csob.cz/api/v1.9/payment/process/${merchantIdBase64url}/${payIdBase64url}/${dttmBase64url}/${signatureProcessUri}`

    const order = new Order({
        payId: resData.payId,
        url: url,
        orderNo: data.orderNo,
        totalPrice: (data.totalAmount / 100).toFixed(2),
        shippingPrice,
        shippingAdress: { ...data.order.shipping, firstname, lastname },
        invoiceInfo: { ...data.order.billing, firstname: req.user.invoiceInfo.firstname, lastname: req.user.invoiceInfo.lastname },
        user: req.user._id
    })
    // console.log(req.body.cartData.items)
    order.items = items
    await order.save()
    findUser.orders.unshift(order._id)
    await findUser.save()

    await emptyCart(req.body.cartData._id)

    // console.log(url)
    res.status(200).json({ url })
}))


router.get('/check-status/:id/:payId', mwIsLoggedIn, catchAsync(async function (req, res, next) {
    const { id } = req.params

    const order = await Order.findOne({ _id: id, user: req.user._id })
    if (!order) return res.status(404).json({ msg: "Requested order was not found" })

    const payId = order.payId

    const data = {
        paymentStatus: 0
    }

    if (!order.paymentStatus) {
        const dttm = new Date().toISOString().replace(/(\.\d{3})|[^\d]/g, '')

        const payIdUri = encodeURIComponent(payId)
        const dttmUri = encodeURIComponent(dttm)
        const merchantIdUri = encodeURIComponent(merchantId)
    
        const RETEZEC_STATUS = getRetezec({ merchantId, payId, dttm })
        const signStatus = crypto.createSign('SHA256')
        signStatus.update(RETEZEC_STATUS)
        signStatus.end()
        const signatureStatus = signStatus.sign(CSOB_PRIVATE)
        const signatureStatusString = signatureStatus.toString('base64')
        const signatureStatusUri = encodeURIComponent(signatureStatusString)

        await axios({
            method: 'get',
            url: `https://iapi.iplatebnibrana.csob.cz/api/v1.9/payment/status/${merchantIdUri}/${payIdUri}/${dttmUri}/${signatureStatusUri}`
        })
            .then(async response => {
                // console.log(res.data)
                const statusRes = response?.data?.paymentStatus
                if (!statusRes) return res.status(500).json({ msg: 'Error with receiving a payment status' })

                console.log(statusRes)

                if (statusRes === 6 || statusRes === 8 || statusRes === 10) {
                    console.log('save order')
                    order.paymentStatus = statusRes
                    await order.save()
                }

                data.paymentStatus = statusRes
            })
            .catch(e => {
                return res.status(500).json({ msg: 'Error with receiving a payment status' })
                console.error(e)
            })
    } else {
        console.log('status from db')
        res.set('Cache-Control', 'public, max-age=200, must-revalidate')
        data.paymentStatus = order.paymentStatus
    }

    return res.status(200).json(data)
}))

router.get('/orders/:ids', mwIsLoggedIn, catchAsync(async function (req, res, next) {
    const { ids } = req.params
    const orders = (await Order.find({ _id: { $in: ids.split(',') }, user: req.user._id }).populate('items.item')).reverse()
    if (!orders) return res.status(400).json({ msg: 'Bad ids or you are not allowed to view this orders', code: 300 })

    res.set('Cache-Control', 'public, max-age=300000, must-revalidate')

    return res.status(200).json({ orders })
}))

router.get('/order/:payId', mwIsLoggedIn, catchAsync(async function (req, res, next) {
    const { payId } = req.params

    const order = await Order.findOne({ payId, user: req.user._id }).populate('items.item')
    if (!order) return res.status(404).json({ msg: "Can't find this order", code: 300 })

    const dttm = new Date().toISOString().replace(/(\.\d{3})|[^\d]/g, '')

    const payIdUri = encodeURIComponent(order.payId)
    const dttmUri = encodeURIComponent(dttm)
    const merchantIdUri = encodeURIComponent(merchantId)

    const RETEZEC_STATUS = getRetezec({ merchantId, payId: order.payId, dttm })
    const signStatus = crypto.createSign('SHA256')
    signStatus.update(RETEZEC_STATUS)
    signStatus.end()
    const signatureStatus = signStatus.sign(CSOB_PRIVATE)
    const signatureStatusString = signatureStatus.toString('base64')
    const signatureStatusUri = encodeURIComponent(signatureStatusString)

    let paymentStatus = 0

    await axios({
        method: 'get',
        url: `https://iapi.iplatebnibrana.csob.cz/api/v1.9/payment/status/${merchantIdUri}/${payIdUri}/${dttmUri}/${signatureStatusUri}`
    })
        .then(res => {
            // console.log(res.data)
            paymentStatus = res?.data?.paymentStatus
        })
        .catch(e => console.error(e))

    const data = {...order._doc, paymentStatus}
    res.status(200).json(data)
}))

// router.post('/google-pay-echo', catchAsync(async function (req, res, next) {
//     const dttm = new Date().toISOString().replace(/(\.\d{3})|[^\d]/g, '')
//     const RETEZEC_STATUS = getRetezec({ merchantId, dttm })
//     const signStatus = crypto.createSign('SHA256')
//     signStatus.update(RETEZEC_STATUS)
//     signStatus.end()
//     const signatureStatus = signStatus.sign(CSOB_PRIVATE);
//     const signatureStatusString = signatureStatus.toString('base64');

//     let data = {}
//     await axios({
//         method: 'post',
//         url: 'https://iapi.iplatebnibrana.csob.cz/api/v1.9/googlepay/echo',
//         data: {
//             merchantId,
//             dttm,
//             signature: signatureStatusString
//         }
//     })
//         .then(res => data = res.data)
//         .catch(e => console.log(e))

//     res.json(data)
// }))

module.exports = router