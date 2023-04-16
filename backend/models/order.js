const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

const OrderSchema = Schema({
    payId: {
        type: String,
        required: true
    },
    url: {
        type: String
    },
    orderNo: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: Number
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
        type: Number,
        required: true
    },
    shippingPrice: {
        type: Number,
        required: true
    },
    shippingAdress: {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        address1: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        zip: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
    },
    invoiceInfo: {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        address1: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        zip: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

OrderSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Order', OrderSchema);