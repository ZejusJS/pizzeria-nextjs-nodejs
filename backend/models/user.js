const { options, boolean } = require('joi');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const ExpressError = require('../utils/ExpressError');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
    interaction: {
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart'
        }
    },
    admin: {
        type: Boolean
    }
}, { timestamps: true })

// UserSchema.plugin(passportLocalMongoose, {
//     usernameField: 'email',
//     usernameLowerCase: true,
//     usernameCaseInsensitive: true,
//     limitAttempts: true,
//     maxAttempts: 6,
//     unlockInterval: 1000 * 60 * 5,
//     errorMessages: {
//         UserExistsError: 'email taken'
//     }
// });


module.exports = mongoose.model('User', UserSchema);