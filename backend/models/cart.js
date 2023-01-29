const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = Schema({
    items: [
        {
            item: {
                type: Schema.Types.ObjectId,
                ref: 'Pizza'
            },
            quantity: Number
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Cart', cartSchema);