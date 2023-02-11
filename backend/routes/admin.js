const express = require('express');
const router = express.Router({ mergeParams: true });
const multer = require('multer')

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const hasCookieCartUser = require('../utils/hasCookieCartUser')
const { mwUploadPizzaImg } = require('../utils/mw-uploadPizzaImg')
const { deleteCloudinary } = require('../utils/deleteCloudinary')
const { mwIsAdmin, mwIsAdminGet } = require('../utils/mw-isAdmin')

const Pizza = require('../models/pizza')
const Cart = require('../models/cart')
const User = require('../models/user')


router.post('/new-pizza', mwUploadPizzaImg, catchAsync(async function (req, res, next) {
    const { title, price, currency, description, ingredients } = req.body
    if (req.files.length) {
        const { filename, path } = req.files[0]
        if (currency === 'CZK') {
            if (title.length && price.length && !isNaN(price) && description.length && ingredients.length && Array.isArray(ingredients)) {
                const pizza = new Pizza({
                    title,
                    price,
                    currency,
                    description,
                    ingredients,
                    images: [{ filename, url: path }]
                })

                await pizza.save()

                res.status(200).json(pizza)
            } else {
                await deleteCloudinary(req, res, next)
                return res.status(400).json({ msg: 'Some values are empty or invalid', err: 'invalid' })
            }
        } else {
            await deleteCloudinary(req, res, next)
            return res.status(400).json({ msg: 'Only CZK, USD and EUR are allowed.', err: 'currency' })
        }
    } else {
        await deleteCloudinary(req, res, next)
        res.status(400).json({ msg: 'Must include image.', err: 'img' })
    }

}))

router.get('/isAdmin', mwIsAdminGet)

module.exports = router