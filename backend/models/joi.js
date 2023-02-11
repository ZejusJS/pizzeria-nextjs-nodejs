const Joi = require('joi');

module.exports.registerSchema =
    Joi.object({
        name: Joi.string().min(5).max(24).required(),
        email: Joi.string().email({ tlds: { allow: false } }).max(100).required(),
        password: Joi.string().min(8).max(40).required()
    });

module.exports.loginSchema =
    Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }).max(100).required(),
        password: Joi.string().min(8).max(40).required()
    });