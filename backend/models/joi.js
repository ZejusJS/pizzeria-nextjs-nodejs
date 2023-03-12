const Joi = require('joi');

module.exports.registerSchema =
    Joi.object({
        name: Joi.string().min(5).max(24).required(),
        email: Joi.string().email({ tlds: { allow: false } }).max(100).required(),
        password: Joi.string().min(8).max(40).required(),
        firstname: Joi.string().min(1).max(30).required(),
        lastname: Joi.string().min(1).max(30).required(),
        adress: Joi.string().min(1).max(50).required(),
        city: Joi.string().min(1).max(50).required(),
        zip: Joi.string().min(1).max(16).required()
    }).required()

module.exports.loginSchema =
    Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }).max(100).required(),
        password: Joi.string().min(8).max(40).required(),
        newCart: Joi.boolean().required()
    }).required()

module.exports.paymentSchema =
    Joi.object({
        firstname: Joi.string().max(30).required(),
        lastname: Joi.string().max(30).required(),
        adress: Joi.string().max(50).required(),
        city: Joi.string().max(50).required(),
        zip: Joi.string().max(16).required(),
        shipping: Joi.string().max(30).pattern(/^(fast|standard)$/).required(),
        paymentMethod: Joi.string().max(30).pattern(/^(card)$/).required(),
        cartData: Joi.object({
            items: Joi.array().required(),
            _id: Joi.string().required(),
        }).required(),
    }).required()

module.exports.adressShippingSchema =
    Joi.object({
        firstname: Joi.string().min(0).max(30),
        lastname: Joi.string().min(0).max(30),
        adress: Joi.string().min(0).max(50),
        city: Joi.string().min(0).max(50),
        zip: Joi.string().min(0).max(16),
    }).required()

module.exports.userBillingSchema =
    Joi.object({
        firstname: Joi.string().max(30).required(),
        lastname: Joi.string().max(30).required(),
        adress: Joi.string().max(50).required(),
        city: Joi.string().max(50).required(),
        zip: Joi.string().max(16).required(),
    }).required()

module.exports.userDetailsSchema =
    Joi.object({
        name: Joi.string().max(24).required(),
    }).required()

module.exports.pizzaSchema =
    Joi.object({
        title: Joi.string().max(30).required(),
        description: Joi.string().max(1000).required(),
        price: Joi.number().max(1000000).required(),
        currency: Joi.string().max(6).required(),
        ingredients: Joi.array().required(),
        image: Joi.string().min(0),
    }).required()