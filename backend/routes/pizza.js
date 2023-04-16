const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');

const { getOrSetexCached } = require('../utils/func/redis')

const Pizza = require('../models/pizza')
const Ingredients = require('../models/ingredients')

let ingredientsExp = 10000
let pizzasAllExp = 10000
let pizzasIngsExp = 9000

router.get('/all', catchAsync(async function (req, res, next) {
    let { ingredients, q } = req.query
    if (ingredients?.length) ingredients = ingredients.split(',')

    let pizzas
    const config = { show: true }
    if (ingredients) {
        config.ingredients = { $all: ingredients } // $all = musí splňovat vše
    }
    if (q) {
        config.$or = [
            { 'title': new RegExp(q, 'i') },
            { 'description': new RegExp(q, 'i') },
            { 'ingredients': new RegExp(q, 'i') },
        ]
    }

    if (!ingredients && !q) {
        pizzas = await getOrSetexCached('pizzas', pizzasAllExp, async () => {
            return await Pizza.find(config).select({ show: 0, createdAt: 0, updatedAt: 0 }).sort({ updatedAt: -1 })
        })
    } else if (ingredients && !q) {
        console.log('aaaaaaaaaaa')
        pizzas = await getOrSetexCached(`pizzasingrs:${ingredients}`, pizzasIngsExp, async () => {
            console.log('bbbbbbbb')
            return await Pizza.find(config).select({ show: 0, createdAt: 0, updatedAt: 0 }).sort({ updatedAt: -1 })
        })
    } else {
        pizzas = await Pizza.find(config).select({ show: 0, createdAt: 0, updatedAt: 0 }).sort({ updatedAt: -1 })
    }

    res.status(200).json(pizzas)
}))

router.get('/get-many-number/:num', catchAsync(async function (req, res, next) {
    const { num } = req.params

    if (!num || isNaN(num)) return res.status(400).json({ code: 300, msg: 'Provide only a number' })

    let pizzas = await Pizza.paginate({ show: true }, {
        sort: { updatedAt: -1 },
        limit: num,
        page: 1,
        select: { show: 0, createdAt: 0, updatedAt: 0 }
    })
    // console.log(pizzas)
    res.status(200).json(pizzas)
}))

router.get('/get-many/:ids', catchAsync(async function (req, res, next) {
    const { ids } = req.params
    let pizzas = await Pizza.find({ _id: { $in: ids.split(',') } }).select({ show: 0 });
    // console.log(pizzas)
    res.status(200).json(pizzas)
}))

router.get('/all-ingredients', catchAsync(async function (req, res, next) {
    let ingredients
    console.log(ingredients)
    ingredients = await getOrSetexCached('ingredients', ingredientsExp, async () => {
        return await Ingredients.findOne()
    })

    res.set('Cache-Control', 'public, max-age=300, must-revalidate')

    return res.status(200).json(ingredients.allIngredients)
}))

module.exports = router