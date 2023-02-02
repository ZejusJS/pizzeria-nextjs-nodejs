const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const Pizza = require('../models/pizza')


router.get('/all', catchAsync(async function (req, res, next) {
    const pizzas = await Pizza.find()
    const sendPizzas = pizzas.map(pizza => {
        return {
            title: pizza.title,
            description: pizza.description,
            images: pizza.images,
            price: pizza.price,
            ingredients: pizza.ingredients,
            key: pizza.key,
            _id: pizza._id,
            currency: pizza.currency
        }
    })
    res.status(200).json(sendPizzas)
}))



module.exports = router