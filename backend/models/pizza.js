const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

const PizzaSchema = new Schema({
    title: {
        type: String
    },
    images: [
        {
            url: {
                type: String
            },
            filename: {
                type: String
            }
        }
    ],
    price: {
        type: Number
    },
    currency: {
        type: String
    },
    description: {
        type: String
    },
    ingredients: [
        {
            type: String
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model('Pizza', PizzaSchema);