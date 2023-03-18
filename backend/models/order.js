const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
            type: Object
        }
    ],
    totalPrice: {
        type: String
    },
    shippingPrice: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

module.exports = mongoose.model('Order', OrderSchema);