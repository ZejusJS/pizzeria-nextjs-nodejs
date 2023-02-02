const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = Schema({
    items: [
        {
            item: {
                type: Schema.Types.ObjectId,
                ref: 'Pizza'
            },
            quantity: Number,
            price: Number,
            totalPrice: Number
        }
    ],
    totalCartPrice: {
        type: Number
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

cartSchema.pre('save', async function(done) {
    let price = 0
    this.items.map(item => price += item.totalPrice)
    this.set('totalCartPrice', price)
    done()
})

// cartSchema.virtual('totalCartPrice').get(function () {
//     let price = 0
//     this.items.map(item => {
//         price += item.totalPrice
//     })
//     return price
// });

module.exports = mongoose.model('Cart', cartSchema);