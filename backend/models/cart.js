const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = Schema({
    cartSession: {
        type: String
    },
    items: [
        {
            itemId: String,
            quantity: Number
        }
    ]
})

module.exports = mongoose.model('Cart', cartSchema);