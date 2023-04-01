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

    const config = { show: true }
    if (ingredients?.length) {
        config.ingredients = { $all: ingredients } // $all = musí splňovat vše
    }
    if (q?.length) {
        config.$or = [
            { 'title': new RegExp(q, 'i') },
            { 'description': new RegExp(q, 'i') },
            { 'ingredients': new RegExp(q, 'i') },
        ]
    }
    let pizzas = await Pizza.find(config).select({ show: 0 }).sort({ updatedAt: -1 })
    res.status(200).json(pizzas)
}))

router.post('/get-many', catchAsync(async function (req, res, next) {
    const { ids } = req.body
    let pizzas = await Pizza.find({ _id: ids }).select({ show: 0 });
    // console.log(pizzas)
    res.status(200).json(pizzas)
}))

router.get('/all-ingredients', catchAsync(async function (req, res, next) {
    const ingredients = await Ingredients.findOne()
    res.status(200).json(ingredients.allIngredients)
}))

module.exports = router