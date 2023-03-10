const express = require('express');
const router = express.Router({ mergeParams: true });
const multer = require('multer')
const { cloudinary } = require('../cloudinary/index')

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const hasCookieCartUser = require('../utils/hasCookieCartUser')
const { mwUploadPizzaImg } = require('../utils/mw-uploadPizzaImg')
const { deleteCloudinary } = require('../utils/deleteCloudinary')
const { mwIsAdmin, mwIsAdminGet } = require('../utils/mw-isAdmin')
const { validatePizza } = require('../utils/mw-validatePizza')

const Pizza = require('../models/pizza')
const Cart = require('../models/cart')
const User = require('../models/user')


router.post('/new-pizza', mwUploadPizzaImg, validatePizza, catchAsync(async function (req, res, next) {
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
                return res.status(400).json({ msg: 'Some values are empty or invalid', err: 'invalid', code: 300 })
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

router.get('/pizza/:id', catchAsync(async function (req, res, next) {
    const { id } = req.params
    const pizza = await Pizza.findById(id)
    if (!pizza) return res.status(404).json({ msg: `Pizza with id "${id}" was not found.` })
    res.json(pizza)
}))

router.delete('/pizza/:id', catchAsync(async function (req, res, next) {
    const { id } = req.params
    const pizza = await Pizza.findOneAndDelete({ _id: id })
    res.status(200).json({ msg: `Pizza "${pizza?.title}" deleted` })
}))

router.put('/pizza/:id', mwUploadPizzaImg, validatePizza, catchAsync(async function (req, res, next) {
    let { title, description, price, ingredients } = req.body
    console.log(req.body)
    console.log(req.files)
    const { id } = req.params
    const pizza = await Pizza.findById(id)
    if (req.files.length) {
        await cloudinary.uploader.destroy(pizza.images[0].filename);
        const { filename, path } = req.files[0]
        pizza.images[0] = { filename, url: path }
    }
    pizza.title = title
    pizza.description = description
    pizza.price = price
    pizza.ingredients = ingredients
    await pizza.save()
    res.status(200).json({ msg: `Pizza "${pizza.title}" updated` })
}))

module.exports = router