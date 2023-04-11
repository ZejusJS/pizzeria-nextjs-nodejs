const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

const OrderSchema = Schema({
    payId: {
        type: String
    },
    url: {
        type: String
    },
    orderNo: {
        type: String
    },
    items: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Pizza'
            },
            quantity: Number,
            price: Number,
            totalPrice: Number
        }
    ],
    totalPrice: {
        type: String
    },
    shippingPrice: {
        type: String
    },
    shippingAdress: {
        firstname: String,
        lastname: String,
        address1: String,
        city: String,
        zip: String,
        country: String,
    },
    invoiceInfo: {
        firstname: String,
        lastname: String,
        address1: String,
        city: String,
        zip: String,
        country: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

OrderSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Order', OrderSchema);