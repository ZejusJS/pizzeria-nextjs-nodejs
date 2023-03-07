const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { mwIsAdmin } = require('../utils/mw-isAdmin');

const Pizza = require('../models/pizza')
const Ingredients = require('../models/ingredients')


router.get('/all', catchAsync(async function (req, res, next) {
    let { ingredients, q } = req.query
    if (ingredients?.length) ingredients = ingredients.split(',')

    const config = {}
    if (ingredients?.length) {
        config.ingredients = { $all: ingredients } // $all = musí splňovat vše
    }
    if (q?.length) {
        config.$or = [
            { 'title': { "$regex": q, "$options": "i" } },
            { 'description': { "$regex": q, "$options": "i" } }
        ]
    }
    let pizzas = await Pizza.find(config)
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

router.get('/all-ingredients', catchAsync(async function (req, res, next) {
    const ingredients = await Ingredients.findOne()
    res.status(200).json(ingredients.allIngredients)
}))

router.delete('/:id', mwIsAdmin, catchAsync(async function (req, res, next) {
    const id = req.params.id
    const pizza = await Pizza.deleteOne({ _id: id })
    res.status(200).json({ msg: `Pizza "${pizza?.title}" deleted` })
}))

module.exports = router