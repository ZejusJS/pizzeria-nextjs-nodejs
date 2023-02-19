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

const Pizza = require('../models/pizza')
const Cart = require('../models/cart')
const User = require('../models/user')


router.post('/card', catchAsync(async function (req, res, next) {
    const { firstname, lastname, adress, city, zip } = req.body
    const items = []
    let totalPriceItems = 0
    let totalPrice = 0
    let shippingPrice = req.body.shipping === 'standard' ? 70 : 90
    let firstName = firstname.replace(/[\s.;,'"$<>*÷×()/|?%0-9]/g, '')
    let lastName = lastname.replace(/[\s.;,'"$<>*÷×()/|?%0-9]/g, '')
    let fullname = (firstName + ' ' + lastName).slice(0, 45)

    const findUser = await User.findById(req.user._id)
    // const billingFullname = (findUser.invoiceInfo.firstname + ' ' + findUser.invoiceInfo.lastname).slice(0, 45)

    const itemsId = req.body.cartData.items.map(item => item.item._id)

    for (let i = 0; i < itemsId.length; i++) {
        findPizza = await Pizza.findById(itemsId[i])
        const findItemInCart = req.body.cartData.items.filter((item) => findPizza.equals(item.item._id))[0]
        totalPriceItems += (findPizza.price * findItemInCart.quantity)
        items.push(findPizza)
    }
    totalPrice = totalPriceItems + shippingPrice

    console.log(totalPriceItems)
    console.log(shippingPrice)
    console.log(totalPrice)

    const data = {
        merchantId: 'A3492UfuSm',
        orderNo: Math.floor(Math.random() * 9999999999) + 1,
        dttm: new Date().toISOString().replace(/(\.\d{3})|[^\d]/g, ''),
        payOperation: 'payment',
        payMethod: 'card',
        totalAmount: totalPrice * 100,
        currency: 'CZK',
        closePayment: true,
        returnUrl: process.env.FRONTEND,
        returnMethod: 'GET',
        cart: [
            {
                "name": "Purchase Mamma Mia",
                "quantity": 1,
                "amount": totalPriceItems * 100,
                "description": 'Purchase in Mamma Mia store' 
            },
            {
                "name": "Shipping",
                "quantity": 1,
                "amount": shippingPrice * 100,
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
    // return res.send(data)

    const RETEZEC = getRetezec(data)
    console.log(RETEZEC)
    const sign = crypto.sign("SHA256", RETEZEC, CSOB_PRIVATE);
    const signature = sign.toString('base64');
    data.signature = signature

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
        .catch(e => console.log(e))

    let merchantIdBase64url = encodeURIComponent(data.merchantId)
    let payIdBase64url = encodeURIComponent(resData.payId)
    let dttmBase64url = encodeURIComponent(resData.dttm)

    const RETEZEC_PROCESS = getRetezec({ merchantId: data.merchantId, payId: resData.payId, dttm: resData.dttm })
    const signProcess = crypto.sign("SHA256", RETEZEC_PROCESS, CSOB_PRIVATE);
    const signatureProcess = signProcess.toString('base64');
    const signatureProcessUri = encodeURIComponent(signatureProcess)

    let url = `https://iapi.iplatebnibrana.csob.cz/api/v1.9/payment/process/
    ${merchantIdBase64url}/${payIdBase64url}/${dttmBase64url}/${signatureProcessUri}`

    // console.log(url)
    res.status(200).json({ url })
}))

module.exports = router