const { options } = require('joi');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const ExpressError = require('../utils/ExpressError');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    interaction: {
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart'
        }
    },
})

UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameLowerCase: true,
    usernameCaseInsensitive: true,
    limitAttempts: true,
    maxAttempts: 6,
    unlockInterval: 1000 * 60 * 5,
    errorMessages: {
        UserExistsError: 'email taken'
    }
});


module.exports = mongoose.model('User', UserSchema);