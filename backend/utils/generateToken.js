const jwt = require('jsonwebtoken')

module.exports = function generateToken(id) {
    return jwt.sign({ id }, process.env.SECRET_JWT_ACCESS, {
        expiresIn: '20d', algorithm: 'HS384'
    })
}