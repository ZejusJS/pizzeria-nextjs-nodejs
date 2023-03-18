const { options, boolean } = require('joi');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const ExpressError = require('../utils/ExpressError');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
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
        adress: {
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
        }
    },
    shippingAdress: {
        firstname: {
            type: String
        },
        lastname: {
            type: String
        },
        adress: {
            type: String
        },
        city: {
            type: String
        },
        zip: {
            type: String
        },
        country: {
            type: String
        }
    },
    interaction: {
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart'
        }
    },
    roles: {
        admin: {
            type: Boolean
        },
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],
    // refreshToken: [String]
}, { timestamps: true })

UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameLowerCase: true,
    usernameCaseInsensitive: true,
    // limitAttempts: true,
    // maxAttempts: 6,
    unlockInterval: 1000 * 60 * 5,
    errorMessages: {
        UserExistsError: 'email taken'
    }
});


module.exports = mongoose.model('User', UserSchema);