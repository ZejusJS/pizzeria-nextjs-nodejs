const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const Pizza = require('../models/pizza')


router.get('/all', catchAsync(async function (req, res, next) {
    let { ingredients } = req.query
    if (ingredients?.length) ingredients = ingredients.split(',')
    let pizzas
    if (ingredients?.length) {
        pizzas = await Pizza.find({ ingredients: { $all: ingredients } }) // $all = musí splňovat vše
    } else {
        pizzas = await Pizza.find() // $all = musí splňovat vše
    }
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
    const pizzas = await Pizza.find()
    let ingredients = []
    pizzas.map(pizza => {
        pizza.ingredients.map(ingr => {
            let prevIngrs = ingredients.filter(i => i.name === ingr)
            if (prevIngrs.length) {
                console.log(prevIngrs)
                ingredients = ingredients.filter(i => i.name !== prevIngrs[0].name)
                ingredients.push({
                    name: ingr,
                    nums: prevIngrs.length + 1
                })
            } else {
                ingredients.push({
                    name: ingr,
                    nums: 1
                })
            }
        })
    })
    res.status(200).json(ingredients)
}))

module.exports = router