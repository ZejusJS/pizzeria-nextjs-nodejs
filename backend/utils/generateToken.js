const jwt = require('jsonwebtoken')

module.exports = function generateToken(user) {
    return jwt.sign({ id: user.id, name: user.name, email: user.email, admin: user.roles?.admin }, process.env.SECRET_JWT_ACCESS, {
        expiresIn: '30m', algorithm: 'HS384'
    })
}