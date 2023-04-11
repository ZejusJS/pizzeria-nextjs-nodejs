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
            totalPrice: Number
        }
    ],
    totalCartPrice: {
        type: Number
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    expiresAtDate: {
        type: Date,
        default: Date.now(),
        expires: 60 * 60 * 24 * 60, // 60 dní 
        ttlMonitorSleepSecs: 60 * 60 * 24 // každý den checkovat expiration
    },
})

cartSchema.pre('save', async function (done) {
    let price = 0
    this.set('expiresAtDate', Date.now())
    if (this.items.length) {
        this.items.map(item => price += item.totalPrice)
        this.set('totalCartPrice', price.toFixed(2))

        let newItems
        newItems = this.items.filter(item => item.item !== null && item?.item?.show !== false)
        this.set('items', newItems)
    }
    done()
})

cartSchema.pre('updateOne', async function (done) {
    let price = 0
    this.set('expiresAtDate', Date.now())
    if (this.items.length) {
        this.items.map(item => price += item.totalPrice)
        this.set('totalCartPrice', price.toFixed(2))

        let newItems
        newItems = this.items.filter(item => item.item !== null && item?.item?.show !== false)
        this.set('items', newItems)
    }
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