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


router.post('/card', catchAsync(async function (req, res, next) {
    // const {}
    console.log(req.body)
    const data = {
        merchantId: 'A3492UfuSm',
        orderNo: Math.floor(Math.random() * 9999999999) + 1,
        dttm: new Date().toISOString().replace(/(\.\d{3})|[^\d]/g, ''),
        payOperation: 'payment',
        payMethod: 'card',
        totalAmount: '20000',
        currency: 'CZK',
        closePayment: true,
        returnUrl: 'http://localhost:3000/',
        returnMethod: 'GET',
        cart: [
            {
                "name": "Wireless headphones",
                "quantity": 5,
                "amount": 20000
            },
            {
                "name": "Shipping",
                "quantity": 1,
                "amount": 0,
                "description": "DPL"
            }
        ],
        "customer": {
            "name": "Jan Novák",
            "email": "jan.novak@example.com",
            "mobilePhone": "+420.800300300",
        },
        "order": {
            "type": "purchase",
            "availability": "now",
            "delivery": "shipping",
            "deliveryMode": "1",
            "addressMatch": true,
            "billing": {
                "address1": "Karlova 1",
                "city": "Praha",
                "zip": "11000",
                "country": "CZE",
            }
        },
        language: 'cs'
    }

    const RETEZEC = getRetezec(data)
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
        .then(res => resData = res.data)
        .catch(e => console.log(e))

    let merchantIdBase64url = encodeURIComponent(data.merchantId)
    let payIdBase64url = encodeURIComponent(resData.payId)
    let dttmBase64url = encodeURIComponent(resData.dttm)

    const RETEZEC_PROCESS = getRetezec({ merchantId: data.merchantId, payId: resData.payId, dttm: resData.dttm })
    const signProcess = crypto.sign("SHA256", RETEZEC_PROCESS, CSOB_PRIVATE);
    const signatureProcess = signProcess.toString('base64');
    const signatureProcessUri = encodeURIComponent(signatureProcess)

    let url = `https://iapi.iplatebnibrana.csob.cz/api/v1.9/payment/process/${merchantIdBase64url}/${payIdBase64url}/${dttmBase64url}/${signatureProcessUri}`

    console.log(url)
    res.redirect(url)
}))

module.exports = router