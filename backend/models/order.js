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
        type: Object
    },
    invoiceInfo: {
        type: Object
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

OrderSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Order', OrderSchema);