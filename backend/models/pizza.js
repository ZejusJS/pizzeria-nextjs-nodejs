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
    description: {
        type: String
    },
    ingredients: [
        {
            type: String
        }
    ],
    key: {
        type: String
    }
})

module.exports = mongoose.model('Pizza', PizzaSchema);